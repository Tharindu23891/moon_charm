import { LoginClient } from './login-client';

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const sp = await searchParams;
  const next = typeof sp?.next === 'string' ? sp.next : '/';
  return <LoginClient next={next} />;
}
