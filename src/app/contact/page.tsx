import { ContactForm } from './contact-form';

export default function ContactPage() {
  return (
    <div className="mc-container py-12">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-1 text-xs font-semibold text-neutral-700">
          Contact & Consultations
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="mc-text-gradient">Let’s plan something memorable</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
          Reach out to The Moon Charm for custom gifting, curated surprise arrangements, and event-ready packages.
          Our team responds quickly with pricing, timelines, and recommendations tailored to your occasion.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="mc-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Contact details</h2>
            <span className="mc-pill">Response in 24 hours</span>
          </div>

          <div className="mt-5 grid gap-4 text-sm text-neutral-700 md:text-base">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-neutral-900">Call / WhatsApp</span>
              <a className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4" href="tel:+94781769568">
                +94 78 176 95 68
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-neutral-900">Email</span>
              <a
                className="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4"
                href="mailto:info.themooncharm@gmail.com"
              >
                info.themooncharm@gmail.com
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-neutral-900">Location</span>
              <span className="text-neutral-700">Kuliyapitiya, Sri Lanka</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-neutral-900">Business hours</span>
              <span className="text-neutral-700">Mon - Sat, 9:00 AM - 7:00 PM</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/70 bg-white/60 px-4 py-4 text-xs text-neutral-700">
            <div className="font-semibold text-neutral-900">Preferred order lead time</div>
            <p className="mt-1">
              Please share your event date and budget. We recommend placing custom orders at least 3 days ahead for
              design, sourcing, and packaging.
            </p>
          </div>
        </section>

        <section className="mc-card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Request a quote</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Share a few details and we will send a tailored proposal with pricing and delivery timelines.
          </p>
          <ContactForm />
        </section>
      </div>

      <section className="mt-12">
        <div className="mc-card border border-fuchsia-200/70 bg-gradient-to-br from-white via-white to-fuchsia-50/80 p-6 shadow-xl shadow-fuchsia-200/40">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200/70 bg-white/90 px-4 py-1 text-xs font-semibold text-fuchsia-700">
            Why Choose Us
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            The Moon Charm promise
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-700">
            Premium gifting, reliable delivery, and thoughtful details that feel personal.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Made-to-order details',
                copy: 'Every package is curated by hand with premium wrapping, handwritten notes, and custom add-ons.',
                highlight: false,
              },
              {
                title: 'Worldwide delivery',
                copy: 'We coordinate local and international shipping with careful handling and delivery confirmations.',
                highlight: true,
              },
              {
                title: 'Dedicated support',
                copy: 'One point of contact for approvals, design updates, and post-delivery follow-ups.',
                highlight: false,
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border bg-white/90 p-5 text-sm text-neutral-700 shadow-sm ${
                  item.highlight
                    ? 'border-fuchsia-300/90 bg-gradient-to-br from-white via-white to-fuchsia-50 shadow-xl shadow-fuchsia-200/60 ring-2 ring-fuchsia-200/80'
                    : 'border-white/70'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-base font-semibold text-neutral-900">{item.title}</div>
                  {item.highlight ? (
                    <span className="mc-pill border-fuchsia-200/80 bg-fuchsia-100 text-fuchsia-700">
                      Top priority
                    </span>
                  ) : null}
                </div>
                <p className="mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
