const resetPasswordEmail = ({ name, resetUrl }) => {
  const safeName = String(name)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return {
    subject: "Reset your Skillora password",
    text: [
      `Hi ${name},`,
      "",
      "We received a request to reset your Skillora password.",
      `Use this link to reset it: ${resetUrl}`,
      "",
      "This link expires in 15 minutes.",
      "If you did not request this, you can ignore this email.",
      "",
      "The Skillora Team",
    ].join("\n"),
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="font-family: Arial, sans-serif; color: #222;">
          <h2>Reset your Skillora password</h2>
          <p>Hi ${safeName},</p>
          <p>We received a request to reset your password.</p>
          <p>
            <a href="${resetUrl}">Reset Password</a>
          </p>
          <p>This link expires in 15 minutes.</p>
          <p>If you did not request this, you can ignore this email.</p>
          <p>The Skillora Team</p>
        </body>
      </html>
    `,
  };
};

module.exports = resetPasswordEmail;
