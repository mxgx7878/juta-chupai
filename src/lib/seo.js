/**
 * seo.js — one metadata builder for every public page.
 *
 * Each page calls `buildMetadata()` with its own title/description/path; the
 * canonical URL, Open Graph block, Twitter card and robots directives are
 * derived here so no page has to repeat them. Next.js merges the result with
 * the defaults declared in the root layout.
 */

import { site, absoluteUrl } from "@/config/site";

export function buildMetadata({
  title,
  description = site.description,
  path = "/",
  keywords = [],
  image = "/opengraph-image",
  type = "website",
  noIndex = false,
  publishedTime,
} = {}) {
  const canonical = absoluteUrl(path);
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;

  return {
    title: title || site.tagline,
    description,
    keywords: [...site.keywords, ...keywords],
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
        },
    openGraph: {
      type,
      url: canonical,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: site.twitterHandle,
      creator: site.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
