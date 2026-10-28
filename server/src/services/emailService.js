const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from = process.env.EMAIL_FROM || "Skillora <onboarding@resend.dev>";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    console.error("RESEND EMAIL ERROR:", {
      name: error.name,
      message: error.message,
    });

    throw new Error(`Email delivery failed: ${error.message}`);
  }

  return data;
};

module.exports = { sendEmail };
