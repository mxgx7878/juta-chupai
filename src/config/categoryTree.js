/**
 * categoryTree.js
 * ---------------------------------------------------------------------------
 * Cleaned & deduplicated wedding-marketplace category taxonomy (2 levels:
 * parent CATEGORY -> SUBCATEGORY[]). This is the single source of truth for
 * categories. `categoriesSlice` seeds from it; `vendorCategories.js` is a thin
 * compatibility layer over it.
 *
 * LISTING TYPES  (rent | purchase | service)
 *   - purchase : buyer keeps a physical good (dresses, cakes, jewellery…)
 *   - rent     : physical thing/space used then returned (venues, cars, ghori…)
 *   - service  : a person/team performs work, booked by date (makeup,
 *                photography, catering, planning, DJ, fireworks…)
 *   A category's `allowedTypes` lists everything its listings MAY be; each
 *   listing picks from that set. Mixed categories (decor, music, photography,
 *   baraat) allow more than one. Per the client, venues & transport are `rent`.
 *
 * FIELD TEMPLATES
 *   Parents point at a shared `fieldTemplate` key (see FIELD_TEMPLATES) instead
 *   of hand-defining fields for 150+ subcategories.
 *
 * IDs are stable slugs; subcategory ids are scoped under their parent
 * (`bride-bridal-dress`) so duplicate names across parents never collide.
 * ------------------------------------------------------------------------- */

export const LISTING_TYPES = {
  RENT: "rent",
  PURCHASE: "purchase",
  SERVICE: "service",
};

export const RENT = [LISTING_TYPES.RENT];
export const PURCHASE = [LISTING_TYPES.PURCHASE];
export const SERVICE = [LISTING_TYPES.SERVICE];
export const RENT_PURCHASE = [LISTING_TYPES.RENT, LISTING_TYPES.PURCHASE];
export const SERVICE_RENT = [LISTING_TYPES.SERVICE, LISTING_TYPES.RENT];
export const BOTH = RENT_PURCHASE; // backwards-compat alias

export const TYPE_LABELS = {
  rent: "Rent",
  purchase: "Purchase",
  service: "Service",
};

/** Shared attribute templates. Extend these, not per-subcategory. */
export const FIELD_TEMPLATES = {
  apparel: [
    { name: "size", label: "Size / sizes available", type: "text" },
    { name: "color", label: "Colour", type: "text" },
    { name: "fabric", label: "Fabric", type: "text" },
  ],
  jewellery: [
    { name: "material", label: "Material", type: "select", options: ["Gold", "Gold-plated", "Artificial", "Silver"] },
    { name: "weight", label: "Weight (grams)", type: "number" },
  ],
  service: [
    { name: "coverage", label: "Coverage / hours", type: "text" },
    { name: "teamSize", label: "Team size", type: "number" },
  ],
  venue: [
    { name: "capacity", label: "Guest capacity", type: "number", suffix: "guests" },
    { name: "setting", label: "Setting", type: "select", options: ["Indoor", "Outdoor", "Both"] },
    { name: "parking", label: "Parking spaces", type: "number" },
  ],
  food: [
    { name: "perHead", label: "Price per head (PKR)", type: "number" },
    { name: "minGuests", label: "Minimum guests", type: "number" },
  ],
  transport: [
    { name: "vehicleType", label: "Vehicle / type", type: "text" },
    { name: "seats", label: "Seating capacity", type: "number" },
  ],
  home: [
    { name: "material", label: "Material", type: "text" },
    { name: "dimensions", label: "Dimensions", type: "text" },
  ],
  print: [
    { name: "customizable", label: "Customisable", type: "select", options: ["Yes", "No"] },
    { name: "minOrder", label: "Minimum order quantity", type: "number" },
  ],
  travel: [
    { name: "nights", label: "Nights", type: "number" },
    { name: "destinations", label: "Destinations", type: "text" },
  ],
  generic: [],
};

/* slug helper for building scoped subcategory ids */
function slug(s) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Category factory.
 * @param {object} c { id, emoji, name, iconKey, color, allowedTypes, fieldTemplate, subs }
 */
const cat = (c) => ({
  id: c.id,
  emoji: c.emoji,
  name: c.name,
  iconKey: c.iconKey,
  color: c.color,
  allowedTypes: c.allowedTypes,
  fieldTemplate: c.fieldTemplate,
  subcategories: c.subs.map((s) => ({ id: `${c.id}-${slug(s)}`, name: s })),
});

