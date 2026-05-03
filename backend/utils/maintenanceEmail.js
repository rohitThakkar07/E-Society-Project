const { transporter } = require("./sendMail");

const FROM = `"E-Society" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`;

// ─── shared header/footer builders ────────────────────────────────────────────
function header(accentColor, badge) {
  return `
  <tr>
    <td style="background:${accentColor};padding:28px 36px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">E-SOCIETY</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-top:4px;">Society Management System</div>
          </td>
          <td align="right">
            <div style="background:rgba(255,255,255,0.2);color:#fff;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;">${badge}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function footer() {
  return `
  <tr>
    <td style="background:#f8fafc;padding:20px;border-top:1px solid #f1f5f9;text-align:center;">
      <p style="margin:0;font-size:12px;color:#94a3b8;">E-Society Management System &nbsp;|&nbsp; This is an auto-generated email.</p>
    </td>
  </tr>`;
}

function wrap(rows) {
  return `<!DOCTYPE html>
<html lang="en">
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        ${rows}
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── 1. Bill email (new bill generated) ────────────────────────────────────────
function buildBillEmail(resident, flat, maintenance, isOverdue = false) {
  const name     = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const dueDate  = new Date(maintenance.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const total    = (maintenance.amount || 0) + (maintenance.lateFee || 0) + (maintenance.escalationCharge || 0);
  const accent   = isOverdue ? "#e53e3e" : "#3b82f6";
  const badge    = isOverdue ? "OVERDUE" : "DUE";
  const statusBg = isOverdue ? "#fff5f5" : "#eff6ff";
  const subject  = isOverdue
    ? `Overdue Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`
    : `Maintenance Bill — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const body = `
  ${header(accent, badge)}
  <tr><td style="padding:36px;">
    <p style="margin:0 0 8px;font-size:15px;color:#64748b;">Dear,</p>
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;font-weight:700;">${name}</h2>
    <p style="margin:0 0 28px;font-size:14px;color:#64748b;">Flat: <strong>${flat.flatNumber}</strong></p>
    ${isOverdue ? `<div style="background:#fff5f5;border-left:4px solid #e53e3e;padding:14px 18px;border-radius:6px;margin-bottom:24px;"><strong style="color:#e53e3e;">Your maintenance payment is overdue. Please pay immediately to avoid further penalties.</strong></div>` : ""}
    <div style="background:${statusBg};border-radius:10px;padding:24px;margin-bottom:24px;">
      <table width="100%">
        <tr><td style="padding:8px 0;color:#475569;">Period</td><td style="text-align:right;font-weight:600;">${maintenance.month} ${maintenance.year}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Due Date</td><td style="text-align:right;font-weight:600;">${dueDate}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Amount</td><td style="text-align:right;font-weight:600;">₹${(maintenance.amount || 0).toLocaleString()}</td></tr>
        ${(maintenance.lateFee || 0) > 0 ? `<tr><td style="padding:8px 0;color:#e53e3e;">Late Fee</td><td style="text-align:right;color:#e53e3e;">₹${maintenance.lateFee.toLocaleString()}</td></tr>` : ""}
        ${(maintenance.escalationCharge || 0) > 0 ? `<tr><td style="padding:8px 0;color:#e53e3e;">Escalation Charge</td><td style="text-align:right;color:#e53e3e;">₹${maintenance.escalationCharge.toLocaleString()}</td></tr>` : ""}
        <tr><td style="padding:14px 0 0;font-weight:700;">Total Due</td><td style="text-align:right;font-size:20px;font-weight:800;color:${accent};">₹${total.toLocaleString()}</td></tr>
      </table>
    </div>
    <p style="font-size:13px;color:#94a3b8;">Please contact admin for any queries.</p>
  </td></tr>
  ${footer()}`;

  return { subject, html: wrap(body) };
}

// ─── 2. Pre-due reminder ────────────────────────────────────────────────────────
function buildPreDueReminderEmail(resident, flat, maintenance, daysLeft) {
  const name    = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const dueDate = new Date(maintenance.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const total   = (maintenance.amount || 0) + (maintenance.lateFee || 0);
  const urgency = daysLeft === 0 ? "TODAY" : `${daysLeft} DAY${daysLeft > 1 ? "S" : ""} LEFT`;
  const accent  = daysLeft <= 2 ? "#f59e0b" : "#3b82f6";
  const subject = daysLeft === 0
    ? `Maintenance Due TODAY — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`
    : `Maintenance Reminder: ${daysLeft} day${daysLeft > 1 ? "s" : ""} left — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const body = `
  ${header(accent, urgency)}
  <tr><td style="padding:36px;">
    <p style="margin:0 0 8px;font-size:15px;color:#64748b;">Dear,</p>
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;font-weight:700;">${name}</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">Flat: <strong>${flat.flatNumber}</strong></p>
    <div style="background:#fffbeb;border-left:4px solid ${accent};padding:14px 18px;border-radius:6px;margin-bottom:24px;">
      <strong style="color:${accent};">
        ${daysLeft === 0 ? "Your maintenance payment is due TODAY. Please pay before end of day to avoid late fees." : `Your maintenance payment is due in ${daysLeft} day${daysLeft > 1 ? "s" : ""}. Please pay on time to avoid late charges.`}
      </strong>
    </div>
    <div style="background:#f8fafc;border-radius:10px;padding:24px;margin-bottom:24px;">
      <table width="100%">
        <tr><td style="padding:8px 0;color:#475569;">Period</td><td style="text-align:right;font-weight:600;">${maintenance.month} ${maintenance.year}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Due Date</td><td style="text-align:right;font-weight:600;">${dueDate}</td></tr>
        <tr><td style="padding:14px 0 0;font-weight:700;">Amount Due</td><td style="text-align:right;font-size:20px;font-weight:800;color:${accent};">₹${total.toLocaleString()}</td></tr>
      </table>
    </div>
    <p style="font-size:13px;color:#94a3b8;">Pay on time to keep your record clean and avoid late fees.</p>
  </td></tr>
  ${footer()}`;

  return { subject, html: wrap(body) };
}

// ─── 3. Escalation email ────────────────────────────────────────────────────────
function buildEscalationEmail(resident, flat, maintenance, level) {
  const name     = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const total    = (maintenance.amount || 0) + (maintenance.lateFee || 0) + (maintenance.escalationCharge || 0);
  const messages = {
    1: { badge: "LATE FEE APPLIED", accent: "#f59e0b", msg: `An additional late fee / escalation charge of ₹${(maintenance.escalationCharge || 0).toLocaleString()} has been applied to your account. Please clear your dues immediately.` },
    2: { badge: "DEFAULTER NOTICE", accent: "#e53e3e", msg: "Your account has been marked as DEFAULTER due to prolonged non-payment. This may restrict access to society facilities. Please contact the admin immediately." },
    3: { badge: "URGENT NOTICE",    accent: "#7c3aed", msg: "Your maintenance dues are severely overdue. This matter has been escalated to the society admin for manual action. Please pay immediately or contact the admin." },
  };
  const { badge, accent, msg } = messages[level] || messages[1];
  const subject = `🚨 Maintenance Escalation Notice — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const body = `
  ${header(accent, badge)}
  <tr><td style="padding:36px;">
    <p style="margin:0 0 8px;font-size:15px;color:#64748b;">Dear,</p>
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;font-weight:700;">${name}</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">Flat: <strong>${flat.flatNumber}</strong></p>
    <div style="background:#fff5f5;border-left:4px solid ${accent};padding:14px 18px;border-radius:6px;margin-bottom:24px;">
      <strong style="color:${accent};">🚨 ${msg}</strong>
    </div>
    <div style="background:#f8fafc;border-radius:10px;padding:24px;">
      <table width="100%">
        <tr><td style="padding:8px 0;color:#475569;">Period</td><td style="text-align:right;font-weight:600;">${maintenance.month} ${maintenance.year}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Base Amount</td><td style="text-align:right;font-weight:600;">₹${(maintenance.amount || 0).toLocaleString()}</td></tr>
        ${(maintenance.lateFee || 0) > 0 ? `<tr><td style="padding:8px 0;color:#e53e3e;">Late Fee</td><td style="text-align:right;color:#e53e3e;">₹${maintenance.lateFee.toLocaleString()}</td></tr>` : ""}
        ${(maintenance.escalationCharge || 0) > 0 ? `<tr><td style="padding:8px 0;color:#e53e3e;">Escalation Charge</td><td style="text-align:right;color:#e53e3e;">₹${maintenance.escalationCharge.toLocaleString()}</td></tr>` : ""}
        <tr><td style="padding:14px 0 0;font-weight:700;border-top:1px dashed #cbd5e1;">Total Outstanding</td><td style="text-align:right;font-size:20px;font-weight:800;color:${accent};border-top:1px dashed #cbd5e1;">₹${total.toLocaleString()}</td></tr>
      </table>
    </div>
  </td></tr>
  ${footer()}`;

  return { subject, html: wrap(body) };
}

// ─── 4. Admin escalation alert (Level 3) ───────────────────────────────────────
function buildAdminEscalationEmail(adminEmail, resident, flat, maintenance) {
  const name    = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const total   = (maintenance.amount || 0) + (maintenance.lateFee || 0) + (maintenance.escalationCharge || 0);
  const subject = `🚨 Admin Action Required: Overdue Maintenance — ${flat.flatNumber} | ${maintenance.month} ${maintenance.year}`;

  const body = `
  ${header("#7c3aed", "ADMIN ALERT")}
  <tr><td style="padding:36px;">
    <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">Manual Action Required</h2>
    <p style="color:#475569;margin-bottom:24px;">The following maintenance record is severely overdue and requires admin intervention:</p>
    <div style="background:#f8fafc;border-radius:10px;padding:24px;margin-bottom:24px;">
      <table width="100%">
        <tr><td style="padding:8px 0;color:#475569;">Resident</td><td style="text-align:right;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Flat</td><td style="text-align:right;font-weight:600;">${flat.flatNumber}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Period</td><td style="text-align:right;font-weight:600;">${maintenance.month} ${maintenance.year}</td></tr>
        <tr><td style="padding:8px 0;color:#475569;">Status</td><td style="text-align:right;font-weight:600;color:#e53e3e;">Defaulter</td></tr>
        <tr><td style="padding:14px 0 0;font-weight:700;border-top:1px dashed #cbd5e1;">Total Outstanding</td><td style="text-align:right;font-size:20px;font-weight:800;color:#7c3aed;border-top:1px dashed #cbd5e1;">₹${total.toLocaleString()}</td></tr>
      </table>
    </div>
    <p style="font-size:13px;color:#94a3b8;">Please log in to the admin portal and take appropriate action.</p>
  </td></tr>
  ${footer()}`;

  return { subject, html: wrap(body), adminEmail };
}

// ─── 5. Payment receipt ────────────────────────────────────────────────────────
function buildPaymentReceiptEmail(resident, flat, record) {
  const name        = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const paymentDate = new Date(record.paidDate || new Date()).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const total       = (record.amount || 0) + (record.lateFee || 0) + (record.escalationCharge || 0);
  const subject     = `Payment Confirmed — ${flat.flatNumber} | ${record.month} ${record.year}`;

  const body = `
  ${header("#10b981", "PAID")}
  <tr><td style="padding:40px 48px;">
    <p style="margin:0 0 4px;font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Flat Member</p>
    <h2 style="margin:0 0 24px;font-size:20px;color:#0f172a;">${name} (${flat.flatNumber})</h2>
    <div style="background:#f1f5f9;border-radius:12px;padding:32px;margin-bottom:32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding-bottom:12px;font-size:14px;color:#64748b;">Transaction Date</td><td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${paymentDate}</td></tr>
        <tr><td style="padding-bottom:12px;font-size:14px;color:#64748b;">Maintenance Period</td><td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${record.month} ${record.year}</td></tr>
        <tr><td style="padding:16px 0 0;border-top:1px dashed #cbd5e1;font-size:16px;color:#0f172a;font-weight:700;">Amount Paid</td><td style="padding:16px 0 0;border-top:1px dashed #cbd5e1;font-size:24px;color:#10b981;text-align:right;font-weight:800;">₹${total.toLocaleString("en-IN")}</td></tr>
      </table>
    </div>
    <p style="font-size:14px;color:#64748b;text-align:center;">You can download your receipt from the resident portal.</p>
  </td></tr>
  ${footer()}`;

  return { subject, html: wrap(body) };
}

// ─── Send helpers ──────────────────────────────────────────────────────────────
async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
    return { success: true };
  } catch (err) {
    console.error(`[Email] Failed to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

async function sendMaintenanceBillEmail(resident, flat, maintenance, isOverdue = false) {
  if (!resident?.email) return { success: false, reason: "No email" };
  const { subject, html } = buildBillEmail(resident, flat, maintenance, isOverdue);
  return sendMail({ to: resident.email, subject, html });
}

async function sendPreDueReminderEmail(resident, flat, maintenance, daysLeft) {
  if (!resident?.email) return { success: false, reason: "No email" };
  const { subject, html } = buildPreDueReminderEmail(resident, flat, maintenance, daysLeft);
  return sendMail({ to: resident.email, subject, html });
}

async function sendEscalationEmail(resident, flat, maintenance, level) {
  if (!resident?.email) return { success: false, reason: "No email" };
  const { subject, html } = buildEscalationEmail(resident, flat, maintenance, level);
  return sendMail({ to: resident.email, subject, html });
}

async function sendAdminEscalationEmail(adminEmail, resident, flat, maintenance) {
  if (!adminEmail) return { success: false, reason: "No admin email" };
  const { subject, html } = buildAdminEscalationEmail(adminEmail, resident, flat, maintenance);
  return sendMail({ to: adminEmail, subject, html });
}

async function sendMaintenancePaymentReceiptEmail(resident, flat, record) {
  if (!resident?.email) return { success: false, reason: "No email" };
  const { subject, html } = buildPaymentReceiptEmail(resident, flat, record);
  return sendMail({ to: resident.email, subject, html });
}

module.exports = {
  sendMaintenanceBillEmail,
  sendPreDueReminderEmail,
  sendEscalationEmail,
  sendAdminEscalationEmail,
  sendMaintenancePaymentReceiptEmail,
};