/* Seed data for the hall vertical (demo only, no API).

   Hall listings belong to venue vendors from screens.js. One listing = one
   physical hall, so a venue with three halls has three listings. */

export const listings = [
  /* Gulmohar Banquet — the default vendor login, so it gets three halls */
  {
    id: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", vertical: "hall",
    title: "Royal Hall", categoryId: "venues", subcategoryId: "venues-marriage-halls",
    city: "Lahore", status: "Published", featured: true,
    description: "Grand air-conditioned hall with in-house stage and bridal room.",
    hall: {
      capacity: 600, minGuests: 250, setting: "Indoor",
      dayRate: 280000, nightRate: 350000,
      parking: 120, advancePolicy: "40% to confirm the date",
      amenities: ["Air conditioning", "In-house stage", "Bridal room", "Valet parking", "Generator backup"],
      catering: "In-house only",
    },
    images: [],
  },
  {
    id: "gulmohar-emerald-hall", vendorId: "gulmohar-banquet", vertical: "hall",
    title: "Emerald Hall", categoryId: "venues", subcategoryId: "venues-banquet",
    city: "Lahore", status: "Published", featured: false,
    description: "Mid-size banquet hall, good for nikkah and mehndi events.",
    hall: {
      capacity: 300, minGuests: 120, setting: "Indoor",
      dayRate: 150000, nightRate: 200000,
      parking: 60, advancePolicy: "30% to confirm the date",
      amenities: ["Air conditioning", "Stage", "Sound system"],
      catering: "In-house or outside",
    },
    images: [],
  },
  {
    id: "gulmohar-garden-lawn", vendorId: "gulmohar-banquet", vertical: "hall",
    title: "Garden Lawn", categoryId: "venues", subcategoryId: "venues-outdoor-venue",
    city: "Lahore", status: "Draft", featured: false,
    description: "Open-air lawn with string lighting. Seasonal — winter only.",
    hall: {
      capacity: 450, minGuests: 200, setting: "Outdoor",
      dayRate: 180000, nightRate: 260000,
      parking: 90, advancePolicy: "40% to confirm the date",
      amenities: ["String lighting", "Open lawn", "Generator backup"],
      catering: "In-house or outside",
    },
    images: [],
  },

  /* The Grand Marquee */
  {
    id: "grand-marquee-main", vendorId: "the-grand-marquee", vertical: "hall",
    title: "Grand Marquee", categoryId: "venues", subcategoryId: "venues-marquee",
    city: "Karachi", status: "Published", featured: true,
    description: "Large outdoor marquee with full lighting and seating for 500.",
    hall: {
      capacity: 500, minGuests: 200, setting: "Outdoor",
      dayRate: 320000, nightRate: 420000,
      parking: 80, advancePolicy: "50% to confirm the date",
      amenities: ["Marquee setup", "Lighting", "Seating", "Parking"],
      catering: "Outside allowed",
    },
    images: [],
  },
  {
    id: "grand-marquee-garden", vendorId: "the-grand-marquee", vertical: "hall",
    title: "Garden Side", categoryId: "venues", subcategoryId: "venues-outdoor-venue",
    city: "Karachi", status: "Published", featured: false,
    description: "Smaller garden setting for intimate events up to 250.",
    hall: {
      capacity: 250, minGuests: 80, setting: "Outdoor",
      dayRate: 160000, nightRate: 220000,
      parking: 40, advancePolicy: "40% to confirm the date",
      amenities: ["Garden setting", "Lighting"],
      catering: "Outside allowed",
    },
    images: [],
  },

  /* ---- CATERING VERTICAL ---- */
  /* Saffron Table Co. */
  {
    id: "saffron-signature-buffet", vendorId: "saffron-table-co", vertical: "catering",
    title: "Signature Desi Buffet", categoryId: "catering", subcategoryId: "catering-catering",
    city: "Multan", status: "Published", featured: true,
    description: "Full desi buffet with waitstaff, crockery and live serving.",
    catering: {
      minGuests: 150, maxGuests: 800,
      serviceStyle: "Buffet",
      cuisines: ["Pakistani", "Mughlai", "BBQ"],
      perHeadFrom: 1400,
      staffing: "1 waiter per 25 guests",
      travelsTo: "Multan, Lahore, Bahawalpur",
      notice: "10 days",
      deals: [
        { id: "deal-s1", name: "Standard", perHead: 1400, minGuests: 150,
          includes: ["3 mains", "2 breads", "1 dessert", "Soft drinks", "Waitstaff"] },
        { id: "deal-s2", name: "Premium", perHead: 2000, minGuests: 200,
          includes: ["5 mains", "Live BBQ station", "3 desserts", "Welcome drinks", "Crockery & waitstaff"] },
        { id: "deal-s3", name: "Royal", perHead: 2800, minGuests: 300,
          includes: ["7 mains", "2 live stations", "Dessert bar", "Mocktail counter", "Full service"] },
      ],
      menus: [
        { id: "menu-s1", name: "Desi Classic", perHead: 1400, sections: [
          { name: "Starters", items: ["Chicken Boti", "Seekh Kebab", "Fresh Salad"] },
          { name: "Mains", items: ["Chicken Karahi", "Mutton Qorma", "Daal Makhani"] },
          { name: "Breads & Rice", items: ["Naan", "Chicken Biryani"] },
          { name: "Dessert", items: ["Kheer"] },
        ] },
        { name: "Mughlai Feast", id: "menu-s2", perHead: 2000, sections: [
          { name: "Starters", items: ["Malai Boti", "Fish Tikka", "Chaat Counter"] },
          { name: "Mains", items: ["Mutton Nihari", "Chicken Handi", "Aloo Gosht", "Palak Paneer"] },
          { name: "Breads & Rice", items: ["Roghni Naan", "Kabuli Pulao", "Mutton Biryani"] },
          { name: "Dessert", items: ["Gulab Jamun", "Shahi Tukray", "Ice Cream"] },
        ] },
      ],
    },
    images: [],
  },
  {
    id: "saffron-live-bbq", vendorId: "saffron-table-co", vertical: "catering",
    title: "Live BBQ Station", categoryId: "catering", subcategoryId: "catering-bbq",
    city: "Multan", status: "Published", featured: false,
    description: "Add-on live grill with chefs cooking in front of guests.",
    catering: {
      minGuests: 80, maxGuests: 500,
      serviceStyle: "Live stations",
      cuisines: ["BBQ"],
      perHeadFrom: 600,
      staffing: "2 grill chefs",
      travelsTo: "Multan and nearby",
      notice: "5 days",
      deals: [
        { id: "deal-b1", name: "BBQ Add-on", perHead: 600, minGuests: 80,
          includes: ["4 BBQ items", "Chutneys", "2 grill chefs"] },
        { id: "deal-b2", name: "BBQ Deluxe", perHead: 950, minGuests: 120,
          includes: ["7 BBQ items", "Grilled prawns", "Naan counter", "3 chefs"] },
      ],
      menus: [
        { id: "menu-b1", name: "Grill Selection", perHead: 600, sections: [
          { name: "From the grill", items: ["Chicken Tikka", "Seekh Kebab", "Malai Boti", "Chicken Wings"] },
          { name: "Sides", items: ["Mint Chutney", "Imli Sauce", "Salad"] },
        ] },
      ],
    },
    images: [],
  },

  /* Velvet Table Co. */
  {
    id: "velvet-continental-plated", vendorId: "velvet-table-co", vertical: "catering",
    title: "Continental Plated Dinner", categoryId: "catering", subcategoryId: "catering-continental",
    city: "Lahore", status: "Published", featured: true,
    description: "Three-course plated continental service with trained staff.",
    catering: {
      minGuests: 60, maxGuests: 300,
      serviceStyle: "Plated",
      cuisines: ["Continental", "Italian"],
      perHeadFrom: 1800,
      staffing: "1 server per 12 guests",
      travelsTo: "Lahore, Islamabad",
      notice: "14 days",
      deals: [
        { id: "deal-v1", name: "Three course", perHead: 1800, minGuests: 60,
          includes: ["Soup or salad", "Main course", "Dessert", "Plated service"] },
        { id: "deal-v2", name: "Five course", perHead: 2600, minGuests: 80,
          includes: ["Amuse-bouche", "Soup", "Salad", "Main course", "Dessert", "Full plated service"] },
      ],
      menus: [
        { id: "menu-v1", name: "Continental Set", perHead: 1800, sections: [
          { name: "Starter", items: ["Cream of Mushroom", "Caesar Salad"] },
          { name: "Main", items: ["Grilled Chicken Supreme", "Herb Salmon", "Mushroom Risotto"] },
          { name: "Dessert", items: ["Chocolate Lava Cake", "Tiramisu"] },
        ] },
      ],
    },
    images: [],
  },
  {
    id: "velvet-dessert-bar", vendorId: "velvet-table-co", vertical: "catering",
    title: "Dessert Bar", categoryId: "catering", subcategoryId: "catering-live-stations",
    city: "Lahore", status: "Draft", featured: false,
    description: "Styled dessert table with a mix of local and continental sweets.",
    catering: {
      minGuests: 50, maxGuests: 400,
      serviceStyle: "Live stations",
      cuisines: ["Desserts"],
      perHeadFrom: 450,
      staffing: "2 attendants",
      travelsTo: "Lahore",
      notice: "7 days",
      deals: [
        { id: "deal-d1", name: "Sweet Table", perHead: 450, minGuests: 50,
          includes: ["6 dessert varieties", "Styled table", "2 attendants"] },
      ],
      menus: [
        { id: "menu-d1", name: "Dessert Selection", perHead: 450, sections: [
          { name: "Continental", items: ["Mini Cheesecakes", "Macarons", "Brownies"] },
          { name: "Desi", items: ["Gulab Jamun", "Ras Malai", "Mithai Platter"] },
        ] },
      ],
    },
    images: [],
  },
];

