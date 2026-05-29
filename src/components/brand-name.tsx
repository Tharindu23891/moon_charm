type BrandNameProps = Readonly<{
  className?: string;
  noWrap?: boolean;
}>;

export function BrandName({ className = '', noWrap = false }: BrandNameProps) {
  const classes = ['mc-text-gradient', 'inline-block', noWrap ? 'whitespace-nowrap' : '', className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>The Moon Charm</span>;
}