/**
 * publicSite.js — every piece of editorial content the public website renders.
 *
 * Copy, stats, testimonials and FAQs live here (not inside components) so the
 * marketing team can change wording without touching JSX, and so the same
 * numbers feed the home page, the analytics page and the JSON-LD at once.
 *
 * Two kinds of numbers appear below:
 *   - `portalStats` / `growth` : portal-wide published figures (whole business)
 *   - anything read from the store : the seeded demo records
 */

/* ------------------------------------------------------------ portal size -- */
export const portalStats = {
  vendors: 1284,
  verifiedVendors: 1206,
  eventsDelivered: 9640,
  eventsThisYear: 3120,
  cities: 12,
  couplesServed: 8450,
  averageRating: 4.8,
  reviewCount: 6210,
  grossBookingValue: 1.42e9, // PKR, lifetime
  averageResponseMinutes: 42,
  repeatCustomerRate: 34,
  onTimeDeliveryRate: 98.2,
  disputeRate: 0.4,
};

/** Headline tiles shared by the home page and the analytics page. */
export const headlineStats = [
  { id: "vendors", label: "Verified vendors", value: portalStats.vendors, suffix: "+", icon: "storefront", note: `${portalStats.verifiedVendors} identity-verified` },
  { id: "events", label: "Events delivered", value: portalStats.eventsDelivered, suffix: "+", icon: "event", note: `${portalStats.eventsThisYear.toLocaleString("en-PK")} this year` },
  { id: "cities", label: "Cities covered", value: portalStats.cities, suffix: "", icon: "place", note: "Across all four provinces" },
  { id: "rating", label: "Average rating", value: portalStats.averageRating, suffix: "/5", icon: "star", decimals: 1, note: `${portalStats.reviewCount.toLocaleString("en-PK")} verified reviews` },
];

/* ----------------------------------------------------------------- growth -- */
export const growth = {
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  bookings: [186, 204, 241, 268, 252, 310, 336, 398, 421, 486, 524, 612],
  vendorsJoined: [22, 28, 31, 40, 36, 48, 55, 61, 70, 84, 96, 112],
  /* PKR, in millions */
  bookingValue: [31, 38, 34, 46, 43, 59, 55, 68, 64, 78, 89, 104],
};

export const categoryMix = [
  { label: "Venues & halls", value: 34 },
  { label: "Catering", value: 26 },
  { label: "Photography", value: 16 },
  { label: "Decor & florals", value: 14 },
  { label: "Entertainment", value: 10 },
];

export const satisfaction = [
  { label: "Vendor replied within an hour", value: 92 },
  { label: "Event delivered as booked", value: 98 },
  { label: "Would book again", value: 89 },
  { label: "Recommended us to family", value: 94 },
];

export const milestones = [
  { year: "2019", title: "The first hall goes live", detail: "Joota Chupai starts in Lahore with 14 banquet halls and a single shared calendar." },
  { year: "2021", title: "Catering joins the portal", detail: "Per-head menus and deals arrive, so a full event can be planned in one place." },
  { year: "2023", title: "Verification programme", detail: "On-site checks, ownership documents and payment history become a badge customers can trust." },
  { year: "2025", title: "Four-click booking", detail: "Live availability plus instant confirmation cuts booking from six phone calls to under a minute." },
];

/* ------------------------------------------------------------ how it works -- */
export const bookingSteps = [
  { step: 1, title: "Browse listings", detail: "Filter by city, guest count and budget. Every listing shows real pricing, not 'call for rates'.", icon: "search" },
  { step: 2, title: "Open the one you like", detail: "Photos, amenities, menus and a live availability calendar — no back-and-forth needed.", icon: "listing" },
  { step: 3, title: "Pick your date", detail: "Tap a free day or night slot. Booked slots are greyed out, so you never ask for a date that's gone.", icon: "calendar" },
  { step: 4, title: "Confirm", detail: "Name, phone, guest count — confirm and the vendor is notified instantly with your reference.", icon: "check" },
];

export const valueProps = [
  { title: "Verified vendors only", detail: "Ownership papers, on-site visits and a payment history check before any hall or caterer is published.", icon: "verified" },
  { title: "Live availability", detail: "Calendars are driven by real confirmed bookings, so a free slot is genuinely free.", icon: "calendar" },
  { title: "Transparent pricing", detail: "Day and night rates, per-head menus and advance policies are published up front.", icon: "price" },
  { title: "No booking fee", detail: "You pay the vendor directly at their listed rate. We never mark prices up for customers.", icon: "wallet" },
  { title: "One trail for everything", detail: "Inquiries, bookings, payments and notes stay in one place for you and the vendor.", icon: "timeline" },
  { title: "Support that answers", detail: `Real humans on ${"chat and phone"} within ${portalStats.averageResponseMinutes} minutes on average.`, icon: "support" },
];

