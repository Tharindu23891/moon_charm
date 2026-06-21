import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/api';
import { requireAdmin } from '@/lib/server-auth';
import { User } from '@/models/User';

export async function GET() {
  try {
    await requireAdmin();
  } catch (e: any) {
    const status = e?.message === 'UNAUTHORIZED' ? 401 : 403;
    return NextResponse.json({ error: 'Forbidden' }, { status });
  }

  const dbError = await ensureDatabase();
  if (dbError) return dbError;
  const users = await User.find({}).sort({ createdAt: -1 }).limit(200).lean();

  return NextResponse.json(
    users.map((u: any) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
    }))
  );
}
