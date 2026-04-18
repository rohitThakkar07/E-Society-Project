const { transporter } = require("./sendMail");

/**
 * Build HTML email for maintenance bill
 */
function buildBillEmail(resident, flat, maintenance, isOverdue = false) {
  const name = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const dueDate = new Date(maintenance.dueDate).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const total = (maintenance.amount || 0) + (maintenance.lateFee || 0) + (maintenance.parkingCharge || 0);
  const subject = isOverdue
    ? `⚠️ Overdue Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`
    : `🏠 Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const accentColor = isOverdue ? "#e53e3e" : "#3b82f6";
  const statusLabel = isOverdue ? "OVERDUE" : "DUE";
  const statusBg = isOverdue ? "#fff5f5" : "#eff6ff";

  const html = `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
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
          <tr>
            <td style="padding:36px;">
              <p style="margin:0 0 8px;font-size:15px;color:#64748b;">Dear,</p>
              <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;font-weight:700;">${name}</h2>
              <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Flat: <strong style="color:#0f172a;">${flat.flatNumber}</strong> &nbsp;|&nbsp; ${flat.type || ""} &nbsp;|&nbsp; Block: ${flat.block || "—"}</p>
              ${isOverdue ? `<div style="background:#fff5f5;border-left:4px solid #e53e3e;padding:14px 18px;border-radius:6px;margin-bottom:24px;"><strong style="color:#e53e3e;">⚠️ Overdue.</strong></div>` : ""}
              <div style="background:${statusBg};border-radius:10px;padding:24px;margin-bottom:24px;">
                <table width="100%">
                  <tr><td style="padding:8px 0;color:#475569;">Period</td><td style="text-align:right;font-weight:600;">${maintenance.month} ${maintenance.year}</td></tr>
                  <tr><td style="padding:8px 0;color:#475569;">Amount</td><td style="text-align:right;font-weight:600;">₹${(maintenance.amount || 0).toLocaleString()}</td></tr>
                  ${maintenance.parkingCharge > 0 ? `<tr><td style="padding:8px 0;color:#3b82f6;">Parking Fee (One-time)</td><td style="text-align:right;color:#3b82f6;font-weight:600;">₹${maintenance.parkingCharge.toLocaleString()}</td></tr>` : ""}
                  ${maintenance.lateFee > 0 ? `<tr><td style="padding:8px 0;color:#e53e3e;">Late Fee</td><td style="text-align:right;color:#e53e3e;">₹${maintenance.lateFee.toLocaleString()}</td></tr>` : ""}
                  <tr><td style="padding:14px 0 0;font-weight:700;">Total</td><td style="text-align:right;font-size:20px;font-weight:800;color:${accentColor};">₹${total.toLocaleString()}</td></tr>
                </table>
              </div>
              <p style="font-size:13px;color:#94a3b8;">This is auto-generated. Please contact admin for queries.</p>
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
 * Build HTML email for payment receipt
 */
function buildPaymentReceiptEmail(resident, flat, record) {
  const name = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const paymentDate = new Date(record.paidDate || new Date()).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
  const total = (record.amount || 0) + (record.lateFee || 0) + (record.parkingCharge || 0);
  const subject = `✅ Payment Confirmation — ${flat.flatNumber} | ${record.month} ${record.year}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.05);">
          <tr>
            <td style="background:#10b981;padding:40px 36px;text-align:center;color:#ffffff;">
              <div style="font-size:48px;margin-bottom:16px;">✔️</div>
              <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:0.5px;">Payment Received</h1>
              <p style="margin:8px 0 0;font-size:15px;opacity:0.9;">Thank you for your maintenance payment</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 4px;font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Flat Member</p>
              <h2 style="margin:0 0 24px;font-size:20px;color:#0f172a;">${name} (${flat.flatNumber})</h2>
              
              <div style="background:#f1f5f9;border-radius:12px;padding:32px;margin-bottom:32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Transaction Date</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${paymentDate}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Maintenance Period</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${record.month} ${record.year}</td>
                  </tr>
                  ${record.parkingCharge > 0 ? `
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Parking Fee</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#3b82f6;text-align:right;font-weight:600;">₹${record.parkingCharge.toLocaleString()}</td>
                  </tr>
                  ` : ""}
                  <tr>
                    <td style="padding:16px 0 0;border-top:1px dashed #cbd5e1;font-size:16px;color:#0f172a;font-weight:700;">Amount Paid</td>
                    <td style="padding:16px 0 0;border-top:1px dashed #cbd5e1;font-size:24px;color:#10b981;text-align:right;font-weight:800;">₹${total.toLocaleString("en-IN")}</td>
                  </tr>
                </table>
              </div>

              <div style="text-align:center;">
                <p style="margin:0 0 20px;font-size:14px;color:#64748b;">You can download your receipt from the resident portal.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/my-invoices" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Invoices</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f8fafc;padding:24px;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">🏢 E-Society Management System &nbsp;|&nbsp; Support: +91 99999 00000</p>
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
      from: `"E-Society" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: resident.email,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error(`[Email] Bill failed:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send maintenance payment receipt
 */
async function sendMaintenancePaymentReceiptEmail(resident, flat, record) {
  if (!resident.email) return { success: false, reason: "No email" };
  const { subject, html } = buildPaymentReceiptEmail(resident, flat, record);
  try {
    await transporter.sendMail({
      from: `"E-Society" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: resident.email,
      subject,
      html,
    });
    return { success: true };
  } catch (err) {
    console.error(`[Email] Receipt failed:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendMaintenanceBillEmail, sendMaintenancePaymentReceiptEmail };