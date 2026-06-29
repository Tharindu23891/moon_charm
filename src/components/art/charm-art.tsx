import { cn } from '@/lib/cn';

/**
 * THE MOON CHARM house artwork.
 *
 * A small family of hand-built, on-brand SVG "scenes" used in place of stock
 * photography for hero / editorial slots. Everything is inline vector — no
 * network request, a few KB each, rendered with the HTML so it paints
 * instantly. The palette is the deep-indigo brand identity (no gold), and the
 * motif language (crescent moon, scattered stars, a 4-point sparkle, a faint
 * butterfly, a thin botanical sprig) ties back to THE MOON CHARM mark.
 *
 * Each variant fills its container like `object-cover` via
 * preserveAspectRatio="xMidYMid slice"; the caller positions it
 * (e.g. `absolute inset-0`). Pure server component: the gentle twinkle/drift is
 * CSS-only and honours prefers-reduced-motion (see globals.css).
 */

export type CharmArtVariant =
  | 'hero'
  | 'hero-wide'
  | 'story'
  | 'moment-1'
  | 'moment-2'
  | 'moment-3';

const C = {
  deep: '#0a0730',
  deep2: '#120e4d',
  indigo: '#1c1676',
  indigoUp: '#2a23a0',
  blue: '#155dfc',
  blueSoft: '#4f7dff',
  peri: '#9db4ff',
  peri2: '#c4d2ff',
  moon: '#eef1ff',
  white: '#ffffff',
};

// Deterministic scatter so server and client render identically (no hydration
// drift) and the field looks organic without hand-placing every star.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Star = { x: number; y: number; r: number; o: number; tw?: boolean };

function starField(
  seed: number,
  count: number,
  w: number,
  h: number,
  avoid?: { x: number; y: number; r: number },
): Star[] {
  const next = rng(seed);
  const out: Star[] = [];
  let guard = 0;
  while (out.length < count && guard < count * 8) {
    guard += 1;
    const x = next() * w;
    const y = next() * h;
    if (avoid) {
      const d = Math.hypot(x - avoid.x, y - avoid.y);
      if (d < avoid.r) continue;
    }
    const big = next() > 0.86;
    out.push({
      x: Math.round(x),
      y: Math.round(y),
      r: big ? 1.6 + next() * 1.3 : 0.5 + next() * 1.0,
      o: 0.35 + next() * 0.55,
      tw: next() > 0.7,
    });
  }
  return out;
}

function Stars({ data, color = C.white }: { data: Star[]; color?: string }) {
  return (
    <>
      {data.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill={color}
          opacity={s.o}
          className={s.tw ? 'mc-tw' : undefined}
          style={
            s.tw
              ? ({
                  '--tw-dur': `${(4 + (i % 5)).toFixed(0)}s`,
                  '--tw-delay': `${((i % 7) * 0.6).toFixed(1)}s`,
                  '--tw-min': (s.o * 0.4).toFixed(2),
                } as React.CSSProperties)
              : undefined
          }
        />
      ))}
    </>
  );
}

// Concave 4-point sparkle, centred on origin.
function Sparkle({
  x,
  y,
  s = 1,
  rotate = 0,
  color = C.peri2,
  opacity = 0.9,
  twinkle = false,
  delay = 0,
}: {
  x: number;
  y: number;
  s?: number;
  rotate?: number;
  color?: string;
  opacity?: number;
  twinkle?: boolean;
  delay?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}
      opacity={opacity}
      className={twinkle ? 'mc-tw' : undefined}
      style={
        twinkle
          ? ({
              '--tw-dur': '6s',
              '--tw-delay': `${delay}s`,
              '--tw-min': '0.45',
            } as React.CSSProperties)
          : undefined
      }
    >
      <path
        d="M0,-11 C1.6,-3.4 3.4,-1.6 11,0 C3.4,1.6 1.6,3.4 0,11 C-1.6,3.4 -3.4,1.6 -11,0 C-3.4,-1.6 -1.6,-3.4 0,-11 Z"
        fill={color}
      />
    </g>
  );
}

