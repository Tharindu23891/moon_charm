import { LoginClient } from './login-client';

export default function LoginPage({
  searchParams,
}: Readonly<{
  searchParams?: Record<string, string | string[] | undefined>;
}>) {
  const next = typeof searchParams?.next === 'string' ? searchParams.next : '/';
  return <LoginClient next={next} />;
}
