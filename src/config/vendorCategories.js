/* Compatibility layer over the category tree.
   The tree (categoryTree.js) is the source of truth; this file keeps the old
   import surface (VENDOR_CATEGORIES, CATEGORY_NAMES, CITY_OPTIONS, categoryMeta)
   working so existing screens don't break while the admin is reworked. */

import {
  CATEGORY_TREE,
  FIELD_TEMPLATES,
  categoryNames as treeCategoryNames,
} from "@/config/categoryTree";

/* Object keyed by category name, shaped like the old VENDOR_CATEGORIES so
   legacy consumers (vendor form, category page, CategoryIcon) keep working.
   `services` now derives from the category's subcategory names. */
export const VENDOR_CATEGORIES = Object.fromEntries(
  CATEGORY_TREE.map((c) => [
    c.name,
    {
      id: c.id,
      iconKey: c.iconKey,
      color: c.color,
      emoji: c.emoji,
      allowedTypes: c.allowedTypes,
      fieldTemplate: c.fieldTemplate,
      fields: FIELD_TEMPLATES[c.fieldTemplate] || [],
      services: c.subcategories.map((s) => s.name),
      subcategories: c.subcategories,
    },
  ]),
);

export const CATEGORY_NAMES = treeCategoryNames();

export const CITY_OPTIONS = [
  "Lahore", "Karachi", "Islamabad", "Multan", "Faisalabad", "Peshawar", "Rawalpindi",
];

/** Static schema lookup (fields + services + icon/color/types) by category name. */
export function categoryMeta(name) {
  return (
    VENDOR_CATEGORIES[name] || {
      iconKey: "celebration",
      color: "#4f46e5",
      emoji: "🎉",
      allowedTypes: ["rent", "purchase", "service"],
      fieldTemplate: "generic",
      fields: [],
      services: [],
      subcategories: [],
    }
  );
}