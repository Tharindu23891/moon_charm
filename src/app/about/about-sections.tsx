"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const HERO_IMAGE_PRIMARY = '/about/hero2.png';
const LOGO_IMAGE_PRIMARY = '/about/logo.jpeg';

const HERO_IMAGE_FALLBACK = '/about/hero.jpeg';
const LOGO_IMAGE_FALLBACK = '/about/logo.jpeg';

type RevealDirection = 'left' | 'right' | 'up';

function useInViewOnce(opts?: { rootMargin?: string; threshold?: number }) {
  const { rootMargin = '0px 0px -15% 0px', threshold = 0.15 } = opts ?? {};
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}

function Reveal({
  children,
  direction = 'up',
  delayMs = 0,
  className = '',
}: Readonly<{
  children: ReactNode;
  direction?: RevealDirection;
  delayMs?: number;
  className?: string;
}>) {
  const { ref, inView } = useInViewOnce();

  const fromClass =
    direction === 'left'
      ? '-translate-x-8'
      : direction === 'right'
        ? 'translate-x-8'
        : 'translate-y-6';

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={
        `motion-safe:will-change-transform motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out ` +
        `motion-reduce:transform-none motion-reduce:opacity-100 ` +
        (inView ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${fromClass}`) +
        (className ? ` ${className}` : '')
      }
    >
      {children}
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle?: string }>) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-base leading-relaxed text-neutral-600 md:text-lg">{subtitle}</p>
      ) : null}
    </div>
  );
}

function IconBadge({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-violet-200/80 via-fuchsia-200/80 to-rose-200/80 shadow-sm shadow-violet-200/50">
      {children}
    </div>
  );
}

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function avatarDataUri(name: string) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#7c3aed" stop-opacity="0.85"/>
      <stop offset="0.5" stop-color="#d946ef" stop-opacity="0.80"/>
      <stop offset="1" stop-color="#fb7185" stop-opacity="0.85"/>
    </linearGradient>
  </defs>
  <rect width="240" height="240" rx="120" fill="url(#g)"/>
  <circle cx="120" cy="120" r="112" fill="#ffffff" fill-opacity="0.10"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="82" font-family="ui-sans-serif, system-ui" fill="#ffffff" fill-opacity="0.95" font-weight="800">${initials}</text>
</svg>`;

  return svgDataUri(svg);
}

export function AboutHeroSection() {
  const [heroSrc, setHeroSrc] = useState(HERO_IMAGE_PRIMARY);
  const [logoSrc, setLogoSrc] = useState(LOGO_IMAGE_PRIMARY);

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden border-y border-white/50">
      <div className="absolute inset-0">
        <Image
          src={heroSrc}
          alt="About The Moon Charm"
          fill
          priority
          unoptimized
          onError={() => setHeroSrc(HERO_IMAGE_FALLBACK)}
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-white/35" />
        <div className="absolute inset-0 bg-linear-to-br from-violet-200/30 via-fuchsia-100/20 to-rose-200/30" />
      </div>

      <div className="relative mc-container py-16 md:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center motion-safe:animate-[mc-fade-up_700ms_ease-out_both]">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/60 bg-white/60 px-4 py-2 text-xs font-semibold text-neutral-800 backdrop-blur">
            <Image
              src={logoSrc}
              alt="The Moon Charm"
              width={28}
              height={28}
              className="h-7 w-7 rounded-xl border border-white/60"
              priority
              unoptimized
              onError={() => setLogoSrc(LOGO_IMAGE_FALLBACK)}
            />
            <span className="mc-text-gradient">The Moon Charm</span>
          </div>

          <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-rose-600 md:text-7xl">
            About Us
          </h1>

          <p className="mt-4 max-w-2xl text-sm text-neutral-700 md:text-base">
            
          </p>
        </div>
      </div>
    </section>
  );
}

export function CompanyStorySection() {
  const [storyImageSrc, setStoryImageSrc] = useState(LOGO_IMAGE_PRIMARY);

  return (
    <section className="mt-14">
      <SectionHeading title="Story of The Moon Charm" subtitle="Gifts that feel personal, polished, and magical." />

      <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-stretch">
        <Reveal direction="left">
          <div className="flex h-full items-center justify-center overflow-hidden rounded-3xl bg-white/60 p-8 md:p-12">
            <Image
              src={storyImageSrc}
              alt="The Moon Charm logo"
              width={1200}
              height={900}
              className="h-auto w-full max-w-[520px] object-contain"
              unoptimized
              onError={() => setStoryImageSrc(LOGO_IMAGE_FALLBACK)}
            />
          </div>
        </Reveal>

        <Reveal direction="right" delayMs={80}>
          <div className="flex h-full flex-col justify-center text-sm leading-relaxed text-neutral-700 md:text-base">
            <p className="max-w-prose">
              The Moon Charm was created from a simple belief: the best gifts aren’t just items — they’re feelings.
              We’re passionate about helping you celebrate birthdays, anniversaries, milestones, and everyday surprises with confidence and care.
            </p>
            <p className="mt-4 max-w-prose">
              From dreamy custom hampers to magical surprise deliveries and elegant wedding favours, every detail is thoughtfully crafted to turn your special moments into unforgettable memories.
            </p>
            <p className="mt-4 max-w-prose">Because every occasion deserves a little charm.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GlassCard({
  title,
  description,
  icon,
  accent,
}: Readonly<{ title: string; description: string; icon: ReactNode; accent: string }>) {
  return (
    <div className={`mc-card mc-card-hover p-6 ${accent}`}>
      <div className="flex items-start gap-4">
        <IconBadge>{icon}</IconBadge>
        <div>
          <div className="text-sm font-extrabold tracking-tight text-neutral-900">{title}</div>
          <p className="mt-2 text-sm text-neutral-700">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function MissionVisionSection() {
  return (
    <section className="mt-14">
      <SectionHeading
        title="Mission, Vision & Values"
        subtitle="What guides every hamper, ribbon, and note."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <GlassCard
          title="Mission"
          description="Deliver meaningful gifts that help people express love, gratitude, and celebration — beautifully and reliably."
          accent="bg-linear-to-br from-white/75 via-white/65 to-violet-50/70"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-violet-700">
              <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.5-7 10-7 10z" />
            </svg>
          }
        />
        <GlassCard
          title="Vision"
          description="Be the most trusted gifting destination — where every order feels personal, polished, and magical."
          accent="bg-linear-to-br from-white/75 via-white/65 to-fuchsia-50/70"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-fuchsia-700">
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
        />
        <GlassCard
          title="Values"
          description="Quality, creativity, and customer happiness — with thoughtful details and friendly support in every step."
          accent="bg-linear-to-br from-white/75 via-white/65 to-rose-50/70"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-rose-700">
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
            </svg>
          }
        />
      </div>
    </section>
  );
}

export function CapturedMomentsSection() {
  const [img1, setImg1] = useState('/about/1.jpeg');
  const [img2, setImg2] = useState('/about/2.jpeg');
  const [img3, setImg3] = useState('/about/3.jpeg');

  const images = useMemo(
    () => [
      { src: img1, setSrc: setImg1, alt: 'Captured moment 1' },
      { src: img2, setSrc: setImg2, alt: 'Captured moment 2' },
      { src: img3, setSrc: setImg3, alt: 'Captured moment 3' },
    ],
    [img1, img2, img3]
  );

  return (
    <section className="mt-14">
      <SectionHeading title="Captured Moments" subtitle="A peek into the magic we love creating." />

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {images.map((it, idx) => (
          <Reveal
            key={it.alt}
            direction={idx % 2 === 0 ? 'left' : 'right'}
            delayMs={idx * 80}
          >
            <div className="overflow-hidden rounded-3xl">
              <Image
                src={it.src}
                alt={it.alt}
                width={1200}
                height={900}
                className="h-auto w-full"
                unoptimized
                onError={() => it.setSrc(HERO_IMAGE_FALLBACK)}
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function VisionMissionSection() {
  const visionPoints = [
    {
      lead: 'Trusted gifting',
      rest: 'as Sri Lanka’s most reliable destination for premium, gift-ready moments.',
    },
    {
      lead: 'Timeless presentation',
      rest: 'that blends elegance with modern, creative styling.',
    },
    {
      lead: 'Meaningful personalization',
      rest: 'so every order feels unique and thoughtfully curated.',
    },
    {
      lead: 'Consistent quality',
      rest: 'in products, packaging, and finishing details — every time.',
    },
    {
      lead: 'Lasting relationships',
      rest: 'built through trust, care, and customer happiness.',
    },
  ];

  const missionPoints = [
    {
      lead: 'Craft thoughtful gifts',
      rest: 'that help customers express love, gratitude, and celebration.',
    },
    {
      lead: 'Curate premium options',
      rest: 'including hampers, surprise deliveries, and wedding favours for any occasion.',
    },
    {
      lead: 'Deliver a seamless experience',
      rest: 'from browsing to checkout to delivery, with clear communication.',
    },
    {
      lead: 'Support with care',
      rest: 'through friendly, fast help when customers need it.',
    },
    {
      lead: 'Keep improving',
      rest: 'by listening to feedback and refining designs and packaging.',
    },
  ];

  return (
    <section className="mt-14">
      <SectionHeading title="Our Vision & Mission" subtitle="Clarity behind everything we create." />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Reveal direction="left">
          <div className="mc-card flex h-full flex-col items-center p-8 text-center md:p-10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-16 w-16 text-rose-600"
              aria-hidden="true"
            >
              <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
              Our Vision
            </h3>
            <p className="mt-2 text-sm text-neutral-600 md:text-base">To be Sri Lanka’s most trusted gifting brand by:</p>

            <div className="mt-6 grid gap-5 text-sm text-neutral-700 md:text-base">
              {visionPoints.map((p) => (
                <p key={p.lead} className="leading-relaxed">
                  <span className="font-extrabold">{p.lead}</span> {p.rest}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delayMs={80}>
          <div className="mc-card flex h-full flex-col items-center p-8 text-center md:p-10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-16 w-16 text-rose-600"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3" />
              <path d="M12 19v3" />
              <path d="M2 12h3" />
              <path d="M19 12h3" />
            </svg>
            <h3 className="mt-6 text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl">
              Our Mission
            </h3>
            <p className="mt-2 text-sm text-neutral-600 md:text-base">The Moon Charm is committed to:</p>

            <div className="mt-6 grid gap-5 text-sm text-neutral-700 md:text-base">
              {missionPoints.map((p) => (
                <p key={p.lead} className="leading-relaxed">
                  <span className="font-extrabold">{p.lead}</span> {p.rest}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FeatureItem({
  title,
  description,
  icon,
}: Readonly<{ title: string; description: string; icon: ReactNode }>) {
  return (
    <div className="mc-card mc-card-hover p-5">
      <div className="flex items-start gap-4">
        <IconBadge>{icon}</IconBadge>
        <div>
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <div className="mt-1 text-xs text-neutral-600">{description}</div>
        </div>
      </div>
    </div>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="mt-14 rounded-3xl bg-white/40 p-6 md:p-8">
      <SectionHeading
        title="Why Choose Us"
        subtitle="Reliable gifting with premium presentation."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FeatureItem
          title="Premium quality products"
          description="Carefully selected items that feel special."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-violet-700">
              <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" />
            </svg>
          }
        />
        <FeatureItem
          title="Beautiful packaging"
          description="Gift-ready presentation with elegant details."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-fuchsia-700">
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
              <path d="M4 7h16v5H4z" />
              <path d="M12 22V7" />
              <path d="M12 7c-2.5 0-4-1.5-4-3s1.5-2 3-1 1 2 1 4z" />
              <path d="M12 7c2.5 0 4-1.5 4-3s-1.5-2-3-1-1 2-1 4z" />
            </svg>
          }
        />
        <FeatureItem
          title="Fast island-wide delivery"
          description="Timely drop-offs across Sri Lanka."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-rose-700">
              <path d="M3 7h12v13H3z" />
              <path d="M15 10h4l2 3v7h-6z" />
              <circle cx="7" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
          }
        />
        <FeatureItem
          title="Customizable gift packages"
          description="Personalize your gift to match the moment."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-purple-700">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          }
        />
        <FeatureItem
          title="Secure online payments"
          description="Checkout with confidence."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-violet-700">
              <path d="M12 1l8 4v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          }
        />
        <FeatureItem
          title="Friendly customer support"
          description="Quick help when you need it."
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-fuchsia-700">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
          }
        />
      </div>
    </section>
  );
}

function TeamCard({
  name,
  role,
  bio,
}: Readonly<{ name: string; role: string; bio: string }>) {
  return (
    <div className="mc-card mc-card-hover p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <Image
            src={avatarDataUri(name)}
            alt={name}
            width={56}
            height={56}
            className="h-14 w-14 rounded-full border border-white/60"
            unoptimized
          />
        </div>
        <div>
          <div className="text-sm font-semibold text-neutral-900">{name}</div>
          <div className="mt-0.5 text-xs font-semibold text-neutral-600">{role}</div>
          <p className="mt-2 text-xs text-neutral-600">{bio}</p>
        </div>
      </div>
    </div>
  );
}

export function TeamSection() {
  const team = [
    {
      name: 'Ayesha Perera',
      role: 'Founder & Curator',
      bio: 'Leads curation and ensures every gift feels personal and premium.',
    },
    {
      name: 'Nimal Fernando',
      role: 'Operations',
      bio: 'Coordinates packing and dispatch so deliveries arrive on time.',
    },
    {
      name: 'Shenali Jayasuriya',
      role: 'Design & Packaging',
      bio: 'Creates elegant packaging details that make every unboxing special.',
    },
    {
      name: 'Kasun Silva',
      role: 'Customer Support',
      bio: 'Helps customers choose the right gift and handles questions quickly.',
    },
  ];

  return (
    <section className="mt-14">
      <SectionHeading
        title="Meet the Team"
        subtitle="A small team with a big love for gifting."
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m) => (
          <TeamCard key={m.name} name={m.name} role={m.role} bio={m.bio} />
        ))}
      </div>
    </section>
  );
}

export function CallToActionSection() {
  return (
    <section className="mt-14">
      <Reveal direction="up">
        <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-linear-to-r from-violet-600 via-fuchsia-600 to-rose-500 p-8 shadow-xl shadow-fuchsia-200/30 md:p-10">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Start Spreading Happiness Today
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-white/85">
                Browse gift items and curated packages designed to make every occasion feel magical.
              </p>
            </div>

            <Link href="/products" className="mc-btn px-6 py-2.5">
              Shop Gifts
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
