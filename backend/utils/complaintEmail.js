const { transporter } = require("./sendMail");

/**
 * Build HTML email for complaint resolution
 */
function buildComplaintResolvedEmail(resident, complaint) {
  const name = `${resident.firstName} ${resident.lastName || ""}`.trim();
  const resolutionDate = new Date(complaint.resolvedAt || new Date()).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
  const subject = `✅ Complaint Resolved: ${complaint.title}`;

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
              <div style="font-size:48px;margin-bottom:16px;">✨</div>
              <h1 style="margin:0;font-size:24px;font-weight:800;letter-spacing:0.5px;">Resolution Confirmed</h1>
              <p style="margin:8px 0 0;font-size:15px;opacity:0.9;">Your complaint has been successfully resolved</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 48px;">
              <p style="margin:0 0 4px;font-size:14px;color:#64748b;text-transform:uppercase;letter-spacing:1px;">Hello,</p>
              <h2 style="margin:0 0 24px;font-size:20px;color:#0f172a;">${name}</h2>
              
              <div style="background:#f1f5f9;border-radius:12px;padding:32px;margin-bottom:32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Complaint Title</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${complaint.title}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Category</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${complaint.category}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Resolved On</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;font-weight:600;">${resolutionDate}</td>
                  </tr>
                   <tr>
                    <td style="padding-bottom:12px;font-size:14px;color:#64748b;">Priority</td>
                    <td style="padding-bottom:12px;font-size:14px;color:#0f172a;text-align:right;">
                      <span style="background:#dcfce7;color:#166534;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700;">${complaint.priority}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="border-left:4px solid #10b981;padding-left:16px;margin-bottom:32px;">
                <p style="margin:0 0 8px;font-size:14px;color:#64748b;font-weight:600;text-transform:uppercase;">Complaint Description</p>
                <p style="margin:0;font-size:15px;color:#334155;font-style:italic;">"${complaint.description}"</p>
              </div>

              <div style="text-align:center;">
                <p style="margin:0 0 20px;font-size:14px;color:#64748b;">We hope you are satisfied with the resolution. If you have any further issues, please let us know.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/complaints" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Complaint Status</a>
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
 * Send complaint resolution email
 */
async function sendComplaintResolutionEmail(resident, complaint) {
  if (!resident.email) {
    console.error(`[Email] Failed to send complaint resolution email: Resident email missing.`);
    return { success: false, reason: "No email" };
  }

  const { subject, html } = buildComplaintResolvedEmail(resident, complaint);
  
  try {
    await transporter.sendMail({
      from: `"E-Society" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to: resident.email,
      subject,
      html,
    });
    console.log(`[Email] Complaint resolution email sent to: ${resident.email}`);
    return { success: true };
  } catch (err) {
    console.error(`[Email] Complaint resolution email failed:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendComplaintResolutionEmail };
