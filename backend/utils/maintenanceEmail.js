const nodemailer = require("nodemailer");
require('dotenv').config();

// Configure transporter — uses env variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use App Password for Gmail
  },
});

/**
 * Build HTML email for maintenance bill
 */
function buildBillEmail(resident, flat, maintenance, isOverdue = false) {
  const name = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const dueDate = new Date(maintenance.dueDate).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const total = (maintenance.amount || 0) + (maintenance.lateFee || 0);
  const subject = isOverdue
    ? `⚠️ Overdue Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`
    : `🏠 Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const accentColor = isOverdue ? "#e53e3e" : "#3b82f6";
  const statusLabel = isOverdue ? "OVERDUE" : "DUE";
  const statusBg = isOverdue ? "#fff5f5" : "#eff6ff";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Maintenance Bill</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:28px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">🏢 E-SOCIETY</div>
                    <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Society Management System</div>
                  </td>
                  <td align="right">
                    <div style="background:rgba(255,255,255,0.2);color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;">${statusLabel}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px;">

              <p style="margin:0 0 8px;font-size:15px;color:#64748b;">Dear,</p>
              <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;font-weight:700;">${name}</h2>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Flat: <strong style="color:#0f172a;">${flat.flatNumber}</strong> &nbsp;|&nbsp; ${flat.type || ""} &nbsp;|&nbsp; Block: ${flat.block || "—"}</p>

              ${isOverdue ? `
              <div style="background:#fff5f5;border-left:4px solid #e53e3e;padding:14px 18px;border-radius:6px;margin-bottom:24px;">
                <strong style="color:#e53e3e;">⚠️ Your maintenance bill is overdue.</strong>
                <p style="margin:4px 0 0;font-size:13px;color:#c53030;">Please clear the dues immediately to avoid further penalties.</p>
              </div>` : ""}

              <!-- Bill Details -->
              <div style="background:${statusBg};border-radius:10px;padding:24px;margin-bottom:24px;">
                <h3 style="margin:0 0 18px;font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Bill Details</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#475569;border-bottom:1px solid #e2e8f0;">Period</td>
                    <td style="padding:8px 0;font-size:14px;font-weight:600;color:#0f172a;text-align:right;border-bottom:1px solid #e2e8f0;">${maintenance.month} ${maintenance.year}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#475569;border-bottom:1px solid #e2e8f0;">Maintenance Amount</td>
                    <td style="padding:8px 0;font-size:14px;font-weight:600;color:#0f172a;text-align:right;border-bottom:1px solid #e2e8f0;">₹${(maintenance.amount || 0).toLocaleString("en-IN")}</td>
                  </tr>
                  ${maintenance.lateFee > 0 ? `
                  <tr>
                    <td style="padding:8px 0;font-size:14px;color:#e53e3e;border-bottom:1px solid #e2e8f0;">Late Fee</td>
                    <td style="padding:8px 0;font-size:14px;font-weight:600;color:#e53e3e;text-align:right;border-bottom:1px solid #e2e8f0;">₹${maintenance.lateFee.toLocaleString("en-IN")}</td>
                  </tr>` : ""}
                  <tr>
                    <td style="padding:14px 0 0;font-size:16px;font-weight:700;color:#0f172a;">Total Payable</td>
                    <td style="padding:14px 0 0;font-size:20px;font-weight:800;color:${accentColor};text-align:right;">₹${total.toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </div>

              <!-- Due Date -->
              <div style="display:flex;align-items:center;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
                <span style="font-size:22px;margin-right:12px;">📅</span>
                <div>
                  <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Due Date</div>
                  <div style="font-size:16px;font-weight:700;color:${accentColor};">${dueDate}</div>
                </div>
              </div>

              <p style="font-size:13px;color:#94a3b8;line-height:1.6;margin:0;">
                This is an auto-generated bill from your society management system. Please contact the admin for any queries.<br/>
                <strong>Do not reply to this email.</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 36px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;text-align:center;">
                © ${new Date().getFullYear()} E-Society Management &nbsp;|&nbsp; Generated on ${new Date().toLocaleDateString("en-IN")}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

/**
 * Send maintenance bill email
 */
async function sendMaintenanceBillEmail(resident, flat, maintenance, isOverdue = false) {
  if (!resident.email) return { success: false, reason: "No email" };

  const { subject, html } = buildBillEmail(resident, flat, maintenance, isOverdue);

  try {
    await transporter.sendMail({
      from: `"E-Society" <${process.env.SMTP_USER}>`,
      to: resident.email,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error(`[Email] Failed to send to ${resident.email}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendMaintenanceBillEmail };