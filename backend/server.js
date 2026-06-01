/**
 * Wellness Mobile Spa — Voucher Backend
 * Express + SQLite + Yoco Payments + Nodemailer
 *
 * Payment confirmation strategy: successUrl polling
 * ─────────────────────────────────────────────────
 * Instead of relying on Yoco webhook subscriptions (which require a plan
 * upgrade), we use Yoco's checkout successUrl redirect flow:
 *
 *  1. Create checkout with successUrl = /api/payment-success?voucher_id=XXX
 *  2. Customer pays → Yoco redirects them to that URL
 *  3. That endpoint calls Yoco's GET /api/checkouts/:id to verify the status
 *  4. If status === "succeeded", mark voucher as issued and send email
 *
 * This works with any Yoco plan, no webhook registration needed.
 */

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

// ─── Bootstrap ────────────────────────────────────────────────────────────────

dotenv.config();

const REQUIRED_ENV = ["YOCO_SECRET", "EMAIL_USER", "EMAIL_PASS", "BASE_URL"];
const missingEnv = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missingEnv.length) {
  console.error(
    `[startup] Missing required env vars: ${missingEnv.join(", ")}`,
  );
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IS_PROD = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

// BASE_URL is your public-facing URL — add to .env:
// BASE_URL=https://smooth-satiable-splicing.ngrok-free.dev
const BASE_URL = process.env.BASE_URL.replace(/\/$/, "");

// ─── Database ─────────────────────────────────────────────────────────────────

let db;

async function initDb() {
  db = await open({
    filename: path.join(__dirname, "vouchers.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vouchers (
      voucher_id         TEXT PRIMARY KEY,
      voucher_code       TEXT UNIQUE NOT NULL,
      purchase_name      TEXT NOT NULL,
      purchase_email     TEXT NOT NULL,
      recipient_name     TEXT NOT NULL,
      recipient_email    TEXT NOT NULL,
      recipient_phone    TEXT,
      amount             REAL NOT NULL,
      currency           TEXT NOT NULL,
      status             TEXT NOT NULL DEFAULT 'pending',
      yoco_checkout_id   TEXT,
      yoco_payment_id    TEXT,
      created_at         TEXT NOT NULL,
      paid_at            TEXT,
      issued_at          TEXT,
      redeemed_at        TEXT,
      redeemed_by        TEXT,
      redemption_channel TEXT,
      metadata           TEXT
    );
  `);

  console.log("[db] Initialised — vouchers table ready.");
}

// ─── Voucher helpers ──────────────────────────────────────────────────────────

function generateVoucherCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 12 }, (_, i) => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    return i === 3 || i === 7 ? char + "-" : char;
  }).join("");
}

// ─── Email ────────────────────────────────────────────────────────────────────

async function sendVoucherEmail({
  recipientEmail,
  voucherCode,
  amount,
  currency,
  purchaseName,
}) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Wellness Mobile Spa" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Your Wellness Mobile Spa Voucher — gifted by ${purchaseName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#4a7c59">You've received a gift voucher! 🌿</h2>
        <p>Hi there,</p>
        <p><strong>${purchaseName}</strong> has gifted you a Wellness Mobile Spa voucher.</p>
        <table style="border-collapse:collapse;width:100%">
          <tr>
            <td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Voucher Code</strong></td>
            <td style="padding:8px;border:1px solid #ddd;font-size:1.3em;letter-spacing:2px"><strong>${voucherCode}</strong></td>
          </tr>
          <tr>
            <td style="padding:8px;border:1px solid #ddd;background:#f9f9f9"><strong>Value</strong></td>
            <td style="padding:8px;border:1px solid #ddd">${currency} ${(amount / 100).toFixed(2)}</td>
          </tr>
        </table>
        <p style="margin-top:20px">To redeem, contact us via WhatsApp or email and quote your voucher code.</p>
        <p style="color:#888;font-size:0.85em">Thank you for choosing Wellness Mobile Spa.</p>
      </div>
    `,
  });

  console.log(`[email] Voucher email sent to ${recipientEmail}`);
}

/**
 * Sends a non-editable notification to the admin when a voucher is redeemed.
 * This ensures the admin is alerted immediately without relying on the client's device.
 */
async function sendAdminNotification({
  redeemerName,
  voucherCode,
  amount,
  currency,
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;

  // 1. Email Notification (Reliable fallback)
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Wellness Mobile Spa" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `[ALERT] Voucher Redeemed: ${voucherCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;border:2px solid #4a7c59;padding:20px;border-radius:8px">
        <h2 style="color:#4a7c59;margin-top:0">Voucher Redemption Alert 🌿</h2>
        <p>A voucher has just been successfully redeemed via the website.</p>
        <div style="background:#f4f7f4;padding:15px;border-radius:4px">
          <p style="margin:5px 0"><strong>Redeemed By:</strong> ${redeemerName}</p>
          <p style="margin:5px 0"><strong>Voucher Code:</strong> <span style="font-family:monospace;font-size:1.1em">${voucherCode}</span></p>
          <p style="margin:5px 0"><strong>Value:</strong> ${currency} ${(amount / 100).toFixed(2)}</p>
        </div>
        <p style="font-size:0.85em;color:#666;margin-top:20px">
          This is an automated security notification.
        </p>
      </div>
    `,
  });
  console.log(`[admin-notif] Email alert sent to ${adminEmail}`);

  // 2. WhatsApp Notification (via API - Placeholder for Twilio/MessageBird)
  if (adminPhone && process.env.WHATSAPP_API_KEY) {
  console.log(`[admin-notif] Triggering WhatsApp API for ${adminPhone}...`);
  // Example: await twilio.messages.create({ body: `Voucher ${voucherCode} redeemed by ${redeemerName}`, from: '...', to: adminPhone });
  } else {
  console.log("[admin-notif] WhatsApp notification skipped (missing config).");
  }
  }

  /**
  * Sends an email to the admin when someone fills out the contact form.
  */
  async function sendContactEmail({ name, email, message }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  });

  await transporter.sendMail({
  from: `"Wellness Mobile Spa — Contact" <${process.env.EMAIL_USER}>`,
  to: adminEmail,
  replyTo: email,
  subject: `New Message from ${name}`,
  html: `
    <div style="font-family:sans-serif;max-width:520px;border:1px solid #ddd;padding:20px;border-radius:8px">
      <h2 style="color:#4a7c59;margin-top:0">New Website Message 🌿</h2>
      <p>You have received a new message from the contact form.</p>
      <div style="background:#f9f9f9;padding:15px;border-radius:4px">
        <p style="margin:5px 0"><strong>From:</strong> ${name} (${email})</p>
        <p style="margin:15px 0"><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;color:#333">${message}</p>
      </div>
    </div>
  `,
  });
  console.log(`[contact-email] Message from ${email} sent to ${adminEmail}`);
  }

  // ─── Yoco helpers ─────────────────────────────────────────────────────────────
async function createYocoCheckout({
  amount,
  currency,
  successUrl,
  cancelUrl,
  metadata,
}) {
  const resp = await fetch("https://payments.yoco.com/api/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.YOCO_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency, successUrl, cancelUrl, metadata }),
  });

  const data = await resp.json();
  if (!resp.ok) {
    const err = new Error(`Yoco checkout error ${resp.status}`);
    err.status = resp.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/**
 * Fetch a checkout's current status directly from Yoco.
 * This is how we verify payment without needing webhook subscriptions.
 */
async function fetchYocoCheckout(checkoutId) {
  const resp = await fetch(
    `https://payments.yoco.com/api/checkouts/${checkoutId}`,
    {
      headers: { Authorization: `Bearer ${process.env.YOCO_SECRET}` },
    },
  );

  const data = await resp.json();
  if (!resp.ok) {
    const err = new Error(`Yoco fetch checkout error ${resp.status}`);
    err.status = resp.status;
    err.payload = data;
    throw err;
  }
  return data;
}

// ─── Express app ──────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

app.use((req, _res, next) => {
  if (req.method === "POST") {
    const body = IS_PROD ? "" : ` — body: ${JSON.stringify(req.body)}`;
    console.log(`[${new Date().toISOString()}] POST ${req.path}${body}`);
  }
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/create-voucher
 * Creates a pending voucher and returns a Yoco checkout URL.
 * The successUrl points back to /api/payment-success for verification.
 */
app.post("/api/create-voucher", async (req, res) => {
  const {
    purchase_name,
    purchase_email,
    recipient_name,
    recipient_email,
    recipient_phone,
    amount,
    currency,
    metadata,
  } = req.body;

  const missing = [
    "purchase_name",
    "purchase_email",
    "recipient_name",
    "recipient_email",
    "amount",
    "currency",
  ].filter((f) => !req.body[f]);
  if (missing.length) {
    return res
      .status(400)
      .json({ error: `Missing fields: ${missing.join(", ")}` });
  }

  const voucher_id = uuidv4();
  const voucher_code = generateVoucherCode();
  const created_at = new Date().toISOString();

  try {
    await db.run(
      `INSERT INTO vouchers
         (voucher_id, voucher_code, purchase_name, purchase_email,
          recipient_name, recipient_email, recipient_phone,
          amount, currency, status, created_at, metadata)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        voucher_id,
        voucher_code,
        purchase_name,
        purchase_email,
        recipient_name,
        recipient_email,
        recipient_phone || null,
        amount,
        currency,
        "pending",
        created_at,
        JSON.stringify(metadata || {}),
      ],
    );

    const successUrl = `${BASE_URL}/api/payment-success?voucher_id=${voucher_id}`;
    const cancelUrl = `${BASE_URL}/api/payment-cancel?voucher_id=${voucher_id}`;

    const yocoData = await createYocoCheckout({
      amount,
      currency,
      successUrl,
      cancelUrl,
      metadata: { voucher_id },
    });

    await db.run(
      `UPDATE vouchers SET yoco_checkout_id = ? WHERE voucher_id = ?`,
      [yocoData.id, voucher_id],
    );

    console.log(`[voucher] Created ${voucher_id} — checkout ${yocoData.id}`);
    return res.json({ checkoutUrl: yocoData.redirectUrl, voucher_id });
  } catch (err) {
    if (err.status) {
      console.error("[yoco] Checkout creation failed:", err.payload);
      return res.status(err.status).json(err.payload);
    }
    console.error("[voucher] create-voucher error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * GET /api/payment-success?voucher_id=XXX
 *
 * Yoco redirects the customer here after payment.
 * We verify with Yoco's API, issue the voucher, send email,
 * then redirect the customer to the frontend success page.
 */
app.get("/api/payment-success", async (req, res) => {
  const { voucher_id } = req.query;

  if (!voucher_id) {
    console.error("[payment-success] No voucher_id in query");
    return res.redirect("/#/payment-error");
  }

  try {
    const voucher = await db.get(
      `SELECT * FROM vouchers WHERE voucher_id = ?`,
      [voucher_id],
    );

    if (!voucher) {
      console.error(`[payment-success] Voucher ${voucher_id} not found`);
      return res.redirect("/#/payment-error");
    }

    // Already processed — safe to redirect (handles page refresh)
    if (voucher.status === "issued" || voucher.status === "redeemed") {
      console.log(
        `[payment-success] Voucher ${voucher_id} already issued — redirecting.`,
      );
      return res.redirect(`/#/success?voucher_id=${voucher_id}`);
    }

    if (!voucher.yoco_checkout_id) {
      console.error(
        `[payment-success] Voucher ${voucher_id} has no checkout ID`,
      );
      return res.redirect("/#/payment-error");
    }

    // ── Verify payment status directly with Yoco ───────────────────────────
    const checkout = await fetchYocoCheckout(voucher.yoco_checkout_id);
    console.log(
      `[payment-success] Yoco status: "${checkout.status}" for voucher ${voucher_id}`,
    );

    const CONFIRMED_STATUSES = ["succeeded", "completed", "paid"];
    if (!CONFIRMED_STATUSES.includes(checkout.status)) {
      console.warn(
        `[payment-success] Payment not confirmed (${checkout.status}).`,
      );
      return res.redirect(`/#/payment-pending?voucher_id=${voucher_id}`);
    }

    // ── Mark as issued ─────────────────────────────────────────────────────
    const now = new Date().toISOString();
    const result = await db.run(
      `UPDATE vouchers
         SET status = 'issued', yoco_payment_id = ?, paid_at = ?, issued_at = ?
       WHERE voucher_id = ? AND status = 'pending'`,
      [checkout.paymentId || checkout.id, now, now, voucher_id],
    );

    if (result.changes === 0) {
      console.log(
        `[payment-success] Voucher ${voucher_id} already processed (race condition).`,
      );
      return res.redirect(`/#/success?voucher_id=${voucher_id}`);
    }

    console.log(`[payment-success] Voucher ${voucher_id} issued.`);

    // ── Send email ─────────────────────────────────────────────────────────
    try {
      await sendVoucherEmail({
        recipientEmail: voucher.recipient_email,
        voucherCode: voucher.voucher_code,
        amount: voucher.amount,
        currency: voucher.currency,
        purchaseName: voucher.purchase_name,
      });
    } catch (emailErr) {
      // Don't block the redirect if email fails — voucher is already issued
      console.error(
        `[payment-success] Email failed for ${voucher_id}:`,
        emailErr.message,
      );
    }

    return res.redirect(`/#/success?voucher_id=${voucher_id}`);
  } catch (err) {
    console.error("[payment-success] Error:", err);
    return res.redirect("/#/payment-error");
  }
});

/**
 * GET /api/payment-cancel?voucher_id=XXX
 * Yoco redirects here if the customer cancels payment.
 */
app.get("/api/payment-cancel", async (req, res) => {
  const { voucher_id } = req.query;
  console.log(`[payment-cancel] Voucher ${voucher_id} — customer cancelled.`);
  return res.redirect(`/#/cancelled?voucher_id=${voucher_id || ""}`);
});

/**
 * GET /api/voucher-status/:voucher_id
 * Frontend can call this to show confirmation details on the success page.
 */
app.get("/api/voucher-status/:voucher_id", async (req, res) => {
  try {
    const voucher = await db.get(
      `SELECT voucher_id, voucher_code, recipient_name, recipient_email,
              amount, currency, status, issued_at, purchase_name
       FROM vouchers WHERE voucher_id = ?`,
      [req.params.voucher_id],
    );

    if (!voucher) return res.status(404).json({ error: "Voucher not found." });
    return res.json(voucher);
  } catch (err) {
    console.error("[voucher-status] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /api/redeem-voucher
 */
app.post("/api/redeem-voucher", async (req, res) => {
  const { voucher_code, redeemer_name, redeemer_email, redeemer_phone } =
    req.body;

  if (!voucher_code) {
    return res.status(400).json({ error: "voucher_code is required." });
  }

  try {
    const voucher = await db.get(
      `SELECT * FROM vouchers WHERE voucher_code = ?`,
      [voucher_code.trim().toUpperCase()],
    );

    if (!voucher) return res.status(404).json({ error: "Voucher not found." });
    if (voucher.status === "redeemed")
      return res.status(409).json({ error: "Voucher already redeemed." });
    if (voucher.status !== "issued")
      return res
        .status(400)
        .json({
          error: `Voucher status is "${voucher.status}" — cannot redeem.`,
        });

    const redeemed_at = new Date().toISOString();
    const redeemed_by = JSON.stringify({
      name: redeemer_name,
      email: redeemer_email,
      phone: redeemer_phone,
    });

    await db.run(
      `UPDATE vouchers SET status = 'redeemed', redeemed_at = ?, redeemed_by = ? WHERE voucher_id = ?`,
      [redeemed_at, redeemed_by, voucher.voucher_id],
    );

    // ── Notify Admin ───────────────────────────────────────────────────────
    try {
      await sendAdminNotification({
        redeemerName: redeemer_name || "Unknown",
        voucherCode: voucher.voucher_code,
        amount: voucher.amount,
        currency: voucher.currency,
      });
    } catch (notifErr) {
      console.error("[redeem] Admin notification failed:", notifErr.message);
    }

    console.log(`[redeem] Voucher ${voucher.voucher_id} redeemed.`);
    return res.json({
      message: "Voucher redeemed successfully.",
      voucher_id: voucher.voucher_id,
    });
  } catch (err) {
    console.error("[redeem] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /api/contact
 */
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    await sendContactEmail({ name, email, message });
    return res.json({ success: true, message: "Message sent successfully." });
  } catch (err) {
    console.error("[contact] Error sending email:", err);
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

/**
 * POST /api/test-email — smoke test for email config
 */
app.post("/api/test-email", async (req, res) => {
  const {
    recipientEmail,
    amount = 10000,
    currency = "ZAR",
    purchaseName = "Test Sender",
    voucherCode = "TEST-VOUC-HER1",
  } = req.body || {};

  if (!recipientEmail) {
    return res.status(400).json({ error: "recipientEmail is required." });
  }

  try {
    await sendVoucherEmail({
      recipientEmail,
      voucherCode,
      amount,
      currency,
      purchaseName,
    });
    return res.json({
      ok: true,
      message: `Test email sent to ${recipientEmail}`,
    });
  } catch (err) {
    console.error("[test-email] Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Webhook route kept as a fallback — fires if Yoco ever delivers one.
 */
app.post(
  ["/api/yoco-webhook", "/api/webhooks", "/yoco-webhook", "/webhooks"],
  async (req, res) => {
    const event = req.body;
    const eventType = event.type || event.event_type || event.eventType || null;
    console.log(`[webhook] Received — type: ${eventType || "unknown"}`);

    if (event.name && event.url && !eventType) {
      return res.status(200).json({ received: true });
    }

    res.status(200).send("received");

    const SUCCESS_EVENTS = [
      "payment.succeed",
      "checkout.succeeded",
      "payment.created",
    ];
    if (!SUCCESS_EVENTS.includes(eventType)) return;

    const voucher_id = (event.data?.metadata || event.metadata)?.voucher_id;
    if (!voucher_id) return;

    try {
      const voucher = await db.get(
        `SELECT * FROM vouchers WHERE voucher_id = ?`,
        [voucher_id],
      );
      if (!voucher || voucher.status !== "pending") return;

      const now = new Date().toISOString();
      const result = await db.run(
        `UPDATE vouchers SET status = 'issued', paid_at = ?, issued_at = ? WHERE voucher_id = ? AND status = 'pending'`,
        [now, now, voucher_id],
      );

      if (result.changes > 0) {
        await sendVoucherEmail({
          recipientEmail: voucher.recipient_email,
          voucherCode: voucher.voucher_code,
          amount: voucher.amount,
          currency: voucher.currency,
          purchaseName: voucher.purchase_name,
        });
      }
    } catch (err) {
      console.error("[webhook] Processing error:", err);
    }
  },
);

// Serve frontend
app.use(express.static(path.join(__dirname, "../dist")));

// ─── Process error handlers ───────────────────────────────────────────────────

process.on("unhandledRejection", (reason) => {
  console.error("[process] Unhandled rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[process] Uncaught exception:", err);
  process.exit(1);
});

// ─── Start ────────────────────────────────────────────────────────────────────

(async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(
        `[server] Listening on port ${PORT} (${IS_PROD ? "production" : "development"})`,
      );
      console.log(`[server] Public base URL: ${BASE_URL}`);
    });
  } catch (err) {
    console.error("[startup] Failed to start:", err);
    process.exit(1);
  }
})();
