/* Shared mock data for the admin screens (demo only, no API). */

export const customers = [
  { name: "Ayesha Khan", email: "ayesha.k@email.com", city: "Lahore", events: 4, spend: "PKR 620,000", status: "Active", joined: "Jan 2025" },
  { name: "Zeeshan Ali", email: "zeeshan@email.com", city: "Karachi", events: 2, spend: "PKR 1,150,000", status: "Active", joined: "Feb 2025" },
  { name: "Hina Raza", email: "hina.raza@email.com", city: "Islamabad", events: 1, spend: "PKR 95,000", status: "Active", joined: "Mar 2025" },
  { name: "Bilal Ahmed", email: "bilal.a@email.com", city: "Multan", events: 3, spend: "PKR 680,000", status: "Active", joined: "Mar 2025" },
  { name: "Mariam Yousuf", email: "mariam.y@email.com", city: "Lahore", events: 0, spend: "PKR 0", status: "Suspended", joined: "Apr 2025" },
  { name: "Usman Tariq", email: "usman.t@email.com", city: "Faisalabad", events: 5, spend: "PKR 940,000", status: "Active", joined: "Apr 2025" },
  { name: "Sana Malik", email: "sana.m@email.com", city: "Karachi", events: 2, spend: "PKR 310,000", status: "Active", joined: "May 2025" },
  { name: "Hamza Sheikh", email: "hamza.s@email.com", city: "Islamabad", events: 1, spend: "PKR 220,000", status: "Pending", joined: "May 2025" },
];

