type ImageLoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

// Custom Next.js image loader.
//
// By default Next routes remote images through its server-side optimizer
// (/_next/image), which fetches and re-encodes the image on the server. On a
// slow or restrictive connection that server-side fetch times out, so images
// never appear even when the browser itself can reach the CDN fine.
//
// This loader skips the optimizer entirely. It hands the browser a direct CDN
// URL, and for Unsplash it appends sizing params so the CDN returns a small,
// already-resized image (driven by the <Image sizes> props) instead of the
// multi-megabyte original. Non-Unsplash or local sources are returned as-is.
export default function imageLoader({ src, width, quality }: ImageLoaderArgs): string {
  try {
    const url = new URL(src);
    if (url.hostname.endsWith('unsplash.com')) {
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', String(quality ?? 60));
      return url.toString();
    }
    return src;
  } catch {
    // Relative path (e.g. a local /public asset) — serve unchanged.
    return src;
  }
}
