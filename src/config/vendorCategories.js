/* Category schema — the base categories + the extra form fields each one adds.
   Icons are referenced by `iconKey` (see categoryIcons.js) so categories can
   also be created at runtime and stored in Redux. */

export const VENDOR_CATEGORIES = {
  Venues: {
    iconKey: "venue",
    color: "#4f46e5",
    fields: [
      { name: "capacity", label: "Guest capacity", type: "number", suffix: "guests" },
      { name: "setting", label: "Setting", type: "select", options: ["Indoor", "Outdoor", "Both"] },
      { name: "parking", label: "Parking spaces", type: "number" },
      { name: "halls", label: "Number of halls", type: "number" },
    ],
    services: ["Hall rental", "In-house catering", "Stage & lighting", "Valet parking", "Bridal room"],
  },
  Photography: {
    iconKey: "camera",
    color: "#0ea5a4",
    fields: [
      { name: "shootTypes", label: "Shoot types", type: "multiselect", options: ["Wedding", "Pre-wedding", "Event", "Portrait"] },
      { name: "drone", label: "Drone coverage", type: "select", options: ["Yes", "No"] },
      { name: "turnaround", label: "Delivery turnaround", type: "number", suffix: "days" },
    ],
    services: ["Wedding photography", "Cinematic film", "Drone coverage", "Same-day edit", "Photo album"],
  },
  Catering: {
    iconKey: "restaurant",
    color: "#f59e0b",
    fields: [
      { name: "cuisines", label: "Cuisines", type: "multiselect", options: ["Desi", "BBQ", "Continental", "Chinese", "Dessert"] },
      { name: "perHead", label: "Price per head (PKR)", type: "number" },
      { name: "liveStations", label: "Live stations", type: "select", options: ["Yes", "No"] },
    ],
    services: ["Live BBQ", "Desi buffet", "Continental", "Dessert bar", "Waitstaff"],
  },
  Decor: {
    iconKey: "floral",
    color: "#7c3aed",
    fields: [
      { name: "setups", label: "Setups offered", type: "multiselect", options: ["Stage", "Floral arch", "Table setting", "Lighting", "Entrance"] },
      { name: "theme", label: "Signature theme", type: "text" },
    ],
    services: ["Stage decor", "Floral arrangements", "Table setting", "Lighting", "Entrance setup"],
  },
  Entertainment: {
    iconKey: "music",
    color: "#ec4899",
    fields: [
      { name: "acts", label: "Acts", type: "multiselect", options: ["DJ & sound", "Dhol", "LED dance floor", "MC / host", "Live band"] },
      { name: "hours", label: "Max hours per event", type: "number", suffix: "hrs" },
    ],
    services: ["DJ & sound", "Dhol", "LED dance floor", "MC / host"],
  },
  Makeup: {
    iconKey: "brush",
    color: "#22a06b",
    fields: [
      { name: "types", label: "Makeup types", type: "multiselect", options: ["Bridal", "Party", "Hair styling", "Nikkah"] },
      { name: "atHome", label: "At-home service", type: "select", options: ["Yes", "No"] },
    ],
    services: ["Bridal makeup", "Party makeup", "Hair styling", "At-home service"],
  },
  Transport: {
    iconKey: "car",
    color: "#2f6fed",
    fields: [
      { name: "vehicles", label: "Vehicle types", type: "multiselect", options: ["Luxury car", "Vintage car", "Coaster", "Limo"] },
      { name: "fleet", label: "Fleet size", type: "number" },
    ],
    services: ["Bridal car", "Guest shuttle", "Decorated entry", "Chauffeur"],
  },
};

export const CATEGORY_NAMES = Object.keys(VENDOR_CATEGORIES);

export const CITY_OPTIONS = ["Lahore", "Karachi", "Islamabad", "Multan", "Faisalabad", "Peshawar", "Rawalpindi"];

/** Static schema lookup (fields + services + base icon/color). */
export function categoryMeta(name) {
  return VENDOR_CATEGORIES[name] || { iconKey: "celebration", color: "#4f46e5", fields: [], services: [] };
}
