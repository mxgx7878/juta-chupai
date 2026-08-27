/* Bookings — a committed date with money attached.

   A booking is created two ways:
     1. standalone, by the vendor filling in the booking form directly
     2. from an inquiry, which pre-fills the same form and marks the inquiry
        "Converted" with a bookingId back-reference

   Payments are a ledger, not two fixed advance/final fields, so a deposit plus
   two instalments works without changing the model. No gateway — the vendor
   records what has actually been received. */

export const BOOKING_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

/* Only these two hold a date. Pending doesn't block, so two tentative
   enquiries for the same night can both sit in the system. */
export const BLOCKING_STATUSES = ["Confirmed", "Completed"];

export const BOOKING_STATUS_COLORS = {
  Pending: { bg: "#fef3c7", fg: "#b45309", dot: "#f59e0b" },
  Confirmed: { bg: "#dcfce7", fg: "#15803d", dot: "#22a06b" },
  Completed: { bg: "#e0edff", fg: "#1d4ed8", dot: "#2f6fed" },
  Cancelled: { bg: "#fee2e2", fg: "#b91c1c", dot: "#ef4444" },
};

export const nextBookingStatuses = (status) => {
  switch (status) {
    case "Pending": return ["Confirmed", "Cancelled"];
    case "Confirmed": return ["Completed", "Cancelled"];
    case "Completed": return [];
    case "Cancelled": return ["Pending"];
    default: return BOOKING_STATUSES;
  }
};

/* ---- slots ---- */

export const SLOTS = [
  { id: "day", label: "Day" },
  { id: "night", label: "Night" },
];
export const SLOT_LABELS = { day: "Day", night: "Night" };

/* ---- money ---- */

export const pkr = (n) => `PKR ${Number(n || 0).toLocaleString("en-PK")}`;

/** Sum of the payments ledger. */
export const receivedOf = (booking) =>
  (booking?.payments || []).reduce((a, p) => a + (Number(p.amount) || 0), 0);

/** What's still owed. Never negative — an overpayment shows as 0 remaining. */
export const remainingOf = (booking) =>
  Math.max(0, (Number(booking?.totalAmount) || 0) - receivedOf(booking));

/** { total, received, remaining, pct, settled, overpaid } */
export function paymentSummary(booking) {
  const total = Number(booking?.totalAmount) || 0;
  const received = receivedOf(booking);
  const remaining = Math.max(0, total - received);
  return {
    total,
    received,
    remaining,
    pct: total > 0 ? Math.min(100, Math.round((received / total) * 100)) : 0,
    settled: total > 0 && received >= total,
    overpaid: received > total,
  };
}

export const PAYMENT_LABELS = ["Advance", "Instalment", "Final payment", "Other"];
