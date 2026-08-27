/* Small shared date helpers. Replaces the deleted utils/inquiry.js. */

/** "20 Nov 2026" or "--". */
export const formatDate = (iso) => {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};