// Abstract line butterfly — the house signature, kept as a thin stroke so it
// reads as a refined mark rather than clip-art.
function Butterfly({
  x,
  y,
  s = 1,
  rotate = 0,
  color = C.peri,
  opacity = 0.55,
}: {
  x: number;
  y: number;
  s?: number;
  rotate?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={1.3}
      strokeLinecap="round"
      opacity={opacity}
    >
      <path d="M0,-13 C-15,-22 -30,-14 -24,2 C-21,11 -8,9 0,1" />
      <path d="M0,-13 C15,-22 30,-14 24,2 C21,11 8,9 0,1" />
      <path d="M0,1 C-12,4 -19,12 -14,20 C-9,26 -2,15 0,7" />
      <path d="M0,1 C12,4 19,12 14,20 C9,26 2,15 0,7" />
      <path d="M0,-13 L0,7" />
      <path d="M0,-13 C-3,-19 -6,-21 -9,-22" />
      <path d="M0,-13 C3,-19 6,-21 9,-22" />
    </g>
  );
}

// Thin botanical sprig rising from a point — warmth without weight.
function Sprig({
  x,
  y,
  s = 1,
  rotate = 0,
  color = C.peri,
  opacity = 0.4,
}: {
  x: number;
  y: number;
  s?: number;
  rotate?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${s})`}
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="round"
      opacity={opacity}
    >
      <path d="M0,0 C6,-28 -4,-58 4,-92" />
      <path d="M3,-20 C16,-24 22,-34 22,-44 C13,-43 4,-37 2,-26" fill={color} fillOpacity={0.12} />
      <path d="M1,-44 C-12,-49 -19,-59 -18,-70 C-8,-68 0,-60 2,-50" fill={color} fillOpacity={0.12} />
      <path d="M3,-66 C15,-70 21,-79 21,-88 C12,-86 5,-79 3,-71" fill={color} fillOpacity={0.12} />
    </g>
  );
}

function Defs({
  p,
  from,
  to,
  glow,
  gx,
  gy,
  gr,
}: {
  p: string;
  from: string;
  to: string;
  glow?: string;
  gx?: number;
  gy?: number;
  gr?: number;
}) {
  return (
    <defs>
      <linearGradient id={`${p}-bg`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stopColor={from} />
        <stop offset="1" stopColor={to} />
      </linearGradient>
      {glow ? (
        <radialGradient
          id={`${p}-glow`}
          cx={gx}
          cy={gy}
          r={gr}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor={glow} stopOpacity="0.55" />
          <stop offset="0.5" stopColor={glow} stopOpacity="0.18" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      ) : null}
      <radialGradient id={`${p}-moon`} cx="0.38" cy="0.34" r="0.75">
        <stop offset="0" stopColor={C.white} />
        <stop offset="0.6" stopColor={C.moon} />
        <stop offset="1" stopColor={C.peri2} />
      </radialGradient>
      <filter id={`${p}-grain`} x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
          result="n"
        />
        <feColorMatrix in="n" type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.05" />
        </feComponentTransfer>
      </filter>
    </defs>
  );
}

// A full or crescent moon carved with a mask, with a soft halo.
function Moon({
  p,
  cx,
  cy,
  r,
  crescent,
  ox = 0,
  oy = 0,
}: {
  p: string;
  cx: number;
  cy: number;
  r: number;
  crescent?: boolean;
  ox?: number;
  oy?: number;
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r * 2.1} fill={`url(#${p}-moonglow)`} />
      {crescent ? (
        <>
          <mask id={`${p}-crescent`}>
            <circle cx={cx} cy={cy} r={r} fill="#fff" />
            <circle cx={cx + ox} cy={cy + oy} r={r * 0.96} fill="#000" />
          </mask>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={`url(#${p}-moon)`}
            mask={`url(#${p}-crescent)`}
          />
        </>
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={`url(#${p}-moon)`} opacity={0.96} />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r + 4}
        fill="none"
        stroke={C.peri}
        strokeWidth={0.8}
        opacity={0.35}
      />
    </>
  );
}

function MoonGlow({ p, cx, cy, r }: { p: string; cx: number; cy: number; r: number }) {
  return (
    <radialGradient
      id={`${p}-moonglow`}
      cx={cx}
      cy={cy}
      r={r}
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor={C.blueSoft} stopOpacity="0.42" />
      <stop offset="0.55" stopColor={C.blue} stopOpacity="0.12" />
      <stop offset="1" stopColor={C.blue} stopOpacity="0" />
    </radialGradient>
  );
}

const base = 'block h-full w-full';

export function CharmArt({
  variant,
  className,
}: {
  variant: CharmArtVariant;
  className?: string;
}) {
  switch (variant) {
    case 'hero':
      return <HeroScene className={className} />;
    case 'hero-wide':
      return <HeroWideScene className={className} />;
    case 'story':
      return <StoryScene className={className} />;
    case 'moment-1':
      return <MomentScene className={className} kind={1} />;
    case 'moment-2':
      return <MomentScene className={className} kind={2} />;
    case 'moment-3':
      return <MomentScene className={className} kind={3} />;
    default:
      return <HeroScene className={className} />;
  }
}

function HeroScene({ className }: { className?: string }) {
  const p = 'h';
  const w = 820;
  const h = 1040;
  const stars = starField(7, 46, w, h, { x: 560, y: 250, r: 150 });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A crescent moon over a field of stars"
      className={cn(base, className)}
    >
      <Defs p={p} from={C.deep} to={C.indigo} glow={C.blue} gx={520} gy={300} gr={520} />
      <defs>
        <MoonGlow p={p} cx={560} cy={250} r={200} />
      </defs>
      <rect width={w} height={h} fill={`url(#${p}-bg)`} />
      <rect width={w} height={h} fill={`url(#${p}-glow)`} />
      <Stars data={stars} />
      <Moon p={p} cx={560} cy={250} r={96} crescent ox={48} oy={-26} />
      <Sparkle x={300} y={392} s={1.5} color={C.peri2} twinkle delay={0.4} />
      <Sparkle x={452} y={150} s={0.9} color={C.white} twinkle delay={1.8} />
      <Sparkle x={188} y={236} s={0.6} color={C.peri} opacity={0.8} />
      <Butterfly x={232} y={560} s={1.25} rotate={-12} />
      {/* constellation cluster */}
      <g stroke={C.peri} strokeWidth={0.7} opacity={0.5} fill="none">
        <path d="M150,720 L250,786 L370,742 L430,830 L322,860" />
      </g>
      {[
        [150, 720],
        [250, 786],
        [370, 742],
        [430, 830],
        [322, 860],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.2} fill={C.peri2} opacity={0.9} />
      ))}
      <Sprig x={612} y={1010} s={1.3} rotate={6} />
      <Sprig x={92} y={1015} s={1.0} rotate={-10} />
      <rect width={w} height={h} filter={`url(#${p}-grain)`} opacity={0.5} />
    </svg>
  );
}

