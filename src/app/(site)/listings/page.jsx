import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import ListingsExplorer from "@/components/public/ListingsExplorer";
import SectionHeading from "@/components/public/SectionHeading";
import CTABanner from "@/components/public/CTABanner";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, listingsItemListSchema, webPageSchema } from "@/lib/schema";
import { listings } from "@/data/marketplace";
import { onlyPublished, sortListings } from "@/utils/listingFilters";
import { colors } from "@/theme/tokens";

const published = sortListings(onlyPublished(listings), "featured");

export const metadata = buildMetadata({
  title: "Browse wedding venues and caterers",
  description:
    "Search verified banquet halls, marquees, outdoor lawns and wedding caterers across Pakistan. Filter by city, guest count and budget, then check live availability and book.",
  path: "/listings",
  keywords: ["banquet halls Lahore", "marquee Karachi", "wedding caterers Islamabad", "hall rates per event"],
});

export default function ListingsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Browse listings", description: metadata.description, path: "/listings", type: "CollectionPage" }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Listings", path: "/listings" }]),
          listingsItemListSchema(published, "Wedding venues and caterers"),
        ]}
      />

      <Box sx={{ bgcolor: colors.surfaceSubtle, pt: { xs: "108px", md: "140px" }, mt: { xs: "-68px", md: "-76px" }, pb: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow={`${published.length} listings live`}
            title="Find the venue or caterer that fits"
            description="Every listing shows its real rates, its capacity and its genuine availability. Filter down, open what you like and book in four clicks."
            sx={{ mb: 0 }}
          />
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <ListingsExplorer />
      </Container>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <CTABanner
          eyebrow="Not sure where to start?"
          title="Tell us the date and the headcount"
          description="Our team knows which halls hold 450 guests in Lahore on a Saturday night. Ask and we'll shortlist for you."
          primary={{ label: "Contact the team", href: "/contact" }}
          secondary={{ label: "See portal analytics", href: "/analytics" }}
        />
      </Container>
    </>
  );
}
