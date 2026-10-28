const { Resend } = require("resend");

const sendEmail = async ({ to, subject, text, html }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(apiKey);

  const from = process.env.EMAIL_FROM || "Skillora <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      ...(text ? { text } : {}),
      ...(html ? { html } : {}),
    });

    if (error) {
      console.error("RESEND EMAIL ERROR:", {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
      });

      throw new Error(`Resend email failed: ${error.message}`);
    }

    console.log("Email accepted by Resend:", data?.id);

    return data;
  } catch (error) {
    console.error("EMAIL DELIVERY ERROR:", error.message);
    throw error;
  }
};

module.exports = { sendEmail };