export const vendors = [
  {
    id: "gulmohar-banquet", name: "Gulmohar Banquet", owner: "Imran Butt", category: "Wedding Venues", city: "Lahore",
    rating: 4.9, reviews: 126, bookings: 128, status: "Approved", verified: true, premium: true, featured: true,
    published: true, experience: "12 yrs", hours: "10:00 AM – 11:00 PM",
    ig: "gulmohar.pk", fb: "GulmoharBanquet", web: "gulmohar.pk",
    services: ["Hall rental", "In-house catering", "Stage & lighting", "Valet parking"],
    packages: [
      { name: "Silver", price: "PKR 250,000", detail: "up to 200 guests, basic decor" },
      { name: "Gold", price: "PKR 450,000", detail: "up to 350 guests, premium decor + catering" },
      { name: "Platinum", price: "PKR 750,000", detail: "up to 600 guests, full-service" },
    ],
    gallery: [], attrs: { capacity: 600, setting: "Both", parking: 120, halls: 3 },
  },
  {
    id: "frame-story-films", name: "Frame Story Films", owner: "Fatima Noor", category: "Photography & Video", city: "Karachi",
    rating: 4.8, reviews: 203, bookings: 210, status: "Approved", verified: true, premium: true, featured: true,
    published: true, experience: "8 yrs", hours: "By appointment",
    ig: "framestory", fb: "FrameStoryFilms", web: "framestory.pk",
    services: ["Wedding photography", "Cinematic film", "Drone coverage", "Same-day edit"],
    packages: [
      { name: "Half day", price: "PKR 85,000", detail: "1 photographer, 4 hrs" },
      { name: "Full day", price: "PKR 160,000", detail: "2 shooters + video" },
      { name: "3-event combo", price: "PKR 380,000", detail: "Mehndi, Barat, Walima" },
    ],
    gallery: [], attrs: { shootTypes: ["Wedding", "Pre-wedding"], drone: "Yes", turnaround: 21 },
  },
  {
    id: "saffron-table-co", name: "Saffron Table Co.", owner: "Kashif Raza", category: "Catering & Food", city: "Multan",
    rating: 4.6, reviews: 88, bookings: 74, status: "Pending", verified: false, premium: false, featured: false,
    published: false, experience: "15 yrs", hours: "9:00 AM – 10:00 PM",
    ig: "saffrontable", fb: "SaffronTableCo", web: "saffrontable.pk",
    services: ["Live BBQ", "Desi buffet", "Continental", "Dessert bar"],
    packages: [
      { name: "Standard", price: "PKR 1,200 / head", detail: "3 mains, 2 desserts" },
      { name: "Premium", price: "PKR 2,000 / head", detail: "5 mains, live stations" },
    ],
    gallery: [], attrs: { cuisines: ["Desi", "BBQ", "Continental"], perHead: 1200, liveStations: "Yes" },
  },
  {
    id: "the-grand-marquee", name: "The Grand Marquee", owner: "Salman Iqbal", category: "Wedding Venues", city: "Karachi",
    rating: 4.7, reviews: 74, bookings: 96, status: "Approved", verified: true, premium: false, featured: false,
    published: true, experience: "9 yrs", hours: "11:00 AM – 12:00 AM",
    ig: "grandmarquee", fb: "GrandMarquee", web: "grandmarquee.pk",
    services: ["Marquee setup", "Catering", "Lighting", "Parking"],
    packages: [
      { name: "Garden", price: "PKR 300,000", detail: "up to 250 guests" },
      { name: "Grand", price: "PKR 500,000", detail: "up to 500 guests, full setup" },
    ],
    gallery: [], attrs: { capacity: 500, setting: "Outdoor", parking: 80, halls: 2 },
  },
  {
    id: "the-floral-chapter", name: "The Floral Chapter", owner: "Nida Aslam", category: "Decoration", city: "Islamabad",
    rating: 4.7, reviews: 61, bookings: 61, status: "Pending", verified: false, premium: false, featured: false,
    published: false, experience: "6 yrs", hours: "11:00 AM – 8:00 PM",
    ig: "floralchapter", fb: "TheFloralChapter", web: "floralchapter.pk",
    services: ["Stage decor", "Floral arch", "Table setting", "Lighting"],
    packages: [
      { name: "Nikkah setup", price: "PKR 120,000", detail: "stage + entrance" },
      { name: "Full wedding", price: "PKR 300,000", detail: "all events decor" },
    ],
    gallery: [], attrs: { setups: ["Stage", "Floral arch", "Lighting"], theme: "Modern romance" },
  },
  {
    id: "glam-squad-makeovers", name: "Glam Squad Makeovers", owner: "Hira Yousuf", category: "Beauty & Makeup", city: "Islamabad",
    rating: 4.9, reviews: 167, bookings: 121, status: "Approved", verified: true, premium: true, featured: false,
    published: true, experience: "10 yrs", hours: "8:00 AM – 9:00 PM",
    ig: "glamsquad.pk", fb: "GlamSquad", web: "glamsquad.pk",
    services: ["Bridal makeup", "Party makeup", "Hair styling", "At-home service"],
    packages: [
      { name: "Party glam", price: "PKR 25,000", detail: "makeup + hair" },
      { name: "Bridal", price: "PKR 65,000", detail: "signature bridal + trial" },
    ],
    gallery: [], attrs: { types: ["Bridal", "Party", "Hair styling"], atHome: "Yes" },
  },
  {
    id: "beat-drop-djs", name: "Beat Drop DJs", owner: "Ali Hassan", category: "Music & Entertainment", city: "Karachi",
    rating: 4.5, reviews: 41, bookings: 38, status: "Approved", verified: false, premium: false, featured: false,
    published: true, experience: "5 yrs", hours: "4:00 PM – 2:00 AM",
    ig: "beatdrop.djs", fb: "BeatDropDJs", web: "beatdrop.pk",
    services: ["DJ & sound", "Dhol", "LED dance floor", "MC / host"],
    packages: [
      { name: "Basic", price: "PKR 40,000", detail: "DJ + sound, 4 hrs" },
      { name: "Party", price: "PKR 90,000", detail: "DJ + dhol + LED floor" },
    ],
    gallery: [], attrs: { acts: ["DJ & sound", "Dhol", "LED dance floor"], hours: 6 },
  },
  {
    id: "velvet-table-co", name: "Velvet Table Co.", owner: "Sana Iqbal", category: "Catering & Food", city: "Lahore",
    rating: 4.4, reviews: 12, bookings: 12, status: "Rejected", verified: false, premium: false, featured: false,
    published: false, experience: "3 yrs", hours: "10:00 AM – 9:00 PM",
    ig: "velvettable", fb: "VelvetTableCo", web: "velvettable.pk",
    services: ["Desi buffet", "Dessert bar"],
    packages: [{ name: "Standard", price: "PKR 900 / head", detail: "3 mains, 1 dessert" }],
    gallery: [], attrs: { cuisines: ["Desi", "Dessert"], perHead: 900, liveStations: "No" },
  },
  {
    id: "noor-bridal-couture", name: "Noor Bridal Couture", owner: "Noor Fatima", category: "Bride", city: "Lahore",
    rating: 4.8, reviews: 92, bookings: 64, status: "Approved", verified: true, premium: false, featured: true,
    published: true, experience: "6 yrs", hours: "12:00 PM – 9:00 PM",
    ig: "noor.bridal", fb: "NoorBridalCouture", web: "noorbridal.pk",
    services: ["Bridal wear rental", "Custom stitching", "Alterations"],
    packages: [],
    gallery: [], attrs: {},
  },
  {
    id: "gold-leaf-jewellers", name: "Gold Leaf Jewellers", owner: "Bilal Ahmed", category: "Jewellery", city: "Karachi",
    rating: 4.7, reviews: 58, bookings: 40, status: "Approved", verified: true, premium: true, featured: false,
    published: true, experience: "15 yrs", hours: "11:00 AM – 8:00 PM",
    ig: "goldleaf.jewels", fb: "GoldLeafJewellers", web: "goldleaf.pk",
    services: ["Bridal sets", "Gold jewellery", "Rental sets"],
    packages: [],
    gallery: [], attrs: {},
  },
];

