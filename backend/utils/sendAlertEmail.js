const nodemailer = require("nodemailer");

// 1. Ensure Transporter is defined or imported
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlertEmail = async (recipients, { title, message, type }) => {
  const typeConfig = {
    Emergency:   { color: "#dc2626", lightColor: "#fef2f2", icon: "🚨", label: "EMERGENCY ALERT" },
    Maintenance: { color: "#d97706", lightColor: "#fffbeb", icon: "🔧", label: "MAINTENANCE NOTICE" },
    Notice:      { color: "#2563eb", lightColor: "#eff6ff", icon: "📢", label: "SOCIETY NOTICE" },
    Event:       { color: "#7c3aed", lightColor: "#f5f3ff", icon: "🎉", label: "UPCOMING EVENT" },
    General:     { color: "#0891b2", lightColor: "#ecfeff", icon: "📋", label: "GENERAL INFORMATION" },
  };

  const config = typeConfig[type] || typeConfig.General;
  
  // 2. Format Date for India (IST)
  const sentAt = new Date().toLocaleString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,sans-serif;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:20px;">
        <tr>
          <td align="center">
            <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
              <tr><td style="background-color:${config.color};height:6px;"></td></tr>
              <tr>
                <td style="padding:32px;text-align:center;background-color:${config.color};">
                  <div style="font-size:48px;">${config.icon}</div>
                  <div style="color:#ffffff;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;margin-top:10px;">${config.label}</div>
                  <h1 style="color:#ffffff;margin:10px 0 0;font-size:24px;">${title}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <p style="color:#475569;font-size:16px;">Dear Resident,</p>
                  <div style="background-color:${config.lightColor};border-left:4px solid ${config.color};padding:20px;margin:20px 0;border-radius:4px;">
                    <p style="margin:0;color:#1e293b;line-height:1.6;">${message}</p>
                  </div>
                  <table width="100%" style="background-color:#f8fafc;border-radius:8px;padding:15px;">
                    <tr>
                      <td>
                        <span style="font-size:11px;color:#64748b;text-transform:uppercase;">Alert Type</span><br/>
                        <b style="color:${config.color};">${type}</b>
                      </td>
                      <td align="right">
                        <span style="font-size:11px;color:#64748b;text-transform:uppercase;">Sent At</span><br/>
                        <span style="font-size:13px;color:#1e293b;">${sentAt}</span>
                      </td>
                    </tr>
                  </table>
                  <div style="text-align:center;margin-top:30px;">
                    <a href="http://localhost:3000/login" style="background-color:${config.color};color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;">View Details</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color:#f8fafc;padding:20px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
                  © ${new Date().getFullYear()} E-Society Management System
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  try {
    // 3. Privacy Fix: Use BCC instead of TO so residents don't see each other's emails
    const mailOptions = {
      from: `"E-Society Alerts 🏢" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      bcc: Array.isArray(recipients) ? recipients : [recipients], // Hide other recipients
      subject: `${config.icon} [${type}] ${title}`,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent ID:", info.messageId);
    return true;
  } catch (error) {
    console.error("Alert Email Error:", error);
    return false;
  }
};

module.exports = { sendAlertEmail };