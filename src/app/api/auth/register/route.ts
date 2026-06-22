import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ensureDatabase } from '@/lib/api';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/password';

const registerSchema = z.object({
  name: z.string().min(1).max(80).optional().default(''),
  email: z.string().email(),
  password: z.string().min(6).max(200),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;

  const existing = await User.findOne({ email: parsed.data.email }).lean();
  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 },
    );
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: 'user',
  });

  return NextResponse.json(
    {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    },
    { status: 201 },
  );
}
