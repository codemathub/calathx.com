const { Resend } = require('resend');

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Send an email via Resend. Falls back to console log in dev when RESEND_API_KEY is unset.
 */
const sendEmail = async ({ to, subject, html, replyTo }) => {
  const resend = getResendClient();
  const from = process.env.EMAIL_FROM || 'CalathX <onboarding@resend.dev>';

  if (!resend) {
    console.warn('[Resend] RESEND_API_KEY not set. Email skipped:', { to, subject });
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
};

module.exports = { sendEmail };