function HeroWideScene({ className }: { className?: string }) {
  const p = 'hw';
  const w = 1600;
  const h = 760;
  const stars = starField(21, 70, w, h, { x: 1230, y: 250, r: 180 });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A night sky with a crescent moon and scattered stars"
      className={cn(base, className)}
    >
      <Defs p={p} from={C.deep} to={C.deep2} glow={C.blue} gx={1200} gy={220} gr={760} />
      <defs>
        <MoonGlow p={p} cx={1230} cy={250} r={240} />
      </defs>
      <rect width={w} height={h} fill={`url(#${p}-bg)`} />
      <rect width={w} height={h} fill={`url(#${p}-glow)`} />
      <Stars data={stars} />
      <Moon p={p} cx={1230} cy={250} r={108} crescent ox={52} oy={-30} />
      <Sparkle x={980} y={170} s={1.5} color={C.peri2} twinkle delay={0.6} />
      <Sparkle x={1420} y={430} s={0.95} color={C.white} twinkle delay={2.1} />
      <Sparkle x={760} y={300} s={0.65} color={C.peri} opacity={0.75} />
      <Butterfly x={1080} y={470} s={1.4} rotate={8} />
      <g stroke={C.peri} strokeWidth={0.7} opacity={0.45} fill="none">
        <path d="M1320,540 L1410,600 L1520,560" />
      </g>
      {[
        [1320, 540],
        [1410, 600],
        [1520, 560],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.2} fill={C.peri2} opacity={0.85} />
      ))}
      <rect width={w} height={h} filter={`url(#${p}-grain)`} opacity={0.5} />
    </svg>
  );
}