export const inquiries = [
  { id: "inq-1001", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", vertical: "hall",
    customerName: "Ayesha Khan", customerEmail: "ayesha.k@email.com", customerCity: "Lahore",
    eventDate: "2026-11-20", slot: "night", guests: 500, eventType: "Walima",
    message: "Need the main hall for around 500 guests for a November walima.",
    status: "New", createdAt: "2026-08-18", bookingId: null },

  { id: "inq-1002", listingId: "gulmohar-emerald-hall", vendorId: "gulmohar-banquet", vertical: "hall",
    customerName: "Hina Raza", customerEmail: "hina.raza@email.com", customerCity: "Islamabad",
    eventDate: "2026-09-30", slot: "day", guests: 180, eventType: "Nikkah",
    message: "Daytime nikkah for about 180 people. Is outside catering allowed?",
    status: "New", createdAt: "2026-08-17", bookingId: null },

  { id: "inq-1003", listingId: "grand-marquee-main", vendorId: "the-grand-marquee", vertical: "hall",
    customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerCity: "Faisalabad",
    eventDate: "2026-11-08", slot: "night", guests: 400, eventType: "Barat",
    message: "Outdoor marquee for 400, need setup finished by 4pm.",
    status: "Converted", createdAt: "2026-08-09", bookingId: "bkg-3003" },

  { id: "inq-1004", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", vertical: "hall",
    customerName: "Bilal Ahmed", customerEmail: "bilal.a@email.com", customerCity: "Multan",
    eventDate: "2026-12-01", slot: "night", guests: 350, eventType: "Mehndi",
    message: "Mehndi night, 350 guests. What's included in the rate?",
    status: "Converted", createdAt: "2026-08-16", bookingId: "bkg-3002" },

  { id: "inq-1005", listingId: "gulmohar-garden-lawn", vendorId: "gulmohar-banquet", vertical: "hall",
    customerName: "Sana Malik", customerEmail: "sana.m@email.com", customerCity: "Karachi",
    eventDate: "2026-10-04", slot: "night", guests: 300, eventType: "Mehndi",
    message: "Is the lawn available in early October?",
    status: "Rejected", createdAt: "2026-08-06", bookingId: null },

  /* ---- CATERING ---- */
  { id: "inq-2001", listingId: "saffron-signature-buffet", vendorId: "saffron-table-co", vertical: "catering",
    customerName: "Bilal Ahmed", customerEmail: "bilal.a@email.com", customerCity: "Multan",
    eventDate: "2026-12-01", slot: null, guests: 300, eventType: "Walima",
    venueAddress: "Gulmohar Banquet, Bosan Road, Multan",
    message: "300 guests, mixed desi menu. Can you do a live BBQ station too?",
    status: "New", createdAt: "2026-08-19", bookingId: null },

  { id: "inq-2002", listingId: "velvet-continental-plated", vendorId: "velvet-table-co", vertical: "catering",
    customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerCity: "Faisalabad",
    eventDate: "2026-11-08", slot: null, guests: 150, eventType: "Engagement",
    venueAddress: "Royal Palm, Lahore",
    message: "Plated dinner for 150. Do you have vegetarian mains?",
    status: "Converted", createdAt: "2026-08-12", bookingId: "bkg-4002" },

  { id: "inq-2003", listingId: "saffron-live-bbq", vendorId: "saffron-table-co", vertical: "catering",
    customerName: "Sana Malik", customerEmail: "sana.m@email.com", customerCity: "Karachi",
    eventDate: "2026-10-20", slot: null, guests: 120, eventType: "Mehndi",
    venueAddress: "Private farmhouse, Multan",
    message: "Just the BBQ station as an add-on for a mehndi.",
    status: "New", createdAt: "2026-08-21", bookingId: null },
];

