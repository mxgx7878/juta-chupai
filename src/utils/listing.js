/* Display helpers shared by the customer-facing listing views. */

import { VERTICALS } from "@/config/categoryTree";
import { pkr } from "./booking";

/** Headline price for a card: hall shows its cheapest slot, catering per head. */
export function priceLabel(listing) {
  if (listing?.vertical === VERTICALS.CATERING) {
    const p = listing.catering?.perHeadFrom;
    return p ? { value: pkr(p), unit: "/head" } : { value: "On request", unit: "" };
  }
  const h = listing?.hall || {};
  const rates = [h.dayRate, h.nightRate].filter(Boolean);
  if (rates.length === 0) return { value: "On request", unit: "" };
  return { value: pkr(Math.min(...rates)), unit: "/event" };
}

/** Short capacity string for a card. */
export function capacityLabel(listing) {
  if (listing?.vertical === VERTICALS.CATERING) {
    const c = listing.catering || {};
    return c.minGuests || c.maxGuests ? `${c.minGuests}–${c.maxGuests} guests` : null;
  }
  const cap = listing?.hall?.capacity;
  return cap ? `Up to ${cap} guests` : null;
}

/** Two or three quick facts under the title. */
export function facts(listing) {
  if (listing?.vertical === VERTICALS.CATERING) {
    const c = listing.catering || {};
    return [c.serviceStyle, (c.cuisines || []).slice(0, 2).join(", "), c.notice ? `${c.notice} notice` : null].filter(Boolean);
  }
  const h = listing?.hall || {};
  return [h.setting, h.parking ? `${h.parking} parking` : null, h.catering].filter(Boolean);
}

/** Lowest per-head or per-event figure, for budget matching. */
export function startingPrice(listing) {
  if (listing?.vertical === VERTICALS.CATERING) return listing.catering?.perHeadFrom || 0;
  const h = listing?.hall || {};
  const rates = [h.dayRate, h.nightRate].filter(Boolean);
  return rates.length ? Math.min(...rates) : 0;
}
