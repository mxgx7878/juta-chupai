/* Month-grid helpers shared by every calendar view.

   Booking/hold/note "kinds" were removed with the old vendor calendar. Hall
   availability will be derived from bookings (date + slot), not from
   hand-maintained calendar entries. */

const pad = (n) => String(n).padStart(2, "0");
export const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`; // m is 0-based
export const todayISO = () => {
  const d = new Date();
  return toISO(d.getFullYear(), d.getMonth(), d.getDate());
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const monthLabel = (year, month) => `${MONTH_NAMES[month]} ${year}`;

/** 6x7 grid of cells for a month (weeks start Monday). Each cell: {iso, day, inMonth, isToday}. */
export function monthMatrix(year, month) {
  const first = new Date(year, month, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon=0 ... Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const today = todayISO();

  const cells = [];
  for (let i = startDow - 1; i >= 0; i -= 1) {
    const day = daysInPrev - i;
    cells.push({ iso: toISO(year, month - 1 < 0 ? 11 : month - 1, day), day, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = toISO(year, month, d);
    cells.push({ iso, day: d, inMonth: true, isToday: iso === today });
  }
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ iso: toISO(year, month + 1 > 11 ? 0 : month + 1, next), day: next, inMonth: false });
    next += 1;
    if (cells.length >= 42) break;
  }
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
