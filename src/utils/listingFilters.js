/* Listing search, filtering and sorting.

   Shared by the public explorer (/listings) and the signed-in customer browse
   screen so the two never disagree about what "matches" means. Pure functions —
   no React, no store. */

import { VERTICALS } from "@/config/categoryTree";
import { startingPrice } from "./listing";

export const LISTING_TYPES = [
  { id: "all", label: "Everything" },
  { id: VERTICALS.HALL, label: "Venues & halls" },
  { id: VERTICALS.CATERING, label: "Catering" },
];

export const LISTING_SORTS = [
  { id: "featured", label: "Featured first" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "capacity", label: "Largest capacity" },
];

export const EMPTY_FILTERS = { type: "all", city: "all", q: "", guests: "", maxPrice: 0, sort: "featured" };

/** Guest range a listing can actually serve. */
export const guestRange = (listing) =>
  listing.vertical === VERTICALS.CATERING
    ? { min: listing.catering?.minGuests, max: listing.catering?.maxGuests }
    : { min: listing.hall?.minGuests, max: listing.hall?.capacity };

export const onlyPublished = (listings = []) => listings.filter((l) => l.status === "Published");

/** Highest hall rate, rounded up — drives the price slider's ceiling. */
export function priceCeiling(listings = []) {
  const rates = listings.filter((l) => l.vertical === VERTICALS.HALL).map(startingPrice);
  const top = rates.length ? Math.max(...rates) : 0;
  return Math.ceil(top / 50000) * 50000 || 500000;
}

export function filterListings(listings = [], filters = {}) {
  const f = { ...EMPTY_FILTERS, ...filters };
  const term = f.q.trim().toLowerCase();
  const guests = Number(f.guests) || 0;

  return listings.filter((l) => {
    if (f.type !== "all" && l.vertical !== f.type) return false;
    if (f.city !== "all" && l.city !== f.city) return false;
    if (term && !`${l.title} ${l.description} ${l.city}`.toLowerCase().includes(term)) return false;

    if (guests) {
      const { min, max } = guestRange(l);
      if (max && guests > max) return false;
      if (min && guests < min) return false;
    }

    /* The price filter is per-event, so it only applies to halls. */
    if (f.maxPrice > 0 && l.vertical === VERTICALS.HALL && startingPrice(l) > f.maxPrice) return false;
    return true;
  });
}

export function sortListings(listings = [], sort = "featured") {
  const capacityOf = (l) => guestRange(l).max || 0;

  return [...listings].sort((a, b) => {
    if (sort === "price-asc") return startingPrice(a) - startingPrice(b);
    if (sort === "price-desc") return startingPrice(b) - startingPrice(a);
    if (sort === "capacity") return capacityOf(b) - capacityOf(a);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });
}

/** One call for the common case: published -> filtered -> sorted. */
export const queryListings = (listings, filters) =>
  sortListings(filterListings(onlyPublished(listings), filters), filters.sort);

export const activeFilterCount = (filters = {}) => {
  const f = { ...EMPTY_FILTERS, ...filters };
  return [f.type !== "all", f.city !== "all", Boolean(f.q), Boolean(f.guests), f.maxPrice > 0].filter(Boolean).length;
};
