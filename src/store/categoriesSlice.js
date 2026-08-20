import { createSlice } from "@reduxjs/toolkit";
import { CATEGORY_TREE } from "@/config/categoryTree";

/* Categories live in Redux so admins can manage them at runtime. Seeded from the
   category tree (the source of truth). Each item carries its subcategories,
   allowedTypes, icon and colour. Kept keyed by `name` for backwards-compat with
   existing screens; a stable `id` is also present for the reworked admin. */
const seed = CATEGORY_TREE.map((c) => ({
  id: c.id,
  name: c.name,
  emoji: c.emoji,
  iconKey: c.iconKey,
  color: c.color,
  allowedTypes: c.allowedTypes,
  fieldTemplate: c.fieldTemplate,
  subcategories: c.subcategories.map((s) => ({ ...s })),
  custom: false,
}));

const byName = (items, name) => items.findIndex((c) => c.name === name);
const subSlug = (parentId, label) =>
  `${parentId}-${label.toLowerCase().replace(/&/g, "and").replace(/\//g, "-").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { items: seed },
  reducers: {
    add: (s, a) => {
      if (s.items.some((c) => c.name.toLowerCase() === a.payload.name.toLowerCase())) return;
      s.items.push({
        id: a.payload.id || subSlug("cat", a.payload.name),
        emoji: a.payload.emoji || "🎉",
        iconKey: a.payload.iconKey || "celebration",
        color: a.payload.color || "#4f46e5",
        allowedTypes: a.payload.allowedTypes || ["rent", "purchase", "service"],
        fieldTemplate: a.payload.fieldTemplate || "generic",
        subcategories: a.payload.subcategories || [],
        custom: true,
        ...a.payload,
      });
    },
    remove: (s, a) => {
      s.items = s.items.filter((c) => c.name !== a.payload);
    },
    update: (s, a) => {
      const i = byName(s.items, a.payload.name);
      if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
    },

    /* --- subcategory management (for the reworked categories admin) --- */
    addSubcategory: (s, a) => {
      const { category, name } = a.payload; // category = parent name
      const i = byName(s.items, category);
      if (i < 0 || !name?.trim()) return;
      const parent = s.items[i];
      const id = subSlug(parent.id, name);
      if (parent.subcategories.some((x) => x.id === id)) return;
      parent.subcategories.push({ id, name: name.trim() });
    },
    removeSubcategory: (s, a) => {
      const { category, subId } = a.payload;
      const i = byName(s.items, category);
      if (i < 0) return;
      s.items[i].subcategories = s.items[i].subcategories.filter((x) => x.id !== subId);
    },
    updateSubcategory: (s, a) => {
      const { category, subId, name } = a.payload;
      const i = byName(s.items, category);
      if (i < 0) return;
      const sub = s.items[i].subcategories.find((x) => x.id === subId);
      if (sub && name?.trim()) sub.name = name.trim();
    },
  },
});

export const categoriesActions = categoriesSlice.actions;
export default categoriesSlice.reducer;