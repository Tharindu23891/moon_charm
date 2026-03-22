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
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>

      <div className="mt-6 rounded-2xl border bg-white p-6 text-sm">
        <div className="grid gap-2">
          <div>
            <span className="text-neutral-600">Name:</span>{' '}
            <span className="font-medium text-neutral-900">{session.user.name ?? '—'}</span>
          </div>
          <div>
            <span className="text-neutral-600">Email:</span>{' '}
            <span className="font-medium text-neutral-900">{session.user.email ?? '—'}</span>
          </div>
          <div>
            <span className="text-neutral-600">Role:</span>{' '}
            <span className="font-medium text-neutral-900">{role ?? 'user'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/orders"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            View orders
          </Link>
          {role === 'admin' ? (
            <Link
              href="/admin"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-50"
            >
              Admin dashboard
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
