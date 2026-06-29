import nodemailer from 'nodemailer';

// Sends a plain-text email to the shop owner via Gmail SMTP. Reuses the same
// GMAIL_* env vars as the contact form. No-ops (with a warning) if unconfigured
// so callers can treat email as best-effort.
export async function sendOwnerEmail(
  subject: string,
  text: string,
): Promise<void> {
  const user = process.env.GMAIL_USER;
  // App Passwords are shown spaced ("abcd efgh ..."); strip in case pasted in.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  const to = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !pass) {
    console.warn('[mailer] Gmail not configured; skipping email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `THE MOON CHARM <${user}>`,
    to,
    subject,
    text,
  });
}
