import { createSlice } from "@reduxjs/toolkit";
import { VENDOR_CATEGORIES } from "@/config/vendorCategories";

/* Categories live here so admins can create new ones at runtime. Seeded from the
   base schema; new categories flow straight into the vendor form dropdown. */
const seed = Object.entries(VENDOR_CATEGORIES).map(([name, m]) => ({
  name,
  iconKey: m.iconKey,
  color: m.color,
  services: m.services,
  custom: false,
}));

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: seed },
  reducers: {
    add: (s, a) => {
      if (s.items.some((c) => c.name.toLowerCase() === a.payload.name.toLowerCase())) return;
      s.items.push({ custom: true, services: [], ...a.payload });
    },
    remove: (s, a) => {
      s.items = s.items.filter((c) => c.name !== a.payload);
    },
    update: (s, a) => {
      const i = s.items.findIndex((c) => c.name === a.payload.name);
      if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;
