import Link from 'next/link';
import { Reveal } from '@/components/reveal';
import { Stagger, StaggerItem } from '@/components/motion/stagger';
import { MoonMark } from '@/components/moon-mark';
import { CharmArt, type CharmArtVariant } from '@/components/art/charm-art';
import { Button } from '@/components/ui/button';

const MOMENTS: CharmArtVariant[] = ['moment-1', 'moment-2', 'moment-3'];

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
    <section className="relative flex min-h-[58vh] items-end overflow-hidden bg-espresso">
      <div className="mc-art-drift absolute inset-0">
        <CharmArt variant="hero-wide" className="h-full w-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/10" />
      <div className="mc-container relative pt-28 pb-14 md:pb-20">
        <Stagger className="max-w-2xl">
          <StaggerItem as="span" className="mc-eyebrow is-on-dark block">
            Our story
          </StaggerItem>
          <StaggerItem
            as="h1"
            className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] text-on-dark"
          >
            Made by hand, in Kuliyapitiya
          </StaggerItem>
          <StaggerItem
            as="p"
            className="mt-5 max-w-xl text-[1.1rem] leading-relaxed text-on-dark/80"
          >
            THE MOON CHARM is a small gift house with an old-fashioned belief: a
            gift should feel like the person who sent it was thinking of you.
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section className="mc-container mc-section">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <Reveal>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] leading-tight">
              It started at a kitchen table
            </h2>
          </Reveal>
          <div className="mc-prose mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted-foreground">
            <Reveal as="p" delay={120}>
              The first gifts were chocolate bouquets, wrapped late at night for
              friends’ birthdays. People kept asking where they came from. They
              came from a table in Kuliyapitiya, and a little stubbornness about
              getting the details right.
            </Reveal>
            <Reveal as="p" delay={220}>
              That has not changed. A person still chooses the pieces, folds the
              paper, ties the ribbon, and writes your note. Nothing is
              mass-produced, and nothing is rushed out the door.
            </Reveal>
            <Reveal as="p" delay={320}>
              When it arrives, it looks like someone cared. Because someone did.
            </Reveal>
          </div>
        </div>
        <Reveal className="order-1 lg:order-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--r-xl)] bg-espresso shadow-[var(--shadow)]">
            <CharmArt variant="story" className="absolute inset-0" />
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
          <h2 className="max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">
            How we work
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--r-lg)] border border-line bg-line sm:grid-cols-3">
          {values.map((v, i) => (
            <Reveal
              key={v.title}
              delay={i * 90}
              className="group bg-bg p-7 md:p-8"
            >
              <span className="inline-block h-7 w-7 text-primary transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110">
                <MoonMark />
              </span>
              <h3 className="mt-5 font-display text-xl transition-colors duration-300 group-hover:text-primary">
                {v.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {v.body}
              </p>
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
        <Reveal>
          <div className="mc-lift h-full rounded-[var(--r-lg)] border border-line bg-surface p-8 md:p-10">
            <span className="mc-eyebrow">Mission</span>
            <p className="mt-5 font-display text-[1.45rem] leading-snug text-ink">
              To make giving feel personal again. We curate and assemble gifts
              that carry real thought, and deliver them with the care we would
              want for our own.
            </p>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="mc-lift h-full rounded-[var(--r-lg)] border border-line bg-surface p-8 md:p-10">
            <span className="mc-eyebrow">Vision</span>
            <p className="mt-5 font-display text-[1.45rem] leading-snug text-ink">
              To be the gift house Sri Lanka trusts for the moments that matter,
              known less for what we sell than for how it makes people feel.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function MomentsGallery() {
  return (
    <section className="mc-container mc-section pt-0">
      <Reveal>
        <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] leading-tight">
          A few of our favourite things
        </h2>
      </Reveal>
      <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3">
        {MOMENTS.map((variant, i) => (
          <Reveal
            key={variant}
            delay={i * 90}
            className={i === 0 ? 'col-span-2 md:col-span-1' : ''}
          >
            <div className="group relative aspect-[4/5] overflow-hidden rounded-[var(--r-lg)] bg-espresso">
              <CharmArt
                variant={variant}
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
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
          <span className="h-9 w-9 text-primary">
            <MoonMark />
          </span>
          <h2 className="max-w-xl text-[clamp(1.7rem,3vw,2.4rem)] leading-tight text-on-dark">
            Find something worth sending
          </h2>
          <p className="max-w-md text-on-dark/75">
            Browse the shop, or let a ready-made package do the choosing for
            you.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/products">Shop gifts</Link>
            </Button>
            <Link
              href="/packages"
              className="inline-flex items-center justify-center rounded-[var(--r)] border border-white/25 px-5 py-2.5 text-sm font-semibold text-on-dark transition-colors hover:bg-white/10"
            >
              Browse packages
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
