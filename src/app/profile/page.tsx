import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MoonMark } from '@/components/moon-mark';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = { title: 'Your account' };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="mc-container py-20 text-center">
        <h1 className="font-display text-3xl">Please sign in</h1>
        <p className="mt-3 text-muted-foreground">Sign in to view your account details.</p>
        <Button asChild className="mt-6"><Link href="/login?next=/profile">Sign in</Link></Button>
      </div>
    );
  }

  const role = (session.user as { role?: string }).role;
  const name = session.user.name ?? 'there';
  const initial = (session.user.name ?? session.user.email ?? 'M').charAt(0).toUpperCase();

  return (
    <div className="mc-container max-w-3xl py-12 md:py-16">
      <p className="mc-eyebrow">Your account</p>
      <h1 className="mt-4 font-display text-[clamp(2rem,4vw,2.8rem)]">Hello, {name}</h1>

      <div className="mt-8 rounded-[var(--r-lg)] border border-line bg-surface p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary font-display text-2xl text-white">
            {initial}
          </span>
          <div>
            <p className="font-display text-xl leading-tight">{session.user.name ?? '—'}</p>
            <p className="text-sm text-muted-foreground">{session.user.email ?? '—'}</p>
          </div>
          {role === 'admin' ? (
            <Badge variant="blush" className="ml-auto">Admin</Badge>
          ) : null}
        </div>

        <dl className="mt-7 grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-faint">Name</dt>
            <dd className="mt-1 text-ink">{session.user.name ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.1em] text-faint">Email</dt>
            <dd className="mt-1 text-ink">{session.user.email ?? '—'}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild><Link href="/orders">View your orders</Link></Button>
          {role === 'admin' ? <Button asChild variant="outline"><Link href="/admin">Admin dashboard</Link></Button> : null}
        </div>
      </div>

      <Link href="/products" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-ink">
        <span className="h-5 w-5 text-honey"><MoonMark /></span>
        Continue shopping
      </Link>
    </div>
  );
}
