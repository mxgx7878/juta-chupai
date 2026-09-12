import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CardGrid from "@/components/public/CardGrid";
import CityCard from "@/components/public/CityCard";
import CTABanner from "@/components/public/CTABanner";
import FeatureCard from "@/components/public/FeatureCard";
import HomeHero from "@/components/public/home/HomeHero";
import LinkButton from "@/components/public/LinkButton";
import PublicListingCard from "@/components/public/PublicListingCard";
import Reveal from "@/components/public/Reveal";
import Section from "@/components/public/Section";
import SectionHeading from "@/components/public/SectionHeading";
import StatTile from "@/components/public/StatTile";
import StepsRail from "@/components/public/StepsRail";
import TestimonialCard from "@/components/public/TestimonialCard";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { listingsItemListSchema } from "@/lib/schema";
import { listings } from "@/data/marketplace";
import { bookingSteps, coverage, headlineStats, testimonials, valueProps } from "@/data/publicSite";
import { sortListings, onlyPublished } from "@/utils/listingFilters";
import { site } from "@/config/site";
import { colors } from "@/theme/tokens";

export const metadata = buildMetadata({
  title: site.tagline,
  description: site.description,
  path: "/",
  keywords: ["wedding hall booking Pakistan", "banquet hall rates", "marquee availability"],
});

/* Featured listings are resolved on the server from the seed data so the grid is
   present in the initial HTML — crawlers index it without running JavaScript. */
const featured = sortListings(onlyPublished(listings), "featured").slice(0, 6);
const liveCities = coverage.filter((c) => c.live);

export default function HomePage() {
  return (
    <>
      <JsonLd data={listingsItemListSchema(featured, "Featured listings on Joota Chupai")} />

      <HomeHero />

      {/* --------------------------------------------------------- stats -- */}
      <Section tone="default" dense>
        <CardGrid min={220} gap={2.5}>
          {headlineStats.map((stat, i) => (
            <StatTile key={stat.id} stat={stat} delay={i * 80} />
          ))}
        </CardGrid>
      </Section>

      {/* ------------------------------------------------------ featured -- */}
      <Section tone="subtle" id="featured">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" } }}>
          <SectionHeading
            eyebrow="Handpicked"
            title="Venues and caterers booking fastest"
            description="Published rates, verified owners and calendars that are genuinely up to date."
            sx={{ mb: { xs: 3, md: 4 } }}
          />
          <Reveal sx={{ mb: { xs: 3, md: 4 } }}>
            <LinkButton href="/listings" variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>
              View all listings
            </LinkButton>
          </Reveal>
        </Stack>

        <CardGrid min={300}>
          {featured.map((listing, i) => (
            <Reveal key={listing.id} delay={i * 70} sx={{ height: "100%" }}>
              <PublicListingCard listing={listing} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* --------------------------------------------------- how it works -- */}
      <Section tone="default" id="how-it-works">
        <SectionHeading
          eyebrow="Four clicks"
          title="Booking should take a minute, not a fortnight"
          description="No enquiry forms that vanish, no waiting for a callback to learn the date is gone. The calendar you see is the calendar the vendor works from."
          align="center"
          sx={{ mx: "auto" }}
        />
        <StepsRail steps={bookingSteps} />
      </Section>

      {/* ---------------------------------------------------- why choose -- */}
      <Section tone="subtle">
        <SectionHeading
          eyebrow="Why Joota Chupai"
          title="Built around the two things that go wrong"
          description="Events fail on availability and on price surprises. Everything on the portal is designed to remove both."
        />
        <CardGrid min={290}>
          {valueProps.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 70} sx={{ height: "100%" }}>
              <FeatureCard {...prop} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* ------------------------------------------------------- coverage -- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Coverage"
          title="Browse by city"
          description="Vendor density is published for every city we operate in, so you know what choice to expect before you search."
        />
        <CardGrid min={180} gap={2}>
          {liveCities.map((city, i) => (
            <Reveal key={city.city} delay={i * 60} sx={{ height: "100%" }}>
              <CityCard city={city} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* --------------------------------------------------- testimonials -- */}
      <Section tone="subtle">
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: { md: "flex-end" } }}>
          <SectionHeading
            eyebrow="Client stories"
            title="What families say after the event"
            description="Reviews are collected after the event has happened, from customers who booked through the portal."
            sx={{ mb: { xs: 3, md: 4 } }}
          />
          <Reveal sx={{ mb: { xs: 3, md: 4 } }}>
            <LinkButton href="/testimonials" variant="outlined" endIcon={<ArrowForwardRoundedIcon />}>
              Read all reviews
            </LinkButton>
          </Reveal>
        </Stack>

        <CardGrid min={300}>
          {testimonials.slice(0, 3).map((t, i) => (
            <Reveal key={t.id} delay={i * 80} sx={{ height: "100%" }}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      <Box sx={{ px: { xs: 2, md: 3 }, pb: { xs: 8, md: 12 }, bgcolor: colors.surface }}>
        <Box sx={{ maxWidth: 1200, mx: "auto" }}>
          <CTABanner />
        </Box>
      </Box>
    </>
  );
}
