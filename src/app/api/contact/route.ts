import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactSchema } from '@/lib/contact-schema';

// Nodemailer needs the Node.js runtime (it opens an SMTP socket), not Edge.
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  // Google shows App Passwords in spaced groups ("abcd efgh ..."); the spaces
  // are display-only, so strip them in case they were pasted in.
  const gmailPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  // Defaults to the authenticated inbox if no separate recipient is set.
  const toEmail = process.env.CONTACT_TO_EMAIL || gmailUser;

  if (!gmailUser || !gmailPassword) {
    return NextResponse.json(
      { error: 'Email service is not configured' },
      { status: 500 },
    );
  }

  const { name, email, phone, eventDate, message } = parsed.data;

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : 'Phone: -',
    eventDate ? `Event date: ${eventDate}` : 'Event date: -',
    '',
    'Message:',
    message,
  ].join('\n');

  // Gmail SMTP. Auth uses an App Password (Google account needs 2FA enabled).
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: gmailUser, pass: gmailPassword },
  });

  try {
    await transporter.sendMail({
      // Gmail forces the From to the authenticated account, so we keep the
      // address as gmailUser and only set a friendly display name.
      from: `The Moon Charm <${gmailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `New contact request from ${name}`,
      text,
    });
  } catch {
    return NextResponse.json(
      { error: 'Email delivery failed' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
