/* Helpers for inquiries — a user's request against a listing, which the vendor
   (or admin) moves through a status flow. Renamed from the old "requests"/
   "bookings" idea; an inquiry spans rent, purchase and service listings. */

export const INQUIRY_STATUSES = ["New", "Confirmed", "Rejected", "Completed"];

/** Status transitions offered from a given status (for action menus). */
export const nextStatuses = (status) => {
  switch (status) {
    case "New":
      return ["Confirmed", "Rejected"];
    case "Confirmed":
      return ["Completed", "Rejected"];
    case "Rejected":
      return ["New"];
    case "Completed":
      return [];
    default:
      return INQUIRY_STATUSES;
  }
};

/** "20 Nov 2026" or "—". */
export const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};