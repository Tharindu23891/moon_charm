import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(''),
  eventDate: z.string().max(60).optional().default(''),
  message: z.string().min(5).max(2000),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const toEmail = process.env.RESEND_TO_EMAIL;

  if (!apiKey || !fromEmail || !toEmail) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
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

  try {
    await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `New contact request from ${name}`,
      text,
    });
  } catch {
    return NextResponse.json({ error: 'Email delivery failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
