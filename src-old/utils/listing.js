/* Helpers for the listing model.
   A listing belongs to a vendor (vendorId), sits in a category + subcategory,
   and supports one or more types (rent / purchase / service). Pricing is stored
   per type so a "both" listing (e.g. a bridal dress you can rent or buy) can
   carry separate rent and purchase prices. */

import { LISTING_TYPES, TYPE_LABELS } from "@/config/categoryTree";

export const LISTING_STATUSES = ["Published", "Draft", "Pending", "Rejected"];

/** "PKR 350,000" */
export const formatPrice = (amount) =>
  amount == null || amount === ""
    ? "—"
    : `PKR ${Number(amount).toLocaleString("en-PK")}`;

/** The type keys a listing actually offers, in a stable display order. */
export const listingTypes = (listing) => {
  const order = [LISTING_TYPES.RENT, LISTING_TYPES.PURCHASE, LISTING_TYPES.SERVICE];
  return order.filter((t) => (listing?.types || []).includes(t));
};

/** [{ type, label }] for rendering type chips. */
export const typeChips = (listing) =>
  listingTypes(listing).map((t) => ({ type: t, label: TYPE_LABELS[t] || t }));

/** Lowest price across the listing's types (number) or null. */
export const startingPrice = (listing) => {
  const amounts = listingTypes(listing)
    .map((t) => listing?.pricing?.[t]?.amount)
    .filter((n) => typeof n === "number");
  return amounts.length ? Math.min(...amounts) : null;
};

/** "From PKR 60,000" (multi-type) or "PKR 350,000" (single) or "—". */
export const priceLabel = (listing) => {
  const amount = startingPrice(listing);
  if (amount == null) return "—";
  const multi = listingTypes(listing).length > 1;
  return `${multi ? "From " : ""}${formatPrice(amount)}`;
};

/** Human price line for one type, e.g. "PKR 60,000 / per event". */
export const typePriceLabel = (listing, type) => {
  const p = listing?.pricing?.[type];
  if (!p || p.amount == null) return "—";
  return p.unit ? `${formatPrice(p.amount)} / ${p.unit}` : formatPrice(p.amount);
};