/* Which vertical a vendor (or a category name) belongs to.

   Categories are editable at runtime, so the store is the first source of
   truth; the static tree is the fallback. */

import { VERTICALS, getCategoryByName } from "@/config/categoryTree";

export function verticalOfCategory(categoryName, storeCategories) {
  const fromStore = storeCategories?.find((c) => c.name === categoryName);
  return fromStore?.vertical || getCategoryByName(categoryName)?.vertical || VERTICALS.GENERIC;
}

export const vendorVertical = (vendor, storeCategories) =>
  verticalOfCategory(vendor?.category, storeCategories);

/* Wording that changes per vertical, so pages don't hard-code "hall". */
export const VERTICAL_COPY = {
  hall: {
    listingNoun: "Hall",
    listingNounPlural: "Halls",
    navLabel: "My Halls",
    addLabel: "Add hall",
    emptyLabel: "You haven't added a hall yet.",
    hasCalendar: true,
    blocksDates: true,
  },
  catering: {
    listingNoun: "Package",
    listingNounPlural: "Packages",
    navLabel: "My Packages",
    addLabel: "Add package",
    emptyLabel: "You haven't added a catering package yet.",
    hasCalendar: true,
    blocksDates: false,
  },
  generic: {
    listingNoun: "Listing",
    listingNounPlural: "Listings",
    navLabel: "My Listings",
    addLabel: "Add listing",
    emptyLabel: "Listings aren't enabled for your category yet.",
    hasCalendar: false,
    blocksDates: false,
  },
};

export const copyFor = (vertical) => VERTICAL_COPY[vertical] || VERTICAL_COPY.generic;
