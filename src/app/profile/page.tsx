import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const role = (session.user as any).role as string | undefined;

  return (
    <div className="mc-container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        <span className="mc-text-gradient">Profile</span>
      </h1>

      <div className="mc-card mt-6 p-6 text-sm">
        <div className="grid gap-2">
          <div>
            <span className="text-zinc-600">Name:</span>{' '}
            <span className="font-medium text-zinc-900">{session.user.name ?? '—'}</span>
          </div>
          <div>
            <span className="text-zinc-600">Email:</span>{' '}
            <span className="font-medium text-zinc-900">{session.user.email ?? '—'}</span>
          </div>
          <div>
            <span className="text-zinc-600">Role:</span>{' '}
            <span className="font-medium text-zinc-900">{role ?? 'user'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/orders"
            className="mc-btn"
          >
            View orders
          </Link>
          {role === 'admin' ? (
            <Link
              href="/admin"
              className="mc-btn-outline"
            >
              Admin dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