function StoryScene({ className }: { className?: string }) {
  const p = 's';
  const w = 1040;
  const h = 840;
  const stars = starField(33, 40, w, h, { x: 300, y: 300, r: 150 });
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Phases of the moon above a field of stars"
      className={cn(base, className)}
    >
      <Defs p={p} from={C.deep2} to={C.indigo} glow={C.blueSoft} gx={320} gy={300} gr={520} />
      <defs>
        <MoonGlow p={p} cx={300} cy={300} r={180} />
      </defs>
      <rect width={w} height={h} fill={`url(#${p}-bg)`} />
      <rect width={w} height={h} fill={`url(#${p}-glow)`} />
      <Stars data={stars} />
      <Moon p={p} cx={300} cy={300} r={92} crescent ox={-44} oy={-22} />
      {/* moon-phase line, the editorial through-thread */}
      <g>
        {[
          { x: 560, r: 14, m: 0 },
          { x: 660, r: 16, m: 0.45 },
          { x: 770, r: 18, m: 0.9 },
          { x: 880, r: 16, m: 1.4 },
          { x: 980, r: 14, m: 1.85 },
        ].map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={200} r={d.r} fill={C.peri} opacity={0.16} />
            <mask id={`${p}-ph-${i}`}>
              <circle cx={d.x} cy={200} r={d.r} fill="#fff" />
              <circle cx={d.x + d.m * d.r} cy={200} r={d.r} fill="#000" />
            </mask>
            <circle
              cx={d.x}
              cy={200}
              r={d.r}
              fill={C.peri2}
              opacity={0.85}
              mask={`url(#${p}-ph-${i})`}
            />
          </g>
        ))}
      </g>
      <Sparkle x={540} y={520} s={1.4} color={C.peri2} twinkle delay={0.8} />
      <Sparkle x={760} y={620} s={0.8} color={C.white} twinkle delay={2.4} />
      <Butterfly x={820} y={470} s={1.3} rotate={-6} />
      <Sprig x={140} y={820} s={1.4} rotate={-4} />
      <Sprig x={940} y={825} s={1.1} rotate={9} />
      <rect width={w} height={h} filter={`url(#${p}-grain)`} opacity={0.5} />
    </svg>
  );
}

function MomentScene({ className, kind }: { className?: string; kind: 1 | 2 | 3 }) {
  const p = `m${kind}`;
  const w = 700;
  const h = 880;
  const conf = {
    1: { from: C.deep, to: C.indigo, glow: C.blue, label: 'A crescent moon and stars' },
    2: {
      from: C.indigo,
      to: C.indigoUp,
      glow: C.blueSoft,
      label: 'A butterfly among the stars',
    },
    3: { from: C.deep2, to: C.deep, glow: C.blue, label: 'A sparkle in the night sky' },
  }[kind];
  const stars = starField(50 + kind, 30, w, h);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={conf.label}
      className={cn(base, className)}
    >
      <Defs p={p} from={conf.from} to={conf.to} glow={conf.glow} gx={350} gy={300} gr={420} />
      <defs>
        <MoonGlow p={p} cx={kind === 1 ? 470 : 350} cy={kind === 1 ? 230 : 260} r={170} />
      </defs>
      <rect width={w} height={h} fill={`url(#${p}-bg)`} />
      <rect width={w} height={h} fill={`url(#${p}-glow)`} />
      <Stars data={stars} />

      {kind === 1 ? (
        <>
          <Moon p={p} cx={470} cy={230} r={86} crescent ox={42} oy={-22} />
          <Sparkle x={210} y={360} s={1.3} color={C.peri2} twinkle delay={0.5} />
          <Sprig x={120} y={860} s={1.2} rotate={-6} />
        </>
      ) : null}

      {kind === 2 ? (
        <>
          <Butterfly x={350} y={360} s={2.6} color={C.peri2} opacity={0.7} />
          <Sparkle x={210} y={210} s={1.0} color={C.white} twinkle delay={1.1} />
          <Sparkle x={520} y={540} s={1.2} color={C.peri2} twinkle delay={2.0} />
        </>
      ) : null}

      {kind === 3 ? (
        <>
          <Sparkle x={350} y={330} s={3.0} color={C.peri2} twinkle delay={0.3} />
          <Sparkle x={520} y={560} s={1.1} color={C.white} twinkle delay={1.6} />
          <Sparkle x={170} y={560} s={0.8} color={C.peri} opacity={0.8} />
          <g stroke={C.peri} strokeWidth={0.7} opacity={0.45} fill="none">
            <path d="M200,690 L320,740 L450,700" />
          </g>
        </>
      ) : null}

      <rect width={w} height={h} filter={`url(#${p}-grain)`} opacity={0.5} />
    </svg>
  );
}
