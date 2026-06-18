/**
 * Wellness Mobile Spa — Voucher Backend
 * Express + Supabase + Yoco Payments + Nodemailer
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
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";


// ─── Bootstrap ────────────────────────────────────────────────────────────────

dotenv.config();

const REQUIRED_ENV = [
  "YOCO_SECRET",
  "EMAIL_USER",
  "EMAIL_PASS",
  "BASE_URL",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
];
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
const BASE_URL = process.env.BASE_URL.replace(/\/$/, "");

// ─── Supabase client ──────────────────────────────────────────────────────────
// Use the service-role key so all DB operations bypass Row Level Security.
// NEVER expose this key to the frontend.

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

console.log("[db] Supabase client initialised.");

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
  personalMessage,
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
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;border:1px solid #e1e8e1;border-radius:12px;overflow:hidden">
        <div style="background-color:#4a7c59;padding:24px;text-align:center">
          <h1 style="color:white;margin:0;font-size:24px">A Gift for You 🌿</h1>
        </div>
        <div style="padding:24px;color:#333">
          <p style="font-size:16px">Hi there,</p>
          <p style="font-size:16px"><strong>${purchaseName}</strong> has gifted you a Wellness Mobile Spa voucher to enjoy at your convenience.</p>
          
          ${
            personalMessage
              ? `
          <div style="background-color:#f4f7f4;padding:16px;border-left:4px solid #4a7c59;margin:20px 0;font-style:italic">
            "${personalMessage}"
          </div>
          `
              : ""
          }

          <div style="background-color:#fff;border:2px dashed #4a7c59;padding:20px;text-align:center;margin:24px 0">
            <p style="margin:0 0 8px 0;color:#666;text-transform:uppercase;font-size:12px;letter-spacing:1px">Your Voucher Code</p>
            <h2 style="margin:0;color:#4a7c59;font-size:28px;letter-spacing:2px">${voucherCode}</h2>
            <p style="margin:12px 0 0 0;font-weight:bold;font-size:18px">${currency} ${(amount / 100).toFixed(2)}</p>
          </div>

          <p style="font-size:14px;line-height:1.5">To redeem your voucher simply visit the website and redeem in the voucher-section, and our team will get back to you.</p>
          
          <div style="border-top:1px solid #eee;margin-top:24px;padding-top:20px;color:#888;font-size:12px;text-align:center">
            <p>Thank you for choosing Wellness Mobile Spa.</p>
            <p>Cape Town, South Africa</p>
          </div>
        </div>
      </div>
    `,
  });

  console.log(`[email] Voucher email sent to ${recipientEmail}`);
}

async function sendAdminPurchaseNotification({
  purchaseName,
  purchaseEmail,
  recipientName,
  recipientEmail,
  voucherCode,
  amount,
  currency,
  personalMessage,
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
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
    subject: `[NEW SALE] Voucher Purchased: ${voucherCode}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;border:2px solid #4a7c59;padding:20px;border-radius:8px">
        <h2 style="color:#4a7c59;margin-top:0">New Voucher Sale! 💰</h2>
        <p>A new voucher has been purchased and issued.</p>
        
        <div style="background:#f4f7f4;padding:15px;border-radius:4px;margin-bottom:20px">
          <h3 style="margin-top:0;font-size:14px;color:#4a7c59">PURCHASER</h3>
          <p style="margin:5px 0"><strong>Name:</strong> ${purchaseName}</p>
          <p style="margin:5px 0"><strong>Email:</strong> ${purchaseEmail}</p>
        </div>

        <div style="background:#f4f7f4;padding:15px;border-radius:4px;margin-bottom:20px">
          <h3 style="margin-top:0;font-size:14px;color:#4a7c59">RECIPIENT</h3>
          <p style="margin:5px 0"><strong>Name:</strong> ${recipientName}</p>
          <p style="margin:5px 0"><strong>Email:</strong> ${recipientEmail}</p>
        </div>

        <div style="background:#f9f9f9;padding:15px;border-radius:4px;border:1px solid #ddd">
          <p style="margin:5px 0"><strong>Voucher Code:</strong> <code>${voucherCode}</code></p>
          <p style="margin:5px 0"><strong>Value:</strong> ${currency} ${(amount / 100).toFixed(2)}</p>
          ${personalMessage ? `<p style="margin:10px 0 0 0;font-style:italic">"${personalMessage}"</p>` : ""}
        </div>
      </div>
    `,
  });
  console.log(`[admin-notif] Sale notification sent to ${adminEmail}`);
}

async function sendAdminNotification({
  redeemerName,
  redeemerPhone,
  voucherCode,
  amount,
  currency,
}) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const adminPhone = process.env.ADMIN_PHONE_NUMBER;

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
          <p style="margin:5px 0"><strong>Contact Number:</strong> ${redeemerPhone || "Not provided"}</p>
          ${
            redeemerPhone
              ? `
          <p style="margin:10px 0">
            <a href="https://wa.me/${redeemerPhone.replace(/\s+/g, "")}" style="background-color:#25D366;color:white;padding:8px 12px;text-decoration:none;border-radius:4px;font-size:14px;display:inline-block">
              Message on WhatsApp
            </a>
          </p>
          `
              : ""
          }
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

  if (adminPhone && process.env.WHATSAPP_API_KEY) {
    console.log(`[admin-notif] Triggering WhatsApp API for ${adminPhone}...`);
  } else {
    console.log(
      "[admin-notif] WhatsApp notification skipped (missing config).",
    );
  }
}

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
import cors from "cors";

const allowedOrigins = [
  "https://yourwellnessmobilespa.co.za",
  "https://www.yourwellnessmobilespa.co.za",
  "http://localhost:5173", // For local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);
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
    const { error: insertError } = await supabase.from("vouchers").insert({
      voucher_id,
      voucher_code,
      purchase_name,
      purchase_email,
      recipient_name,
      recipient_email,
      recipient_phone: recipient_phone || null,
      amount,
      currency,
      status: "pending",
      created_at,
      metadata: metadata || {},
    });

    if (insertError) throw insertError;

    const successUrl = `${BASE_URL}/api/payment-success?voucher_id=${voucher_id}`;
    const cancelUrl = `${BASE_URL}/api/payment-cancel?voucher_id=${voucher_id}`;

    const yocoData = await createYocoCheckout({
      amount,
      currency,
      successUrl,
      cancelUrl,
      metadata: { voucher_id },
    });

    const { error: updateError } = await supabase
      .from("vouchers")
      .update({ yoco_checkout_id: yocoData.id })
      .eq("voucher_id", voucher_id);

    if (updateError) throw updateError;

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
 */
