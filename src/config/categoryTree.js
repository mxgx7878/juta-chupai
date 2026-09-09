/**
 * categoryTree.js
 * ---------------------------------------------------------------------------
 * Wedding-marketplace category taxonomy (2 levels: parent CATEGORY ->
 * SUBCATEGORY[]). This is the single source of truth for categories;
 * `categoriesSlice` seeds from it.
 *
 * VERTICALS
 *   Every category is tagged with a `vertical`, which decides how its listings,
 *   inquiries and bookings behave:
 *     - "hall"     : one listing = one physical hall. Day/night slots, per-listing
 *                    availability calendar, date-blocking bookings.
 *     - "catering" : listing carries menus & deals. No calendar; a caterer can
 *                    serve several events on the same date.
 *     - "generic"  : not yet built out. Listings are disabled for these.
 *
 * IDs are stable slugs; subcategory ids are scoped under their parent
 * (`bride-bridal-dress`) so duplicate names across parents never collide.
 * ------------------------------------------------------------------------- */

export const VERTICALS = {
  HALL: "hall",
  CATERING: "catering",
  GENERIC: "generic",
};

export const VERTICAL_LABELS = {
  hall: "Hall / Venue",
  catering: "Catering",
  generic: "Generic",
};

export const VERTICAL_OPTIONS = [
  { id: "hall", label: "Hall / Venue", hint: "Per-listing calendar, day & night slots, date-blocking bookings" },
  { id: "catering", label: "Catering", hint: "Menus & deals, per-head pricing, no calendar" },
  { id: "generic", label: "Generic", hint: "Listings not yet enabled for this category" },
];

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
 * @param {object} c { id, name, iconKey, color, vertical, subs }
 */
const cat = (c) => ({
  id: c.id,
  name: c.name,
  iconKey: c.iconKey,
  color: c.color,
  vertical: c.vertical || VERTICALS.GENERIC,
  subcategories: c.subs.map((s) => ({ id: `${c.id}-${slug(s)}`, name: s })),
});