export const listings = [
  // Venues (rent)
  { id: "royal-wedding-hall", vendorId: "gulmohar-banquet", title: "Royal Wedding Hall", categoryId: "venues", subcategoryId: "venues-marriage-halls", types: ["rent"], pricing: { rent: { amount: 350000, unit: "per event", deposit: 50000 } }, city: "Lahore", description: "Grand air-conditioned hall for up to 600 guests with in-house stage.", images: [], attrs: { capacity: 600, setting: "Both", parking: 120 }, status: "Published", featured: true },
  { id: "grand-banquet-evening", vendorId: "gulmohar-banquet", title: "Grand Banquet Evening", categoryId: "venues", subcategoryId: "venues-banquet", types: ["rent"], pricing: { rent: { amount: 500000, unit: "per event", deposit: 80000 } }, city: "Lahore", description: "Premium banquet with catering and decor coordination.", images: [], attrs: { capacity: 450, setting: "Indoor" }, status: "Published", featured: false },
  { id: "garden-marquee-setup", vendorId: "the-grand-marquee", title: "Garden Marquee Setup", categoryId: "venues", subcategoryId: "venues-marquee", types: ["rent"], pricing: { rent: { amount: 500000, unit: "per event", deposit: 80000 } }, city: "Karachi", description: "Outdoor marquee with lighting and seating for 500.", images: [], attrs: { capacity: 500, setting: "Outdoor" }, status: "Published", featured: true },

  // Photography (service + rent)
  { id: "full-day-photo-film", vendorId: "frame-story-films", title: "Full-Day Photo & Film", categoryId: "photography-video", subcategoryId: "photography-video-photographer", types: ["service"], pricing: { service: { amount: 160000, unit: "per event" } }, city: "Karachi", description: "Two shooters plus cinematic video, full-day coverage.", images: [], attrs: { coverage: "10 hrs", teamSize: 4 }, status: "Published", featured: true },
  { id: "photo-booth-rental", vendorId: "frame-story-films", title: "Photo Booth Rental", categoryId: "photography-video", subcategoryId: "photography-video-photo-booth", types: ["rent"], pricing: { rent: { amount: 45000, unit: "per event", deposit: 10000 } }, city: "Karachi", description: "Self-serve photo booth with props and instant prints.", images: [], attrs: {}, status: "Published", featured: false },

  // Catering (service)
  { id: "premium-buffet-300", vendorId: "saffron-table-co", title: "Premium Buffet (300 pax)", categoryId: "catering", subcategoryId: "catering-catering", types: ["service"], pricing: { service: { amount: 420000, unit: "per event" } }, city: "Multan", description: "Desi + continental buffet with waitstaff for 300 guests.", images: [], attrs: { perHead: 1400, minGuests: 200 }, status: "Published", featured: false },
  { id: "live-bbq-station", vendorId: "saffron-table-co", title: "Live BBQ Station", categoryId: "catering", subcategoryId: "catering-bbq", types: ["service"], pricing: { service: { amount: 90000, unit: "per event" } }, city: "Multan", description: "Live grill station with chefs.", images: [], attrs: { perHead: 600 }, status: "Draft", featured: false },
  { id: "continental-fine-dining", vendorId: "velvet-table-co", title: "Continental Fine Dining", categoryId: "catering", subcategoryId: "catering-continental", types: ["service"], pricing: { service: { amount: 380000, unit: "per event" } }, city: "Lahore", description: "Plated continental menu with service staff.", images: [], attrs: { perHead: 1800 }, status: "Published", featured: false },

  // Decoration (service + rent)
  { id: "stage-floral-decor", vendorId: "the-floral-chapter", title: "Stage & Floral Décor", categoryId: "decoration", subcategoryId: "decoration-wedding-stage", types: ["service"], pricing: { service: { amount: 240000, unit: "per event" } }, city: "Islamabad", description: "Full stage design with fresh florals.", images: [], attrs: { teamSize: 8 }, status: "Published", featured: false },
  { id: "fairy-light-package", vendorId: "the-floral-chapter", title: "Fairy Light Package", categoryId: "decoration", subcategoryId: "decoration-lighting", types: ["rent"], pricing: { rent: { amount: 35000, unit: "per event", deposit: 5000 } }, city: "Islamabad", description: "Ambient fairy lighting for venue and entrance.", images: [], attrs: {}, status: "Published", featured: false },

  // Makeup (service)
  { id: "signature-bridal-makeup", vendorId: "glam-squad-makeovers", title: "Signature Bridal Makeup", categoryId: "beauty-makeup", subcategoryId: "beauty-makeup-bridal-makeup", types: ["service"], pricing: { service: { amount: 55000, unit: "per event" } }, city: "Islamabad", description: "HD bridal makeup with hair styling and trial.", images: [], attrs: { teamSize: 2 }, status: "Published", featured: true },
  { id: "mehndi-night-glam", vendorId: "glam-squad-makeovers", title: "Mehndi Night Glam", categoryId: "beauty-makeup", subcategoryId: "beauty-makeup-mehndi", types: ["service"], pricing: { service: { amount: 25000, unit: "per event" } }, city: "Islamabad", description: "Party makeup for mehndi festivities.", images: [], attrs: {}, status: "Published", featured: false },

  // Music (service + rent)
  { id: "live-dj-sound", vendorId: "beat-drop-djs", title: "Live DJ & Sound", categoryId: "music-entertainment", subcategoryId: "music-entertainment-dj", types: ["service"], pricing: { service: { amount: 90000, unit: "per event" } }, city: "Karachi", description: "Professional DJ with lighting and MC.", images: [], attrs: { coverage: "5 hrs" }, status: "Published", featured: false },
  { id: "sound-system-rental", vendorId: "beat-drop-djs", title: "Sound System Rental", categoryId: "music-entertainment", subcategoryId: "music-entertainment-sound-system", types: ["rent"], pricing: { rent: { amount: 30000, unit: "per event", deposit: 8000 } }, city: "Karachi", description: "PA speakers, mics and mixer for the day.", images: [], attrs: {}, status: "Draft", featured: false },

  // Bride (rent + purchase)
  { id: "royal-red-bridal-lehenga", vendorId: "noor-bridal-couture", title: "Royal Red Bridal Lehenga", categoryId: "bride", subcategoryId: "bride-lehenga", types: ["rent", "purchase"], pricing: { rent: { amount: 60000, unit: "per event", deposit: 40000 }, purchase: { amount: 220000 } }, city: "Lahore", description: "Hand-embroidered red bridal lehenga, available to rent or buy.", images: [], attrs: { size: "S-L", color: "Red", fabric: "Velvet" }, status: "Published", featured: true },
  { id: "ivory-walima-maxi", vendorId: "noor-bridal-couture", title: "Ivory Walima Maxi", categoryId: "bride", subcategoryId: "bride-bridal-maxi", types: ["rent", "purchase"], pricing: { rent: { amount: 45000, unit: "per event", deposit: 30000 }, purchase: { amount: 140000 } }, city: "Lahore", description: "Elegant ivory walima maxi with pearl work.", images: [], attrs: { size: "M-XL", color: "Ivory", fabric: "Organza" }, status: "Published", featured: false },

  // Jewellery (rent + purchase, and purchase-only)
  { id: "kundan-bridal-set", vendorId: "gold-leaf-jewellers", title: "Kundan Bridal Set", categoryId: "jewellery", subcategoryId: "jewellery-bridal-sets", types: ["rent", "purchase"], pricing: { rent: { amount: 25000, unit: "per event", deposit: 100000 }, purchase: { amount: 450000 } }, city: "Karachi", description: "Complete kundan bridal set: necklace, earrings, tikka.", images: [], attrs: { material: "Gold-plated" }, status: "Published", featured: false },
  { id: "pearl-necklace", vendorId: "gold-leaf-jewellers", title: "Pearl Necklace", categoryId: "jewellery", subcategoryId: "jewellery-necklace", types: ["purchase"], pricing: { purchase: { amount: 85000 } }, city: "Karachi", description: "Freshwater pearl necklace with matching earrings.", images: [], attrs: { material: "Artificial" }, status: "Published", featured: false },
];

