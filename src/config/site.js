/**
 * site.js — brand facts used by SEO, JSON-LD, the header, the footer and the
 * contact page. Anything that would otherwise be typed twice lives here.
 */

export const site = {
  name: "Joota Chupai",
  legalName: "Joota Chupai (Pvt) Ltd",
  tagline: "Book your wedding venue in four clicks",
  description:
    "Joota Chupai is Pakistan's event marketplace for wedding halls, marquees and caterers. Compare verified vendors, check live availability and confirm your date in under a minute.",
  shortDescription:
    "Compare verified wedding venues and caterers across Pakistan, then book your date in four clicks.",
  /* Set NEXT_PUBLIC_SITE_URL in production so canonicals and JSON-LD are absolute. */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.jootachupai.pk",
  locale: "en_PK",
  language: "en",
  keywords: [
    "wedding venues Pakistan",
    "banquet hall booking",
    "marquee booking Lahore",
    "wedding caterers Karachi",
    "event marketplace Pakistan",
    "book wedding hall online",
    "shadi hall booking",
  ],
  founded: "2019",
  contact: {
    email: "hello@jootachupai.pk",
    support: "support@jootachupai.pk",
    phone: "+92-42-111-582-472",
    hours: "Monday to Saturday, 9:00 AM – 9:00 PM (PKT)",
    address: {
      street: "3rd Floor, Arfa Software Technology Park, Ferozepur Road",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54600",
      country: "PK",
      countryName: "Pakistan",
    },
  },
  social: {
    facebook: "https://facebook.com/jootachupai",
    instagram: "https://instagram.com/jootachupai",
    linkedin: "https://linkedin.com/company/jootachupai",
    youtube: "https://youtube.com/@jootachupai",
  },
  twitterHandle: "@jootachupai",
};

/** Absolute URL for canonicals, OG tags and JSON-LD `@id`s. */
export const absoluteUrl = (path = "/") =>
  `${site.url}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || site.url;