export const CATEGORY_TREE = [
  cat({ id: "bride", emoji: "👰", name: "Bride", iconKey: "attire", color: "#ec4899", allowedTypes: BOTH, fieldTemplate: "apparel",
    subs: ["Bridal Dress", "Bridal Maxi", "Lehenga", "Gharara", "Sharara", "Dupatta", "Bridal Accessories"] }),

  cat({ id: "groom", emoji: "🤵", name: "Groom", iconKey: "attire", color: "#2f6fed", allowedTypes: BOTH, fieldTemplate: "apparel",
    subs: ["Sherwani", "Prince Coat", "Suit", "Waistcoat", "Kurta", "Groom Accessories"] }),

  cat({ id: "jewellery", emoji: "💎", name: "Jewellery", iconKey: "diamond", color: "#d99400", allowedTypes: BOTH, fieldTemplate: "jewellery",
    subs: ["Bridal Sets", "Gold Jewellery", "Artificial Jewellery", "Earrings", "Necklace", "Bangles", "Rings", "Maang Tikka", "Nath", "Payal"] }),

  cat({ id: "shoes-bags", emoji: "👠", name: "Shoes & Bags", iconKey: "bag", color: "#7c3aed", allowedTypes: BOTH, fieldTemplate: "apparel",
    subs: ["Bridal Shoes", "Groom Shoes", "Khussa", "Heels", "Handbags", "Clutches"] }),

  cat({ id: "beauty-makeup", emoji: "💄", name: "Beauty & Makeup", iconKey: "brush", color: "#22a06b", allowedTypes: SERVICE, fieldTemplate: "service",
    subs: ["Makeup Artist", "Bridal Makeup", "Hair Stylist", "Mehndi", "Facial/Beauty Services"] }),

  cat({ id: "photography-video", emoji: "📸", name: "Photography & Video", iconKey: "camera", color: "#0ea5a4", allowedTypes: SERVICE_RENT, fieldTemplate: "service",
    subs: ["Photographer", "Videographer", "Drone", "Cinematic Video", "Pre-Wedding Shoot", "Photo Booth"] }),

  // "Furniture" renamed "Event Furniture" (rental for the event) to distinguish from Home & Furniture.
  cat({ id: "decoration", emoji: "🌸", name: "Decoration", iconKey: "floral", color: "#7c3aed", allowedTypes: SERVICE_RENT, fieldTemplate: "service",
    subs: ["Wedding Stage", "Floral Decoration", "Entrance", "Mehndi Decoration", "Nikah Decoration", "Lighting", "Event Furniture"] }),

  cat({ id: "venues", emoji: "🏛️", name: "Wedding Venues", iconKey: "venue", color: "#4f46e5", allowedTypes: RENT, fieldTemplate: "venue",
    subs: ["Marriage Halls", "Banquet", "Farmhouse", "Marquee", "Hotel", "Outdoor Venue"] }),

  // "Desserts" lives under Cakes & Sweets, removed here.
  cat({ id: "catering", emoji: "🍽️", name: "Catering & Food", iconKey: "restaurant", color: "#f59e0b", allowedTypes: SERVICE, fieldTemplate: "food",
    subs: ["Catering", "BBQ", "Pakistani Food", "Continental", "Live Stations", "Waiters/Service Staff"] }),

  cat({ id: "cakes-sweets", emoji: "🎂", name: "Cakes & Sweets", iconKey: "cake", color: "#ec4899", allowedTypes: PURCHASE, fieldTemplate: "food",
    subs: ["Wedding Cakes", "Customized Cakes", "Mithai", "Desserts", "Chocolates"] }),

  cat({ id: "transport", emoji: "🚗", name: "Transport", iconKey: "car", color: "#2f6fed", allowedTypes: RENT, fieldTemplate: "transport",
    subs: ["Luxury Cars", "Bridal Cars", "Groom Cars", "Vintage Cars", "Limousines", "Buses", "Coasters", "Hiace", "Guest Transport"] }),

  // "Dhol" lives under Baraat & Traditions, removed here.
  cat({ id: "music-entertainment", emoji: "🎵", name: "Music & Entertainment", iconKey: "music", color: "#ec4899", allowedTypes: SERVICE_RENT, fieldTemplate: "service",
    subs: ["DJ", "Sound System", "Qawwali", "Singers", "Live Band", "Dance/Entertainment"] }),

  cat({ id: "invitations-printing", emoji: "💌", name: "Invitations & Printing", iconKey: "invite", color: "#4a82f6", allowedTypes: PURCHASE, fieldTemplate: "print",
    subs: ["Wedding Cards", "Digital Invitations", "Nikah Nama Design", "Gift Cards", "Printing"] }),

  // MERGED: "Gifts & Favors" + "Wedding Gifts & Giveaways".
  cat({ id: "gifts-favors", emoji: "🎁", name: "Gifts & Favors", iconKey: "gift", color: "#d99400", allowedTypes: PURCHASE, fieldTemplate: "print",
    subs: ["Wedding Favors", "Gift Hampers", "Customized Gifts", "Bride/Groom Gifts", "Guest Gifts", "Wedding Hampers", "Salami/Gift Envelopes"] }),

  cat({ id: "planning-services", emoji: "💍", name: "Wedding Planning & Services", iconKey: "planner", color: "#4f46e5", allowedTypes: SERVICE, fieldTemplate: "service",
    subs: ["Wedding Planner", "Event Management", "Coordination", "Ushers", "Security", "Valet Parking"] }),

  // MERGED: both "Wedding Shopping" blocks; vague person-type subs dropped (covered by apparel categories).
  cat({ id: "wedding-shopping", emoji: "🛍️", name: "Wedding Shopping", iconKey: "shopping", color: "#0ea5a4", allowedTypes: PURCHASE, fieldTemplate: "generic",
    subs: ["Wedding Essentials", "Customized Items"] }),

  cat({ id: "nikah-religious", emoji: "🕌", name: "Nikah & Religious Services", iconKey: "mosque", color: "#22a06b", allowedTypes: SERVICE, fieldTemplate: "service",
    subs: ["Nikah Khawan", "Nikah Setup", "Quran/Gift Sets", "Religious Ceremony Requirements"] }),

  cat({ id: "honeymoon-travel", emoji: "🏨", name: "Honeymoon & Travel", iconKey: "travel", color: "#2f6fed", allowedTypes: RENT, fieldTemplate: "travel",
    subs: ["Honeymoon Packages", "Hotels", "Resorts", "Travel", "Tickets", "Transport"] }),

  cat({ id: "fireworks-effects", emoji: "🎆", name: "Fireworks & Special Effects", iconKey: "celebration", color: "#f59e0b", allowedTypes: SERVICE, fieldTemplate: "service",
    subs: ["Fireworks", "Cold Fire", "Smoke Effects", "Confetti", "Entry Effects"] }),

  cat({ id: "dowry-jahez", emoji: "🏠", name: "Dowry / Jahez", iconKey: "home", color: "#7c3aed", allowedTypes: PURCHASE, fieldTemplate: "home",
    subs: ["Furniture", "Bedroom Sets", "Dining Sets", "Crockery", "Kitchen Items", "Electronics", "Home Appliances", "Curtains & Home Decor", "Bedding", "Other Jahez Items"] }),

  cat({ id: "home-furniture", emoji: "🛏️", name: "Home & Furniture", iconKey: "furniture", color: "#2f6fed", allowedTypes: BOTH, fieldTemplate: "home",
    subs: ["Beds", "Sofas", "Wardrobes", "Dressing Tables", "Mattresses", "Tables & Chairs"] }),

  cat({ id: "jahez-packing", emoji: "🧳", name: "Wedding / Jahez Packing", iconKey: "luggage", color: "#f59e0b", allowedTypes: BOTH, fieldTemplate: "home",
    subs: ["Suitcases", "Trunks", "Boxes", "Gift Packaging", "Jahez Packing Services"] }),

  // MERGED: "Baraat & Wedding Traditions" + "Ghori & Baraat". "Dhol" now lives here.
  cat({ id: "baraat-traditions", emoji: "🥁", name: "Baraat & Traditions", iconKey: "nightlife", color: "#ec4899", allowedTypes: SERVICE_RENT, fieldTemplate: "transport",
    subs: ["Dhol", "Dholki", "Sehra", "Baraat Accessories", "Ghori", "Carriages", "Vintage Vehicles", "Baraat Entry"] }),

  cat({ id: "tailoring-stitching", emoji: "🧵", name: "Tailoring & Stitching", iconKey: "tailoring", color: "#22a06b", allowedTypes: PURCHASE, fieldTemplate: "apparel",
    subs: ["Bridal Stitching", "Groom Stitching", "Alteration", "Custom Dresses", "Embroidery"] }),
];

/* ---- Helpers ---- */

export const getCategory = (id) => CATEGORY_TREE.find((c) => c.id === id) || null;
export const getCategoryByName = (name) => CATEGORY_TREE.find((c) => c.name === name) || null;

export const getSubcategory = (subId) => {
  for (const c of CATEGORY_TREE) {
    const s = c.subcategories.find((x) => x.id === subId);
    if (s) return { ...s, category: c };
  }
  return null;
};

export const categoryAllows = (categoryId, type) => {
  const c = getCategory(categoryId);
  return !!c && c.allowedTypes.includes(type);
};

export const fieldsFor = (categoryId) => {
  const c = getCategory(categoryId);
  return c ? FIELD_TEMPLATES[c.fieldTemplate] || [] : [];
};

export const categoryNames = () => CATEGORY_TREE.map((c) => c.name);

export const allSubcategories = () =>
  CATEGORY_TREE.flatMap((c) => c.subcategories.map((s) => ({ ...s, categoryId: c.id, categoryName: c.name })));