'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/cn';

type Option = { value: string; label: string };

export function SortSelect({
  options,
  paramKey = 'sort',
  defaultValue,
  className,
  label = 'Sort',
}: Readonly<{
  options: Option[];
  paramKey?: string;
  defaultValue: string;
  className?: string;
  label?: string;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? defaultValue;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value && e.target.value !== defaultValue) params.set(paramKey, e.target.value);
    else params.delete(paramKey);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };

  return (
    <select
      value={current}
      onChange={onChange}
      aria-label={label}
      className={cn('mc-select mc-input h-11', className)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