export const categories = [
  { name: "Venues", listings: 214, color: "#4f46e5" },
  { name: "Catering", listings: 168, color: "#0ea5a4" },
  { name: "Photography", listings: 132, color: "#f59e0b" },
  { name: "Decor & Florals", listings: 98, color: "#7c3aed" },
  { name: "Entertainment", listings: 76, color: "#ec4899" },
  { name: "Event Planners", listings: 54, color: "#2f6fed" },
  { name: "Makeup & Salon", listings: 61, color: "#22a06b" },
  { name: "Transport", listings: 33, color: "#d99400" },
];

export const cities = [
  { name: "Lahore", vendors: 486, bookings: 1240, enabled: true },
  { name: "Karachi", vendors: 402, bookings: 980, enabled: true },
  { name: "Islamabad", vendors: 274, bookings: 640, enabled: true },
  { name: "Multan", vendors: 118, bookings: 210, enabled: true },
  { name: "Faisalabad", vendors: 96, bookings: 158, enabled: true },
  { name: "Peshawar", vendors: 41, bookings: 52, enabled: false },
  { name: "Quetta", vendors: 22, bookings: 18, enabled: false },
];

export const banners = [
  { title: "Wedding Season Sale", placement: "Home hero", active: true, gradient: "linear-gradient(135deg,#4f46e5,#7c3aed)" },
  { title: "Featured Photographers", placement: "Discovery top", active: true, gradient: "linear-gradient(135deg,#0ea5a4,#2f6fed)" },
  { title: "Ramadan Catering Deals", placement: "Category: Catering", active: false, gradient: "linear-gradient(135deg,#f59e0b,#ec4899)" },
  { title: "Refer & Earn", placement: "Home mid", active: true, gradient: "linear-gradient(135deg,#7c3aed,#ec4899)" },
];

