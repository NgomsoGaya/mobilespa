[2026-06-18T01:09:18.707Z] POST /api/create-voucher
[voucher] Created 08292e01-0538-4297-a9c1-38d13b228a23 — checkout ch_ngop1ePB2GoIXJXcXOqf0PxB
[payment-success] Yoco status: "completed" for voucher 08292e01-0538-4297-a9c1-38d13b228a23
[payment-success] Voucher 08292e01-0538-4297-a9c1-38d13b228a23 issued.
[payment-success] Voucher 08292e01-0538-4297-a9c1-38d13b228a23 already issued — redirecting.
[payment-success] Voucher 08292e01-0538-4297-a9c1-38d13b228a23 already issued — redirecting.
[payment-success] Notification(s) failed for 08292e01-0538-4297-a9c1-38d13b228a23: connect ENETUNREACH 2607:f8b0:400e:c09::6c:465 - Local (:::0)
[2026-06-18T01:13:31.109Z] POST /api/contact
[2026-06-18T01:14:59.232Z] POST /api/contact
[contact] Error sending email: Error: Connection timeout
    at SMTPConnection._formatError (/opt/render/project/src/backend/node_modules/nodemailer/lib/smtp-connection/index.js:887:19)
    at SMTPConnection._onError (/opt/render/project/src/backend/node_modules/nodemailer/lib/smtp-connection/index.js:868:20)
    at SMTPConnection._onConnectionError (/opt/render/project/src/backend/node_modules/nodemailer/lib/smtp-connection/index.js:405:18)
    at Timeout.<anonymous> (/opt/render/project/src/backend/node_modules/nodemailer/lib/smtp-connection/index.js:385:18)
    at listOnTimeout (node:internal/timers:605:17)
    at process.processTimers (node:internal/timers:541:7) {
  code: 'ETIMEDOUT',
  command: 'CONN'
}
--------------------------------------

It looks like your voucher system is now successfully creating records in the database, but your email notification system is failing.

The error ENETUNREACH and ETIMEDOUT indicates that your Render backend is unable to reach the outgoing mail server (likely Gmail/SMTP) from within the Render network.

The Problem: Render's Network Restrictions
Render's free and lower-tier services often have strict outbound network rules. Additionally, many email providers (like Gmail) block connections from server IP addresses if not configured with specific "App Passwords."

How to Fix This

2. Check your "App Password"
If you must use Gmail/SMTP, ensure you are not using your regular Gmail password.

You must go to your Google Account Security settings.

Enable 2-Step Verification.

Generate an "App Password."

Use that 16-character code as the EMAIL_PASSWORD in your Render Environment Variables.

3. Update your Nodemailer Config (Transport)
Ensure your nodemailer configuration is using the correct host and port for your provider.

JavaScript
// Example of a robust Nodemailer transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // or your provider's SMTP host
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
  timeout: 10000 // Increase timeout to 10 seconds to avoid ETIMEDOUT
});