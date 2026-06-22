/**
 * Renders a JSON-LD structured-data block. Kept as a server component so the
 * markup ships in the initial HTML where crawlers can read it. The payload is
 * our own serialised object, so dangerouslySetInnerHTML is safe here.
 */
export function JsonLd({ data }: Readonly<{ data: Record<string, unknown> }>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