export const notificationsSent = [
  { title: "New vendors in Lahore", audience: "All customers · Lahore", sent: "2h ago", reach: "8,420", status: "Sent" },
  { title: "Weekend booking reminder", audience: "Customers with drafts", sent: "1d ago", reach: "1,204", status: "Sent" },
  { title: "Eid featured listings", audience: "All users", sent: "3d ago", reach: "24,110", status: "Sent" },
  { title: "Vendor payout processed", audience: "Approved vendors", sent: "Scheduled", reach: "1,284", status: "Scheduled" },
];

export const conversations = [
  { name: "Ayesha Khan", last: "Is the hall available on the 24th?", time: "2m", unread: 2, initials: "AK" },
  { name: "Frame Story Films", last: "Sent over the updated package…", time: "18m", unread: 0, initials: "FS" },
  { name: "Zeeshan Ali", last: "Can we add valet parking?", time: "1h", unread: 1, initials: "ZA" },
  { name: "Saffron Table Co.", last: "Menu confirmed for 300 guests.", time: "3h", unread: 0, initials: "ST" },
  { name: "Hina Raza", last: "Thank you! See you then.", time: "1d", unread: 0, initials: "HR" },
];

export const thread = [
  { me: false, text: "Hi! Is Royal Wedding Hall available on Aug 24?", time: "10:02" },
  { me: true, text: "Hello Ayesha — yes, the 24th evening slot is open.", time: "10:05" },
  { me: false, text: "Great. What's included in the package?", time: "10:06" },
  { me: true, text: "Hall, staging, basic décor, and seating for 400. Catering is separate.", time: "10:08" },
  { me: false, text: "Is the hall available on the 24th?", time: "10:12" },
];

