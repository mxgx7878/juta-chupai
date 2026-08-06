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
    name: "Gulmohar Banquet", owner: "Imran Butt", category: "Venues", city: "Lahore",
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
    name: "Frame Story Films", owner: "Fatima Noor", category: "Photography", city: "Karachi",
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
    name: "Saffron Table Co.", owner: "Kashif Raza", category: "Catering", city: "Multan",
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
    name: "The Grand Marquee", owner: "Salman Iqbal", category: "Venues", city: "Karachi",
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
    name: "The Floral Chapter", owner: "Nida Aslam", category: "Decor", city: "Islamabad",
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
    name: "Glam Squad Makeovers", owner: "Hira Yousuf", category: "Makeup", city: "Islamabad",
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
    name: "Beat Drop DJs", owner: "Ali Hassan", category: "Entertainment", city: "Karachi",
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
    name: "Velvet Table Co.", owner: "Sana Iqbal", category: "Catering", city: "Lahore",
    rating: 4.4, reviews: 12, bookings: 12, status: "Rejected", verified: false, premium: false, featured: false,
    published: false, experience: "3 yrs", hours: "10:00 AM – 9:00 PM",
    ig: "velvettable", fb: "VelvetTableCo", web: "velvettable.pk",
    services: ["Desi buffet", "Dessert bar"],
    packages: [{ name: "Standard", price: "PKR 900 / head", detail: "3 mains, 1 dessert" }],
    gallery: [], attrs: { cuisines: ["Desi", "Dessert"], perHead: 900, liveStations: "No" },
  },
];

export const listings = [
  { title: "Royal Wedding Hall", vendor: "Gulmohar Banquet", category: "Venues", price: "PKR 350,000", city: "Lahore", featured: true },
  { title: "Full-Day Photo & Film", vendor: "Frame Story Films", category: "Photography", price: "PKR 180,000", city: "Karachi", featured: true },
  { title: "Premium Buffet (300 pax)", vendor: "Saffron Table Co.", category: "Catering", price: "PKR 420,000", city: "Multan", featured: false },
  { title: "Stage & Floral Décor", vendor: "The Floral Chapter", category: "Decor", price: "PKR 240,000", city: "Islamabad", featured: false },
  { title: "Garden Marquee Setup", vendor: "The Grand Marquee", category: "Venues", price: "PKR 500,000", city: "Karachi", featured: true },
  { title: "Live DJ & Sound", vendor: "Beat Drop DJs", category: "Entertainment", price: "PKR 90,000", city: "Karachi", featured: false },
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

export const bookings = [
  { id: "JC-2048", event: "Mehndi Night", customer: "Ayesha Khan", vendor: "Gulmohar Banquet", city: "Lahore", date: "Aug 24", amount: "PKR 420,000", status: "Confirmed" },
  { id: "JC-2047", event: "Corporate Gala", customer: "Zeeshan Ali", vendor: "The Grand Marquee", city: "Karachi", date: "Aug 22", amount: "PKR 1,150,000", status: "Pending" },
  { id: "JC-2046", event: "Birthday Soirée", customer: "Hina Raza", vendor: "Frame Story Films", city: "Islamabad", date: "Aug 20", amount: "PKR 95,000", status: "Confirmed" },
  { id: "JC-2045", event: "Nikkah Ceremony", customer: "Bilal Ahmed", vendor: "Saffron Table Co.", city: "Multan", date: "Aug 19", amount: "PKR 680,000", status: "Quote sent" },
  { id: "JC-2044", event: "Engagement", customer: "Mariam Yousuf", vendor: "The Floral Chapter", city: "Lahore", date: "Aug 18", amount: "PKR 240,000", status: "Declined" },
  { id: "JC-2043", event: "Walima Reception", customer: "Usman Tariq", vendor: "Gulmohar Banquet", city: "Faisalabad", date: "Aug 16", amount: "PKR 880,000", status: "Confirmed" },
  { id: "JC-2042", event: "Anniversary Dinner", customer: "Sana Malik", vendor: "Velvet Table Co.", city: "Karachi", date: "Aug 15", amount: "PKR 150,000", status: "Pending" },
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
