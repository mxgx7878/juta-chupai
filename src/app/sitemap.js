import { site, absoluteUrl } from "@/config/site";
import { listings } from "@/data/marketplace";

/* Generated at build time from the same data the pages render, so a new listing
   is in the sitemap the moment it is published — nothing to maintain by hand.
   Portal pages (admin, vendor, customer) are excluded: they are private. */
const STATIC_ROUTES = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/listings", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/analytics", changeFrequency: "weekly", priority: 0.7 },
  { path: "/testimonials", changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
];

export default function sitemap() {
  const lastModified = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const listingEntries = listings
    .filter((l) => l.status === "Published")
    .map((l) => ({
      url: absoluteUrl(`/listings/${l.id}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticEntries, ...listingEntries];
}

export const baseUrl = site.url;