export const statusColor = {
  Confirmed: "success",
  New: "info",
  Completed: "success",
  Published: "success",
  Draft: "default",
  Approved: "success",
  Active: "success",
  Sent: "success",
  Pending: "warning",
  "Quote sent": "info",
  Scheduled: "info",
  Declined: "error",
  Rejected: "error",
  Suspended: "error",
};

export const revenueByMonth = [3.1, 3.8, 3.4, 4.6, 4.3, 5.9, 5.5, 6.8, 6.4, 7.8, 8.9, 10.4];
export const bookingsByCity = [
  { city: "Lahore", value: 1240 },
  { city: "Karachi", value: 980 },
  { city: "Islamabad", value: 640 },
  { city: "Multan", value: 210 },
  { city: "Faisalabad", value: 158 },
];
export const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


export const inquiries = [
  { id: "inq-1001", listingId: "royal-wedding-hall", vendorId: "gulmohar-banquet", type: "rent", customerName: "Ayesha Khan", customerEmail: "ayesha.k@email.com", customerCity: "Lahore", eventDate: "2026-11-20", message: "Need the main hall for ~500 guests, Nov walima.", status: "New", createdAt: "2026-08-18" },
  { id: "inq-1002", listingId: "full-day-photo-film", vendorId: "frame-story-films", type: "service", customerName: "Zeeshan Ali", customerEmail: "zeeshan@email.com", customerCity: "Karachi", eventDate: "2026-10-05", message: "Full-day coverage for barat + walima.", status: "Confirmed", createdAt: "2026-08-15" },
  { id: "inq-1003", listingId: "royal-red-bridal-lehenga", vendorId: "noor-bridal-couture", type: "rent", customerName: "Hina Raza", customerEmail: "hina.raza@email.com", customerCity: "Islamabad", eventDate: "2026-09-30", message: "Would like to rent the red lehenga, size M.", status: "New", createdAt: "2026-08-17" },
  { id: "inq-1004", listingId: "royal-red-bridal-lehenga", vendorId: "noor-bridal-couture", type: "purchase", customerName: "Sana Malik", customerEmail: "sana.m@email.com", customerCity: "Karachi", eventDate: "", quantity: 1, message: "Interested in buying — can you share fabric details?", status: "Confirmed", createdAt: "2026-08-10" },
  { id: "inq-1005", listingId: "premium-buffet-300", vendorId: "saffron-table-co", type: "service", customerName: "Bilal Ahmed", customerEmail: "bilal.a@email.com", customerCity: "Multan", eventDate: "2026-12-01", message: "300 guests, mixed menu. Need a quote.", status: "New", createdAt: "2026-08-16" },
  { id: "inq-1006", listingId: "signature-bridal-makeup", vendorId: "glam-squad-makeovers", type: "service", customerName: "Mariam Yousuf", customerEmail: "mariam.y@email.com", customerCity: "Lahore", eventDate: "2026-10-18", message: "Bridal makeup + hair for nikkah.", status: "Rejected", createdAt: "2026-08-05" },
  { id: "inq-1007", listingId: "garden-marquee-setup", vendorId: "the-grand-marquee", type: "rent", customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerCity: "Faisalabad", eventDate: "2026-11-08", message: "Outdoor marquee for 400, need setup by 4pm.", status: "Confirmed", createdAt: "2026-08-09" },
  { id: "inq-1008", listingId: "live-dj-sound", vendorId: "beat-drop-djs", type: "service", customerName: "Hamza Sheikh", customerEmail: "hamza.s@email.com", customerCity: "Islamabad", eventDate: "2026-09-22", message: "DJ for mehndi night, 5 hours.", status: "New", createdAt: "2026-08-18" },
  { id: "inq-1009", listingId: "kundan-bridal-set", vendorId: "gold-leaf-jewellers", type: "rent", customerName: "Ayesha Khan", customerEmail: "ayesha.k@email.com", customerCity: "Lahore", eventDate: "2026-11-20", message: "Rent the kundan set for walima day.", status: "New", createdAt: "2026-08-14" },
  { id: "inq-1010", listingId: "pearl-necklace", vendorId: "gold-leaf-jewellers", type: "purchase", customerName: "Sana Malik", customerEmail: "sana.m@email.com", customerCity: "Karachi", eventDate: "", quantity: 1, message: "Bought — delivered, thanks!", status: "Completed", createdAt: "2026-07-28" },
  { id: "inq-1011", listingId: "stage-floral-decor", vendorId: "the-floral-chapter", type: "service", customerName: "Bilal Ahmed", customerEmail: "bilal.a@email.com", customerCity: "Multan", eventDate: "2026-12-01", message: "Stage + entrance florals to match buffet booking.", status: "Confirmed", createdAt: "2026-08-11" },
  { id: "inq-1012", listingId: "ivory-walima-maxi", vendorId: "noor-bridal-couture", type: "rent", customerName: "Hina Raza", customerEmail: "hina.raza@email.com", customerCity: "Islamabad", eventDate: "2026-10-02", message: "Rent ivory maxi for walima.", status: "New", createdAt: "2026-08-19" },
  { id: "inq-1013", listingId: "continental-fine-dining", vendorId: "velvet-table-co", type: "service", customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerCity: "Faisalabad", eventDate: "2026-11-08", message: "Plated dinner for 150, done — great service.", status: "Completed", createdAt: "2026-07-30" },
  { id: "inq-1014", listingId: "mehndi-night-glam", vendorId: "glam-squad-makeovers", type: "service", customerName: "Zeeshan Ali", customerEmail: "zeeshan@email.com", customerCity: "Karachi", eventDate: "2026-10-04", message: "Party makeup for 2 for mehndi.", status: "Rejected", createdAt: "2026-08-06" },
];