export const vendorBenefits = [
  { title: "A calendar that prevents double bookings", detail: "Confirmed dates block themselves across every channel you sell through." },
  { title: "Qualified inquiries", detail: "Guest count, date and budget arrive with the request, so you quote once." },
  { title: "Payments ledger", detail: "Record advances and instalments against each booking and always know what's outstanding." },
  { title: "Free to list", detail: "No monthly fee. A flat service charge applies only on completed bookings." },
];

/* ----------------------------------------------------------- testimonials -- */
export const testimonials = [
  { id: "t1", name: "Ayesha Khan", role: "Walima, 500 guests", city: "Lahore", rating: 5, date: "2026-07-14",
    quote: "We had a hall confirmed before my brother finished his tea. The availability calendar meant no calling ten places to hear 'that date is gone'." },
  { id: "t2", name: "Usman Tariq", role: "Barat, 400 guests", city: "Faisalabad", rating: 5, date: "2026-06-02",
    quote: "Pricing was exactly what the listing said. Nothing appeared on the final bill that we hadn't already seen on the page." },
  { id: "t3", name: "Hina Raza", role: "Corporate dinner, 90 guests", city: "Islamabad", rating: 4.5, date: "2026-05-18",
    quote: "I booked plated catering for a company dinner in four clicks on my phone during a meeting. The caterer called within the hour to confirm the menu." },
  { id: "t4", name: "Bilal Ahmed", role: "Mehndi, 350 guests", city: "Multan", rating: 5, date: "2026-04-27",
    quote: "The advance policy was written on the listing, so there was no awkward conversation later. That alone is worth using the portal." },
  { id: "t5", name: "Sadia Malik", role: "Nikkah, 220 guests", city: "Karachi", rating: 5, date: "2026-03-09",
    quote: "Two halls, two dates, one afternoon. My mother still thinks I spent weeks on it." },
  { id: "t6", name: "Kamran Sheikh", role: "Barat, 400 guests", city: "Multan", rating: 4.5, date: "2026-02-21",
    quote: "Support answered on a Sunday when our guest count jumped by eighty. The caterer was updated before we got off the call." },
];

/* Vendor voices — used on the About page. */
export const vendorVoices = [
  { id: "v1", name: "Imran Butt", role: "Owner, Gulmohar Banquet", city: "Lahore", rating: 5, date: "2026-06-11",
    quote: "Three halls on one calendar. We stopped double-booking the night slot the week we joined." },
  { id: "v2", name: "Kashif Raza", role: "Owner, Saffron Table Co.", city: "Multan", rating: 5, date: "2026-05-04",
    quote: "Inquiries arrive with the guest count and the date already filled in. I quote once instead of five times." },
];

/* -------------------------------------------------------------------- faq -- */
export const faqs = [
  { question: "Does it cost anything to book through Joota Chupai?",
    answer: "No. Customers pay the vendor directly at the rate shown on the listing. We charge the vendor a flat service fee on completed bookings, and never mark up a customer's price." },
  { question: "How do I know the date I picked is actually free?",
    answer: "Availability is derived from confirmed bookings rather than a hand-maintained calendar. When a vendor confirms a date, that day and slot immediately stop being selectable everywhere on the portal." },
  { question: "How long does booking take?",
    answer: "Four clicks: open a listing, choose a slot, add your details and confirm. The vendor is notified instantly and receives your guest count, event type and contact number with the request." },
  { question: "What happens after I confirm a booking?",
    answer: "You get a booking reference on screen and by email. The vendor reviews and confirms, usually within an hour, then the advance is paid directly to the vendor under the advance policy published on the listing." },
  { question: "Are the vendors checked?",
    answer: "Yes. Before a hall or caterer is published we verify ownership documents, visit the premises where applicable and review the vendor's past booking and payment history. Verified vendors carry a badge on the listing." },
  { question: "Can I cancel or move a booking?",
    answer: "Cancellation and refund terms are set by each vendor and printed on the listing before you confirm. Our support team can mediate if something is unclear or a vendor is unresponsive." },
  { question: "Which cities do you cover?",
    answer: `We currently operate in ${portalStats.cities} cities including Lahore, Karachi, Islamabad, Multan and Faisalabad, and add new cities as vendor coverage reaches a usable density.` },
  { question: "How do I list my venue or catering business?",
    answer: "Use the vendor portal to apply. Listing is free — you add your halls or menus, set your rates and go live once the verification check clears." },
];

/* --------------------------------------------------------------- coverage -- */
export const coverage = [
  { city: "Lahore", vendors: 486, events: 3240, live: true },
  { city: "Karachi", vendors: 402, events: 2680, live: true },
  { city: "Islamabad", vendors: 274, events: 1640, live: true },
  { city: "Rawalpindi", vendors: 168, events: 910, live: true },
  { city: "Multan", vendors: 118, events: 610, live: true },
  { city: "Faisalabad", vendors: 96, events: 458, live: true },
  { city: "Peshawar", vendors: 41, events: 152, live: false },
  { city: "Quetta", vendors: 22, events: 68, live: false },
];
