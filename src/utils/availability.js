/* Hall availability.

   Derived from bookings rather than stored separately, so a vendor can never
   confirm a booking and still show the date as free. Availability is keyed on
   date + slot: the 14th can be booked for night and open for day.

   Only Confirmed and Completed bookings block. Pending and Cancelled don't. */

import { BLOCKING_STATUSES } from "./booking";

/** Bookings that actually hold a date, for one listing. */
export const blockingFor = (bookings, listingId) =>
  bookings.filter((b) => b.listingId === listingId && BLOCKING_STATUSES.includes(b.status));

/**
 * Map of taken slots for one listing: { "2026-11-20": { day: booking, night: booking } }
 */
export function availabilityMap(bookings, listingId) {
  const map = {};
  blockingFor(bookings, listingId).forEach((b) => {
    if (!b.eventDate) return;
    map[b.eventDate] = map[b.eventDate] || {};
    map[b.eventDate][b.slot || "day"] = b;
  });
  return map;
}

/** Is this listing free on this date+slot? Optionally ignore one booking (when editing it). */
export function isSlotFree(bookings, listingId, date, slot, ignoreBookingId = null) {
  if (!date || !slot) return true;
  return !bookings.some(
    (b) =>
      b.listingId === listingId &&
      b.eventDate === date &&
      (b.slot || "day") === slot &&
      b.id !== ignoreBookingId &&
      BLOCKING_STATUSES.includes(b.status),
  );
}

/** "free" | "partial" | "full" for a whole date. */
export function dayState(map, iso) {
  const t = map[iso];
  if (!t) return "free";
  const n = (t.day ? 1 : 0) + (t.night ? 1 : 0);
  return n >= 2 ? "full" : "partial";
}

/** All blocking bookings on a date across many listings, sorted by slot. */
export function bookingsOnDate(bookings, iso, listingIds = null) {
  return bookings
    .filter(
      (b) =>
        b.eventDate === iso &&
        BLOCKING_STATUSES.includes(b.status) &&
        (!listingIds || listingIds.includes(b.listingId)),
    )
    .sort((a, b) => (a.slot === "day" ? -1 : 1) - (b.slot === "day" ? -1 : 1));
}

export const DAY_STATE_COLORS = {
  free: { bg: "transparent", fg: "#64748b" },
  partial: { bg: "#fef3c7", fg: "#b45309" },
  full: { bg: "#fee2e2", fg: "#b91c1c" },
};
