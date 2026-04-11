const nodemailer = require("nodemailer");
const path = require("path");
// Ensure dotenv is loaded pointing correctly to the backend root directory
require("dotenv").config({ path: path.join(__dirname, "../.env") });

/**
 * Configure Transporter
 * Using manual host/port config as it's often more reliable for Gmail with STARTTLS
 */
const transporterConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
  tls: {
    // Allows connection even if the certificate is self-signed or has issues
    rejectUnauthorized: false
  },
  connectionTimeout: 20000, // 20 seconds
  greetingTimeout: 20000,
};

const transporter = nodemailer.createTransport(transporterConfig);

// Startup Verification
const currentEmail = process.env.SMTP_USER || process.env.EMAIL_USER;
if (currentEmail) {
  console.log(`[Email Service] Initializing for: ${currentEmail}`);
  transporter.verify((error, success) => {
    if (error) {
      console.error("[Email Service] Connection Failed:", error.message);
      console.error("[Email Service]  Tip: Verify your Gmail App Password in .env");
    } else {
      console.log("[Email Service] Connection Successful. Ready to send emails.");
    }
  });
} else {
  console.error("[Email Service] Error: SMTP_USER or EMAIL_USER not found in .env");
}

/**
 * Generic mail sender utility
 */
const sendMail = async (to, subject, html) => {
  try {
    const fromUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    if (!fromUser) throw new Error("No sender email configured in environment");

    const mailOptions = {
      from: `"E-Society" <${fromUser}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email Sent] To: ${to} | ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Failed] To: ${to} | Error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/* ================= WELCOME TEMPLATES ================= */

const sendResidentWelcomeEmail = async (email, residentName, password) => {
  const subject = "Welcome to Our Society - Registration Successful";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden">
      <div style="background:#2563eb; padding:20px; text-align:center">
        <h2 style="color:white; margin:0">Welcome to the Society Portal</h2>
      </div>
      <div style="padding:25px">
        <h3>Hello ${residentName},</h3>
        <p>Your resident account has been created successfully.</p>
        <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>Please login to your portal to manage your account.</p>
        <div style="text-align:center; margin-top:25px">
          <a href="http://localhost:3000/login"
             style="background:#2563eb; color:white; padding:12px 25px; text-decoration:none; border-radius:6px">
             Login Portal
          </a>
        </div>
      </div>
    </div>
  `;
  return await sendMail(email, subject, html);
};

const sendGuardWelcomeEmail = async (email, guardName, guardId, password) => {
  const subject = "Security Guard Account Created";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden">
      <div style="background:#16a34a; padding:20px; text-align:center">
        <h2 style="color:white; margin:0">Security Guard Portal Access</h2>
      </div>
      <div style="padding:25px">
        <h3>Hello ${guardName},</h3>
        <p>You have been registered as a <strong>Security Guard</strong> in the society management system.</p>
        <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0; margin:20px 0">
          <p><strong>Guard ID:</strong> ${guardId}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <div style="text-align:center; margin-top:25px">
          <a href="http://localhost:3000/login"
             style="background:#16a34a; color:white; padding:12px 25px; text-decoration:none; border-radius:6px">
             Login Portal
          </a>
        </div>
      </div>
    </div>
  `;
  return await sendMail(email, subject, html);
};

module.exports = {
  transporter,
  sendMail,
  sendResidentWelcomeEmail,
  sendGuardWelcomeEmail,
};