export const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Slug that won't collide with any in `taken`; suffixes -2, -3, … if needed. */
export const uniqueSlug = (base, taken = []) => {
  const root = slugify(base) || "item";
  const set = new Set(taken);
  if (!set.has(root)) return root;
  let n = 2;
  while (set.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
};