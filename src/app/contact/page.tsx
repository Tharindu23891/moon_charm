import { ContactForm } from './contact-form';
import { PageHeader } from '@/components/page-header';

export const metadata = {
  title: 'Contact',
  description: 'Talk to The Moon Charm about custom gifts, packages, and occasions.',
};

const details = [
  { label: 'Call or WhatsApp', value: '+94 78 176 95 68', href: 'tel:+94781769568' },
  { label: 'Email', value: 'info.themooncharm@gmail.com', href: 'mailto:info.themooncharm@gmail.com' },
  { label: 'Where we are', value: 'Kuliyapitiya, Sri Lanka' },
  { label: 'Hours', value: 'Mon – Sat · 9am – 7pm' },
];

export default function ContactPage() {
  return (
    <div className="mc-container py-12 md:py-16">
      <PageHeader
        eyebrow="Say hello"
        title="Tell us about the occasion"
        description="For custom gifts, larger orders, or a little help choosing, send us a note. We usually reply within a day."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="rounded-[var(--r-lg)] border border-line bg-surface p-7 md:p-8">
          <dl className="space-y-6">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-faint">{d.label}</dt>
                <dd className="mt-1.5 text-[1.05rem] text-ink">
                  {d.href ? (
                    <a href={d.href} className="transition-colors hover:text-primary">{d.value}</a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 rounded-[var(--r)] border border-line bg-bg p-5">
            <p className="text-sm font-semibold text-ink">A note on timing</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              For custom orders, three days’ notice lets us source, design, and wrap without rushing.
              Tell us your date and we’ll let you know what’s possible.
            </p>
          </div>
        </aside>

        <section className="rounded-[var(--r-lg)] border border-line bg-bg p-7 md:p-8">
          <h2 className="font-display text-2xl">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A few details are all we need to come back with ideas and pricing.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
}
