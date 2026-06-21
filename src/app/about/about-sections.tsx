import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { MoonMark } from '@/components/moon-mark';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?auto=format&fit=crop&w=1800&q=75';
const STORY_IMAGE = 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1100&q=75';
const MOMENTS = [
  { src: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=800&q=75', alt: 'Two ceramic vases with a sprig of blossom' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=75', alt: 'A long table dressed with flowers for a celebration' },
  { src: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=75', alt: 'A bouquet of peach roses and dried flowers' },
];

const values = [
  {
    title: 'Chosen, not stocked',
    body: 'We pick every piece by hand. If it would not delight someone we love, it does not go in.',
  },
  {
    title: 'Wrapped with patience',
    body: 'Paper folded, ribbon tied, note written. The presentation is part of the gift, never an afterthought.',
  },
  {
    title: 'Sent with intention',
    body: 'We treat each order like it is going to someone who matters, because to you, it is.',
  },
];

export function AboutHero() {
  return (
    <section className="relative flex min-h-[58vh] items-end overflow-hidden">
      <Image src={HERO_IMAGE} alt="Warm roses in soft afternoon light" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/10" />
      <div className="mc-container relative pb-14 pt-28 md:pb-20">
        <div className="max-w-2xl mc-animate-rise">
          <span className="mc-eyebrow text-honey before:bg-honey">Our story</span>
          <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-on-dark">
            Made by hand, in Kuliyapitiya
          </h1>
          <p className="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-on-dark/80">
            The Moon Charm is a small gift house with an old-fashioned belief: a gift should feel
            like the person who sent it was thinking of you.
          </p>
        </div>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="mc-container mc-section">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">It started at a kitchen table</h2>
          <div className="mc-prose mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted-foreground">
            <p>
              The first gifts were chocolate bouquets, wrapped late at night for friends’ birthdays.
              People kept asking where they came from. They came from a table in Kuliyapitiya, and a
              little stubbornness about getting the details right.
            </p>
            <p>
              That has not changed. A person still chooses the pieces, folds the paper, ties the
              ribbon, and writes your note. Nothing is mass-produced, and nothing is rushed out the door.
            </p>
            <p>When it arrives, it looks like someone cared. Because someone did.</p>
          </div>
        </Reveal>
        <Reveal className="order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--r-xl)] bg-surface shadow-[var(--shadow)]">
            <Image src={STORY_IMAGE} alt="Hands presenting a gift wrapped in brown paper" fill sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ValuesSection() {
  return (
    <section className="bg-surface-warm">
      <div className="mc-container mc-section">
        <Reveal>
          <h2 className="max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">How we work</h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-line bg-line sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 90} className="bg-bg p-7 md:p-8">
              <span className="inline-block h-7 w-7 text-honey"><MoonMark /></span>
              <h3 className="mt-5 font-display text-xl">{v.title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">{v.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MissionVisionSection() {
  return (
    <section className="mc-container mc-section">
      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        <Reveal className="rounded-[var(--r-lg)] border border-line bg-surface p-8 md:p-10">
          <span className="mc-eyebrow">Mission</span>
          <p className="mt-5 font-display text-[1.45rem] leading-snug text-ink">
            To make giving feel personal again. We curate and assemble gifts that carry real thought,
            and deliver them with the care we would want for our own.
          </p>
        </Reveal>
        <Reveal delay={90} className="rounded-[var(--r-lg)] border border-line bg-surface p-8 md:p-10">
          <span className="mc-eyebrow">Vision</span>
          <p className="mt-5 font-display text-[1.45rem] leading-snug text-ink">
            To be the gift house Sri Lanka trusts for the moments that matter, known less for what we
            sell than for how it makes people feel.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function MomentsGallery() {
  return (
    <section className="mc-container mc-section pt-0">
      <Reveal>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">A few of our favourite things</h2>
      </Reveal>
      <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3">
        {MOMENTS.map((m, i) => (
          <Reveal
            key={m.src}
            delay={i * 90}
            className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-surface">
              <Image src={m.src} alt={m.alt} fill sizes="(max-width: 768px) 100vw, 360px" className="object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function AboutCTA() {
  return (
    <section className="mc-container mc-section pt-0">
      <Reveal>
        <div className="flex flex-col items-center gap-6 rounded-[var(--r-xl)] bg-espresso px-6 py-14 text-center text-on-dark">
          <span className="h-9 w-9 text-honey"><MoonMark /></span>
          <h2 className="max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] leading-tight text-on-dark">
            Find something worth sending
          </h2>
          <p className="max-w-md text-on-dark/75">
            Browse the shop, or let a ready-made package do the choosing for you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="bg-honey text-espresso hover:bg-honey/90"><Link href="/products">Shop gifts</Link></Button>
            <Link href="/packages" className="inline-flex items-center justify-center rounded-[var(--r)] border border-white/25 px-5 py-2.5 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10">
              Browse packages
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
