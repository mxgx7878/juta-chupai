/**
 * schema.js — structured-data (JSON-LD) builders.
 *
 * Every public page renders <JsonLd /> with one or more of these objects, which
 * is what lets Google show rich results: ratings on listings, breadcrumbs in the
 * SERP, the sitelinks search box, FAQ accordions and organisation knowledge
 * panels. Builders are pure functions so they run on the server at render time.
 */

import { site, absoluteUrl } from "@/config/site";
import { VERTICALS } from "@/config/categoryTree";
import { startingPrice } from "@/utils/listing";

const CURRENCY = "PKR";

/* ------------------------------------------------------------ foundations -- */

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: { "@type": "ImageObject", url: absoluteUrl("/logo.svg") },
  description: site.description,
  foundingDate: site.founded,
  areaServed: { "@type": "Country", name: "Pakistan" },
  address: {
    "@type": "PostalAddress",
    streetAddress: site.contact.address.street,
    addressLocality: site.contact.address.city,
    addressRegion: site.contact.address.region,
    postalCode: site.contact.address.postalCode,
    addressCountry: site.contact.address.country,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.contact.phone,
      email: site.contact.email,
      contactType: "customer support",
      areaServed: "PK",
      availableLanguage: ["English", "Urdu"],
    },
  ],
  sameAs: Object.values(site.social),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { "@id": `${site.url}/#organization` },
  inLanguage: site.language,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${site.url}/listings?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

/** `items`: [{ name, path }] — always start with Home. */
export const breadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const webPageSchema = ({ name, description, path, type = "WebPage" }) => ({
  "@context": "https://schema.org",
  "@type": type,
  name,
  description,
  url: absoluteUrl(path),
  isPartOf: { "@id": `${site.url}/#website` },
  inLanguage: site.language,
});

/* ---------------------------------------------------------------- content -- */

export const faqSchema = (faqs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
});

export const reviewsSchema = (testimonials = []) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `Customer reviews of ${site.name}`,
  itemListElement: testimonials.map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Review",
      reviewBody: t.quote,
      datePublished: t.date,
      author: { "@type": "Person", name: t.name },
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5, worstRating: 1 },
      itemReviewed: { "@id": `${site.url}/#organization` },
    },
  })),
});

/* --------------------------------------------------------------- listings -- */

const listingUrl = (listing) => absoluteUrl(`/listings/${listing.id}`);

/** One listing as a Product with an Offer — this is what earns price-rich results. */
export function listingSchema(listing, vendor) {
  const isCatering = listing.vertical === VERTICALS.CATERING;
  const price = startingPrice(listing);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${listingUrl(listing)}#product`,
    name: listing.title,
    description: listing.description,
    category: isCatering ? "Wedding Catering" : "Wedding Venue",
    url: listingUrl(listing),
    brand: { "@type": "Brand", name: vendor?.name || site.name },
    offers: {
      "@type": "Offer",
      url: listingUrl(listing),
      price,
      priceCurrency: CURRENCY,
      availability: "https://schema.org/InStock",
      areaServed: listing.city,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: CURRENCY,
        unitText: isCatering ? "per guest" : "per event",
      },
      seller: { "@type": "Organization", name: vendor?.name || site.name },
    },
  };

  if (vendor?.rating && vendor?.reviews) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: vendor.rating,
      reviewCount: vendor.reviews,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return schema;
}

/** A venue also qualifies as a physical place, which helps local search. */
export function venuePlaceSchema(listing, vendor) {
  if (listing.vertical === VERTICALS.CATERING) return null;
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${listingUrl(listing)}#venue`,
    name: listing.title,
    description: listing.description,
    url: listingUrl(listing),
    maximumAttendeeCapacity: listing.hall?.capacity,
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressCountry: "PK",
    },
    amenityFeature: (listing.hall?.amenities || []).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    ...(vendor?.name ? { parentOrganization: { "@type": "Organization", name: vendor.name } } : {}),
  };
}

/** Search/browse results as an ItemList so crawlers understand the grid. */
export const listingsItemListSchema = (listings = [], name = "Listings") => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  numberOfItems: listings.length,
  itemListElement: listings.map((l, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: listingUrl(l),
    name: l.title,
  })),
});
