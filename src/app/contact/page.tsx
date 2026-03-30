export default function ContactPage() {
  return (
    <div className="mc-container max-w-3xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        <span className="mc-text-gradient">Contact Us</span>
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
        Let’s create something beautiful for your special moments. Reach out to The Moon Charm for custom
        orders, surprises, and event planning.
      </p>

      <div className="mt-8 grid gap-6">
        <section className="mc-card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Contact Details</h2>
          <div className="mt-4 grid gap-3 text-sm text-neutral-700 md:text-base">
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
          </div>
        </section>

        <section className="mc-card p-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900">Why Choose Us</h2>
          <ul className="mt-4 grid gap-2 text-sm text-neutral-700 md:text-base">
            <li>Fully customized designs</li>
            <li>High-quality packaging</li>
            <li>Worldwide delivery</li>
            <li>On-time surprise arrangements</li>
            <li>Friendly customer support</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
