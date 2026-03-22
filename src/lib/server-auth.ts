import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  const role = (session?.user as any)?.role as 'user' | 'admin' | undefined;

  return { session, userId, role };
}

export async function requireUser() {
  const { userId, role } = await getSessionUser();
  if (!userId) {
    throw new Error('UNAUTHORIZED');
  }
  return { userId, role };
}

export async function requireAdmin() {
  const { userId, role } = await requireUser();
  if (role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return { userId, role };
}
