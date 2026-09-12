import { site } from "@/config/site";
import { colors } from "@/theme/tokens";

export default function manifest() {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.shortDescription,
    start_url: "/",
    display: "standalone",
    background_color: colors.surface,
    theme_color: colors.primary,
    lang: site.language,
    categories: ["events", "shopping", "lifestyle"],
    icons: [{ src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