export const bookings = [
  /* Gulmohar Banquet — spread across halls and slots so the calendar has shape */
  { id: "bkg-3001", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", inquiryId: null,
    customerName: "Ali Raza", customerEmail: "ali.raza@email.com", customerPhone: "0300-1234567",
    eventDate: "2026-09-12", slot: "night", eventType: "Walima", guests: 500,
    totalAmount: 350000, status: "Confirmed", createdAt: "2026-08-02",
    note: "500 guests, main hall, stage decor included.",
    payments: [
      { id: "pay-1", label: "Advance", amount: 140000, date: "2026-08-02", method: "Bank transfer" },
    ] },

  { id: "bkg-3002", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", inquiryId: "inq-1004",
    customerName: "Bilal Ahmed", customerEmail: "bilal.a@email.com", customerPhone: "0301-2223344",
    eventDate: "2026-12-01", slot: "night", eventType: "Mehndi", guests: 350,
    totalAmount: 350000, status: "Confirmed", createdAt: "2026-08-16",
    note: "Converted from inquiry. Mehndi night.",
    payments: [
      { id: "pay-2", label: "Advance", amount: 100000, date: "2026-08-16", method: "Cash" },
      { id: "pay-3", label: "Instalment", amount: 50000, date: "2026-09-01", method: "Bank transfer" },
    ] },

  { id: "bkg-3004", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", inquiryId: null,
    customerName: "TechCorp Pvt Ltd", customerEmail: "events@techcorp.pk", customerPhone: "042-35000000",
    eventDate: "2026-09-12", slot: "day", eventType: "Corporate", guests: 200,
    totalAmount: 280000, status: "Confirmed", createdAt: "2026-08-11",
    note: "Daytime corporate lunch. AV setup needed. Same day as the Raza walima.",
    payments: [
      { id: "pay-4", label: "Advance", amount: 280000, date: "2026-08-11", method: "Bank transfer" },
    ] },

  { id: "bkg-3005", listingId: "gulmohar-emerald-hall", vendorId: "gulmohar-banquet", inquiryId: null,
    customerName: "Sadia Khan", customerEmail: "sadia.k@email.com", customerPhone: "0333-9988776",
    eventDate: "2026-09-26", slot: "night", eventType: "Mehndi", guests: 260,
    totalAmount: 200000, status: "Confirmed", createdAt: "2026-08-14",
    note: "",
    payments: [
      { id: "pay-5", label: "Advance", amount: 60000, date: "2026-08-14", method: "Cash" },
    ] },

  { id: "bkg-3006", listingId: "gulmohar-emerald-hall", vendorId: "gulmohar-banquet", inquiryId: null,
    customerName: "Malik Family", customerEmail: "b.malik@email.com", customerPhone: "0321-4455667",
    eventDate: "2026-10-12", slot: "night", eventType: "Nikkah", guests: 220,
    totalAmount: 200000, status: "Pending", createdAt: "2026-08-20",
    note: "Awaiting advance before the date is held.",
    payments: [] },

  { id: "bkg-3007", listingId: "gulmohar-royal-hall", vendorId: "gulmohar-banquet", inquiryId: null,
    customerName: "Farooq Wedding", customerEmail: "farooq@email.com", customerPhone: "0345-1122334",
    eventDate: "2026-08-08", slot: "night", eventType: "Barat", guests: 480,
    totalAmount: 350000, status: "Completed", createdAt: "2026-06-30",
    note: "Done. Fully settled.",
    payments: [
      { id: "pay-6", label: "Advance", amount: 150000, date: "2026-06-30", method: "Bank transfer" },
      { id: "pay-7", label: "Final payment", amount: 200000, date: "2026-08-08", method: "Cash" },
    ] },

  /* The Grand Marquee */
  { id: "bkg-3003", listingId: "grand-marquee-main", vendorId: "the-grand-marquee", inquiryId: "inq-1003",
    customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerPhone: "0302-7788990",
    eventDate: "2026-11-08", slot: "night", eventType: "Barat", guests: 400,
    totalAmount: 420000, status: "Confirmed", createdAt: "2026-08-09",
    note: "Converted from inquiry. Setup done by 4pm.",
    payments: [
      { id: "pay-8", label: "Advance", amount: 210000, date: "2026-08-09", method: "Bank transfer" },
    ] },

  { id: "bkg-3008", listingId: "grand-marquee-garden", vendorId: "the-grand-marquee", inquiryId: null,
    customerName: "Zeeshan Ali", customerEmail: "zeeshan@email.com", customerPhone: "0311-5566778",
    eventDate: "2026-10-05", slot: "day", eventType: "Engagement", guests: 150,
    totalAmount: 160000, status: "Confirmed", createdAt: "2026-08-15",
    note: "",
    payments: [
      { id: "pay-9", label: "Advance", amount: 80000, date: "2026-08-15", method: "Cash" },
    ] },

  /* ---- CATERING ---- */
  { id: "bkg-4001", listingId: "saffron-signature-buffet", vendorId: "saffron-table-co", inquiryId: null,
    customerName: "Kamran Sheikh", customerEmail: "kamran.s@email.com", customerPhone: "0300-8877665",
    eventDate: "2026-09-12", slot: null, eventType: "Barat", guests: 400,
    dealId: "deal-s2", menuId: "menu-s2", perHead: 2000,
    venueAddress: "Shalimar Hall, Multan",
    totalAmount: 800000, status: "Confirmed", createdAt: "2026-08-05",
    note: "Premium deal, 400 guests. Live BBQ included.",
    payments: [
      { id: "pay-c1", label: "Advance", amount: 300000, date: "2026-08-05", method: "Bank transfer" },
    ] },

  { id: "bkg-4002", listingId: "velvet-continental-plated", vendorId: "velvet-table-co", inquiryId: "inq-2002",
    customerName: "Usman Tariq", customerEmail: "usman.t@email.com", customerPhone: "0302-7788990",
    eventDate: "2026-11-08", slot: null, eventType: "Engagement", guests: 150,
    dealId: "deal-v1", menuId: "menu-v1", perHead: 1800,
    venueAddress: "Royal Palm, Lahore",
    totalAmount: 270000, status: "Confirmed", createdAt: "2026-08-12",
    note: "Converted from inquiry. Two vegetarian mains agreed.",
    payments: [
      { id: "pay-c2", label: "Advance", amount: 100000, date: "2026-08-12", method: "Cheque" },
      { id: "pay-c3", label: "Instalment", amount: 70000, date: "2026-09-15", method: "Bank transfer" },
    ] },

  { id: "bkg-4003", listingId: "saffron-signature-buffet", vendorId: "saffron-table-co", inquiryId: null,
    customerName: "Rehana Begum", customerEmail: "rehana@email.com", customerPhone: "0333-1122334",
    eventDate: "2026-09-12", slot: null, eventType: "Mehndi", guests: 180,
    dealId: "deal-s1", menuId: "menu-s1", perHead: 1400,
    venueAddress: "Community Hall, Multan",
    totalAmount: 252000, status: "Confirmed", createdAt: "2026-08-18",
    note: "Same date as the Sheikh barat - two events in one day, both fine.",
    payments: [
      { id: "pay-c4", label: "Advance", amount: 80000, date: "2026-08-18", method: "Cash" },
    ] },

  { id: "bkg-4004", listingId: "saffron-live-bbq", vendorId: "saffron-table-co", inquiryId: null,
    customerName: "Adnan Malik", customerEmail: "adnan.m@email.com", customerPhone: "0345-9988776",
    eventDate: "2026-10-25", slot: null, eventType: "Birthday", guests: 100,
    dealId: "deal-b1", menuId: "menu-b1", perHead: 600,
    venueAddress: "Home, Gulgasht Colony, Multan",
    totalAmount: 60000, status: "Pending", createdAt: "2026-08-22",
    note: "Awaiting confirmation on final headcount.",
    payments: [] },

  { id: "bkg-4005", listingId: "velvet-continental-plated", vendorId: "velvet-table-co", inquiryId: null,
    customerName: "Hina Raza", customerEmail: "hina.raza@email.com", customerPhone: "0311-4455667",
    eventDate: "2026-07-18", slot: null, eventType: "Corporate", guests: 90,
    dealId: "deal-v2", menuId: "menu-v1", perHead: 2600,
    venueAddress: "Avari Hotel, Lahore",
    totalAmount: 234000, status: "Completed", createdAt: "2026-06-20",
    note: "Done and fully settled.",
    payments: [
      { id: "pay-c5", label: "Advance", amount: 100000, date: "2026-06-20", method: "Bank transfer" },
      { id: "pay-c6", label: "Final payment", amount: 134000, date: "2026-07-18", method: "Bank transfer" },
    ] },
];

export const EVENT_TYPES = ["Barat", "Walima", "Mehndi", "Nikkah", "Engagement", "Birthday", "Corporate", "Other"];
