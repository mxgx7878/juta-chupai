import Box from "@mui/material/Box";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";
import GlobalSnackbar from "@/components/ui/GlobalSnackbar";
import JsonLd from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { colors } from "@/theme/tokens";

/* Shell for every public page.

   Organization and WebSite JSON-LD are emitted once here rather than per page —
   they describe the site itself, so repeating them on each route would only add
   weight. Page-specific structured data (listings, breadcrumbs, FAQs, reviews) is
   added by the individual pages. */
export default function PublicLayout({ children }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: colors.surface }}>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <SiteHeader />
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      <SiteFooter />
      <GlobalSnackbar />
    </Box>
  );
}
