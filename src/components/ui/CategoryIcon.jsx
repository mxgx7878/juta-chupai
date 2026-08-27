"use client";

import { useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import { getCategoryIcon } from "@/config/categoryIcons";
import { getCategoryByName } from "@/config/categoryTree";

function useCat(category) {
  const cat = useSelector((s) => s.categories.items.find((c) => c.name === category));
  const fallback = getCategoryByName(category);
  return {
    iconKey: cat?.iconKey || fallback?.iconKey || "celebration",
    color: cat?.color || fallback?.color || "#4f46e5",
  };
}

/** Renders a category's MUI icon (resolved from the store, with its color). */
export default function CategoryIcon({ category, fontSize = "small", sx }) {
  const { iconKey, color } = useCat(category);
  const Icon = getCategoryIcon(iconKey);
  return <Icon fontSize={fontSize} sx={{ color, ...sx }} />;
}

/** Icon + category name, inline. */
export function CategoryLabel({ category }) {
  const { iconKey, color } = useCat(category);
  const Icon = getCategoryIcon(iconKey);
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
      <Icon fontSize="small" sx={{ color }} />
      <span>{category}</span>
    </Stack>
  );
}
