const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendResetEmail = async (email, resetUrl) => {
  try {
    const response = await resend.emails.send({
      from: "support@mail.resumeai.com", // changed here
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    console.log("Email sent:", response);
  } catch (error) {
    console.error("Email error:", error);
  }
};