export const CATEGORY_TREE = [
  cat({ id: "bride", name: "Bride", iconKey: "attire", color: "#ec4899",
    subs: ["Bridal Dress", "Bridal Maxi", "Lehenga", "Gharara", "Sharara", "Dupatta", "Bridal Accessories"] }),

  cat({ id: "groom", name: "Groom", iconKey: "attire", color: "#2f6fed",
    subs: ["Sherwani", "Prince Coat", "Suit", "Waistcoat", "Kurta", "Groom Accessories"] }),

  cat({ id: "jewellery", name: "Jewellery", iconKey: "diamond", color: "#d99400",
    subs: ["Bridal Sets", "Gold Jewellery", "Artificial Jewellery", "Earrings", "Necklace", "Bangles", "Rings", "Maang Tikka", "Nath", "Payal"] }),

  cat({ id: "shoes-bags", name: "Shoes & Bags", iconKey: "bag", color: "#7c3aed",
    subs: ["Bridal Shoes", "Groom Shoes", "Khussa", "Heels", "Handbags", "Clutches"] }),

  cat({ id: "beauty-makeup", name: "Beauty & Makeup", iconKey: "brush", color: "#22a06b",
    subs: ["Makeup Artist", "Bridal Makeup", "Hair Stylist", "Mehndi", "Facial/Beauty Services"] }),

  cat({ id: "photography-video", name: "Photography & Video", iconKey: "camera", color: "#0ea5a4",
    subs: ["Photographer", "Videographer", "Drone", "Cinematic Video", "Pre-Wedding Shoot", "Photo Booth"] }),

  cat({ id: "decoration", name: "Decoration", iconKey: "floral", color: "#7c3aed",
    subs: ["Wedding Stage", "Floral Decoration", "Entrance", "Mehndi Decoration", "Nikah Decoration", "Lighting", "Event Furniture"] }),

  /* ---- HALL VERTICAL ---- */
  cat({ id: "venues", name: "Wedding Venues", iconKey: "venue", color: "#4f46e5", vertical: VERTICALS.HALL,
    subs: ["Marriage Halls", "Banquet", "Farmhouse", "Marquee", "Hotel", "Outdoor Venue"] }),

  /* ---- CATERING VERTICAL ---- */
  cat({ id: "catering", name: "Catering & Food", iconKey: "restaurant", color: "#f59e0b", vertical: VERTICALS.CATERING,
    subs: ["Catering", "BBQ", "Pakistani Food", "Continental", "Live Stations", "Waiters/Service Staff"] }),

  cat({ id: "cakes-sweets", name: "Cakes & Sweets", iconKey: "cake", color: "#ec4899",
    subs: ["Wedding Cakes", "Customized Cakes", "Mithai", "Desserts", "Chocolates"] }),

  cat({ id: "transport", name: "Transport", iconKey: "car", color: "#2f6fed",
    subs: ["Luxury Cars", "Bridal Cars", "Groom Cars", "Vintage Cars", "Limousines", "Buses", "Coasters", "Hiace", "Guest Transport"] }),

  cat({ id: "music-entertainment", name: "Music & Entertainment", iconKey: "music", color: "#ec4899",
    subs: ["DJ", "Sound System", "Qawwali", "Singers", "Live Band", "Dance/Entertainment"] }),

  cat({ id: "invitations-printing", name: "Invitations & Printing", iconKey: "invite", color: "#4a82f6",
    subs: ["Wedding Cards", "Digital Invitations", "Nikah Nama Design", "Gift Cards", "Printing"] }),

  cat({ id: "gifts-favors", name: "Gifts & Favors", iconKey: "gift", color: "#d99400",
    subs: ["Wedding Favors", "Gift Hampers", "Customized Gifts", "Bride/Groom Gifts", "Guest Gifts", "Wedding Hampers", "Salami/Gift Envelopes"] }),

  cat({ id: "planning-services", name: "Wedding Planning & Services", iconKey: "planner", color: "#4f46e5",
    subs: ["Wedding Planner", "Event Management", "Coordination", "Ushers", "Security", "Valet Parking"] }),

  cat({ id: "wedding-shopping", name: "Wedding Shopping", iconKey: "shopping", color: "#0ea5a4",
    subs: ["Wedding Essentials", "Customized Items"] }),

  cat({ id: "nikah-religious", name: "Nikah & Religious Services", iconKey: "mosque", color: "#22a06b",
    subs: ["Nikah Khawan", "Nikah Setup", "Quran/Gift Sets", "Religious Ceremony Requirements"] }),

  cat({ id: "honeymoon-travel", name: "Honeymoon & Travel", iconKey: "travel", color: "#2f6fed",
    subs: ["Honeymoon Packages", "Hotels", "Resorts", "Travel", "Tickets", "Transport"] }),

  cat({ id: "fireworks-effects", name: "Fireworks & Special Effects", iconKey: "celebration", color: "#f59e0b",
    subs: ["Fireworks", "Cold Fire", "Smoke Effects", "Confetti", "Entry Effects"] }),

  cat({ id: "dowry-jahez", name: "Dowry / Jahez", iconKey: "home", color: "#7c3aed",
    subs: ["Furniture", "Bedroom Sets", "Dining Sets", "Crockery", "Kitchen Items", "Electronics", "Home Appliances", "Curtains & Home Decor", "Bedding", "Other Jahez Items"] }),

  cat({ id: "home-furniture", name: "Home & Furniture", iconKey: "furniture", color: "#2f6fed",
    subs: ["Beds", "Sofas", "Wardrobes", "Dressing Tables", "Mattresses", "Tables & Chairs"] }),

  cat({ id: "jahez-packing", name: "Wedding / Jahez Packing", iconKey: "luggage", color: "#f59e0b",
    subs: ["Suitcases", "Trunks", "Boxes", "Gift Packaging", "Jahez Packing Services"] }),

  cat({ id: "baraat-traditions", name: "Baraat & Traditions", iconKey: "nightlife", color: "#ec4899",
    subs: ["Dhol", "Dholki", "Sehra", "Baraat Accessories", "Ghori", "Carriages", "Vintage Vehicles", "Baraat Entry"] }),

  cat({ id: "tailoring-stitching", name: "Tailoring & Stitching", iconKey: "tailoring", color: "#22a06b",
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

/** Vertical of a category id -- "hall" | "catering" | "generic". */
export const getVertical = (categoryId) => getCategory(categoryId)?.vertical || VERTICALS.GENERIC;

/** All categories belonging to a vertical. */
export const categoriesByVertical = (vertical) => CATEGORY_TREE.filter((c) => c.vertical === vertical);

export const categoryNames = () => CATEGORY_TREE.map((c) => c.name);

export const allSubcategories = () =>
  CATEGORY_TREE.flatMap((c) => c.subcategories.map((s) => ({ ...s, categoryId: c.id, categoryName: c.name })));
