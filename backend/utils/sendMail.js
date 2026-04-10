const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});


/* ================= RESIDENT WELCOME EMAIL ================= */

const sendResidentWelcomeEmail = async (email, residentName, password) => {
  console.log("email send "+email);
  try {
    const mailOptions = {
      from: `"Society Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Our Society - Registration Successful",
      html: `
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

          <div style="background:#f1f5f9; text-align:center; padding:10px; font-size:12px">
            © 2026 Society Management System
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Resident Email Error:", error);
    return false;
  }
};

/* ================= GUARD WELCOME EMAIL ================= */

const sendGuardWelcomeEmail = async (email, guardName, guardId, password) => {
  try {
    const mailOptions = {
      from: `"Society Management" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Security Guard Account Created",
      html: `
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

            <p>You can login to manage visitor entries and security tasks.</p>

            <div style="text-align:center; margin-top:25px">
              <a href="http://localhost:3000/login"
                 style="background:#16a34a; color:white; padding:12px 25px; text-decoration:none; border-radius:6px">
                 Login Portal
              </a>
            </div>

          </div>

          <div style="background:#f1f5f9; text-align:center; padding:10px; font-size:12px">
            Society Security System
          </div>

        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Guard Email Error:", error);
    return false;
  }
};

module.exports = {
  sendResidentWelcomeEmail,
  sendGuardWelcomeEmail,
};