app.get("/api/payment-success", async (req, res) => {
  const { voucher_id } = req.query;

  if (!voucher_id) {
    console.error("[payment-success] No voucher_id in query");
    return res.redirect("/#/payment-error");
  }

  try {
    const { data: voucher, error: fetchError } = await supabase
      .from("vouchers")
      .select("*")
      .eq("voucher_id", voucher_id)
      .single();

    if (fetchError || !voucher) {
      console.error(`[payment-success] Voucher ${voucher_id} not found`);
      return res.redirect("/#/payment-error");
    }

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

    const now = new Date().toISOString();

    // Atomic update: only update if still 'pending' to prevent race conditions
    const { data: updated, error: updateError } = await supabase
      .from("vouchers")
      .update({
        status: "issued",
        yoco_payment_id: checkout.paymentId || checkout.id,
        paid_at: now,
        issued_at: now,
      })
      .eq("voucher_id", voucher_id)
      .eq("status", "pending") // guard against race conditions
      .select()
      .single();

    if (updateError || !updated) {
      console.log(
        `[payment-success] Voucher ${voucher_id} already processed (race condition).`,
      );
      return res.redirect(`/#/success?voucher_id=${voucher_id}`);
    }

    console.log(`[payment-success] Voucher ${voucher_id} issued.`);

    try {
      const personalMessage = voucher.metadata?.personalMessage || "";

      await sendVoucherEmail({
        recipientEmail: voucher.recipient_email,
        voucherCode: voucher.voucher_code,
        amount: voucher.amount,
        currency: voucher.currency,
        purchaseName: voucher.purchase_name,
        personalMessage,
      });

      await sendAdminPurchaseNotification({
        purchaseName: voucher.purchase_name,
        purchaseEmail: voucher.purchase_email,
        recipientName: voucher.recipient_name,
        recipientEmail: voucher.recipient_email,
        voucherCode: voucher.voucher_code,
        amount: voucher.amount,
        currency: voucher.currency,
        personalMessage,
      });
    } catch (emailErr) {
      console.error(
        `[payment-success] Notification(s) failed for ${voucher_id}:`,
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
 */
app.get("/api/payment-cancel", async (req, res) => {
  const { voucher_id } = req.query;
  console.log(`[payment-cancel] Voucher ${voucher_id} — customer cancelled.`);
  return res.redirect(`/#/cancelled?voucher_id=${voucher_id || ""}`);
});

/**
 * GET /api/voucher-status/:voucher_id
 */
app.get("/api/voucher-status/:voucher_id", async (req, res) => {
  try {
    const { data: voucher, error } = await supabase
      .from("vouchers")
      .select(
        "voucher_id, voucher_code, recipient_name, recipient_email, amount, currency, status, issued_at, purchase_name",
      )
      .eq("voucher_id", req.params.voucher_id)
      .single();

    if (error || !voucher)
      return res.status(404).json({ error: "Voucher not found." });
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
    const { data: voucher, error: fetchError } = await supabase
      .from("vouchers")
      .select("*")
      .eq("voucher_code", voucher_code.trim().toUpperCase())
      .single();

    if (fetchError || !voucher)
      return res.status(404).json({ error: "Voucher not found." });
    if (voucher.status === "redeemed")
      return res.status(409).json({ error: "Voucher already redeemed." });
    if (voucher.status !== "issued") {
      return res
        .status(400)
        .json({
          error: `Voucher status is "${voucher.status}" — cannot redeem.`,
        });
    }

    const redeemed_at = new Date().toISOString();
    const redeemed_by = {
      name: redeemer_name,
      email: redeemer_email,
      phone: redeemer_phone,
    };

    const { error: updateError } = await supabase
      .from("vouchers")
      .update({ status: "redeemed", redeemed_at, redeemed_by })
      .eq("voucher_id", voucher.voucher_id);

    if (updateError) throw updateError;

    try {
      await sendAdminNotification({
        redeemerName: redeemer_name || "Unknown",
        redeemerPhone: redeemer_phone || "Not provided",
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
    return res
      .status(500)
      .json({ error: "Failed to send message. Please try again later." });
  }
});

/**
 * POST /api/test-email
 */
app.post("/api/test-email", async (req, res) => {
  const {
    recipientEmail,
    amount = 10000,
    currency = "ZAR",
    purchaseName = "Test Sender",
    voucherCode = "TEST-VOUC-HER1",
    personalMessage = "This is a test personal message! 🌿",
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
      personalMessage,
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
 * Webhook route — fallback if Yoco delivers one.
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
      const { data: voucher } = await supabase
        .from("vouchers")
        .select("*")
        .eq("voucher_id", voucher_id)
        .single();

      if (!voucher || voucher.status !== "pending") return;

      const now = new Date().toISOString();
      const { data: updated } = await supabase
        .from("vouchers")
        .update({ status: "issued", paid_at: now, issued_at: now })
        .eq("voucher_id", voucher_id)
        .eq("status", "pending")
        .select()
        .single();

      if (updated) {
        const personalMessage = voucher.metadata?.personalMessage || "";

        await sendVoucherEmail({
          recipientEmail: voucher.recipient_email,
          voucherCode: voucher.voucher_code,
          amount: voucher.amount,
          currency: voucher.currency,
          purchaseName: voucher.purchase_name,
          personalMessage,
        });

        await sendAdminPurchaseNotification({
          purchaseName: voucher.purchase_name,
          purchaseEmail: voucher.purchase_email,
          recipientName: voucher.recipient_name,
          recipientEmail: voucher.recipient_email,
          voucherCode: voucher.voucher_code,
          amount: voucher.amount,
          currency: voucher.currency,
          personalMessage,
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

app.listen(PORT, () => {
  console.log(
    `[server] Listening on port ${PORT} (${IS_PROD ? "production" : "development"})`,
  );
  console.log(`[server] Public base URL: ${BASE_URL}`);
});
