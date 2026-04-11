const { sendMail } = require("./sendMail");

const sendVisitorOTPEmail = async (residentEmail, visitorName, otp) => {
  const subject = "Security Alert: Visitor OTP Request";
  const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
        <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">e-Society Security</h1>
        </div>
        <div style="padding: 30px; background-color: #ffffff;">
          <p style="color: #475569; font-size: 16px;">Hello,</p>
          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            A visitor named <strong style="color: #1e293b;">${visitorName}</strong> is requesting entry to your unit. Please provide the OTP below to the security guard if you recognize them.
          </p>
          <div style="background-color: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 25px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
          </div>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">
            This OTP is valid for 5 minutes only.
          </p>
        </div>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center;">
          <p style="margin: 0; font-size: 11px; color: #64748b;">Powered by e-Society Management System</p>
        </div>
      </div>
    `;

  return await sendMail(residentEmail, subject, html);
};

module.exports = { sendVisitorOTPEmail };