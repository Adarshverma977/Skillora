const verificationEmail = ({ name, verificationUrl }) => {
  const safeName = String(name)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  return {
    subject: "Verify your Skillora email",

    text: `Hi ${name},

Welcome to Skillora!

Please verify your email address using this link:
${verificationUrl}

If you did not create a Skillora account, you can ignore this email.

The Skillora Team`,

    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify your Skillora email</title>
        </head>
        <body style="margin:0;padding:24px;background:#F7F8FC;font-family:Arial,sans-serif;color:#202033;">
          <main style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:12px;padding:32px;">
            <h1 style="color:#5B5BD6;margin-top:0;">Welcome to Skillora!</h1>
            <p>Hi ${safeName},</p>
            <p>Thanks for joining Skillora. Verify your email address to complete your registration.</p>
            <p style="margin:28px 0;">
              <a
                href="${verificationUrl}"
                style="display:inline-block;background:#5B5BD6;color:#FFFFFF;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:bold;"
              >Verify email</a>
            </p>
            <p>If the button does not work, open this link:</p>
            <p style="word-break:break-all;">${verificationUrl}</p>
            <p style="color:#6B7280;font-size:13px;">If you did not create a Skillora account, you can ignore this email.</p>
            <p style="color:#6B7280;font-size:13px;">— The Skillora Team</p>
          </main>
        </body>
      </html>
    `,
  };
};

module.exports = verificationEmail;
