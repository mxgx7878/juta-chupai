import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CardGrid from "@/components/public/CardGrid";
import CTABanner from "@/components/public/CTABanner";
import FaqAccordion from "@/components/public/FaqAccordion";
import FeatureCard from "@/components/public/FeatureCard";
import LinkButton from "@/components/public/LinkButton";
import MilestoneTimeline from "@/components/public/MilestoneTimeline";
import Reveal from "@/components/public/Reveal";
import Section from "@/components/public/Section";
import SectionHeading from "@/components/public/SectionHeading";
import StatTile from "@/components/public/StatTile";
import TestimonialCard from "@/components/public/TestimonialCard";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { faqs, headlineStats, milestones, valueProps, vendorBenefits, vendorVoices } from "@/data/publicSite";
import { site } from "@/config/site";
import { colors, gradients } from "@/theme/tokens";

export const metadata = buildMetadata({
  title: "About the portal",
  description:
    "How Joota Chupai works: verified vendors, live availability, published pricing and a four-click booking flow for wedding venues and caterers across Pakistan.",
  path: "/about",
  keywords: ["about Joota Chupai", "how event marketplace works", "verified wedding vendors Pakistan"],
});

/* What the portal does for each side of the marketplace — one list, one shape. */
const CUSTOMER_PROMISES = [
  "Search by city, guest count and budget in one place",
  "See day and night rates before you enquire",
  "Pick a date from the vendor's real calendar",
  "Keep every booking, payment and note on one trail",
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "About the portal", description: metadata.description, path: "/about", type: "AboutPage" }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
          faqSchema(faqs),
        ]}
      />

      {/* ---------------------------------------------------------- hero -- */}
      <Box sx={{ background: gradients.night, color: colors.textOnInverse, pt: { xs: "116px", md: "160px" }, mt: { xs: "-68px", md: "-76px" }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow={`Since ${site.founded}`}
            title="An event marketplace that behaves like a booking system"
            description="Joota Chupai started because booking a hall in Pakistan meant six phone calls, three visits and a price that changed at the end. We put the calendar, the rates and the paperwork in one place — for customers and for the vendors who serve them."
            inverse
            maxWidth={720}
            sx={{ mb: 0 }}
          />
        </Container>
      </Box>

      {/* --------------------------------------------------------- stats -- */}
      <Section tone="default" dense sx={{ mt: { xs: -5, md: -7 } }}>
        <CardGrid min={220} gap={2.5}>
          {headlineStats.map((stat, i) => <StatTile key={stat.id} stat={stat} delay={i * 80} />)}
        </CardGrid>
      </Section>

      {/* --------------------------------------------------- two audiences -- */}
      <Section tone="subtle">
        <Box sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Reveal>
            <Card sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography variant="overline" sx={{ color: colors.primary }}>For customers</Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 2, fontSize: { xs: 24, md: 28 } }}>Plan the whole event without a phone call</Typography>
              <Stack spacing={1.5}>
                {CUSTOMER_PROMISES.map((line) => (
                  <Stack key={line} direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                    <CheckCircleRoundedIcon sx={{ fontSize: 19, color: colors.success, mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{line}</Typography>
                  </Stack>
                ))}
              </Stack>
              <LinkButton href="/listings" sx={{ mt: 3 }}>Browse listings</LinkButton>
            </Card>
          </Reveal>

          <Reveal delay={110}>
            <Card sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography variant="overline" sx={{ color: colors.secondaryDark }}>For vendors</Typography>
              <Typography variant="h4" sx={{ mt: 1, mb: 2, fontSize: { xs: 24, md: 28 } }}>Fill the calendar, stop chasing quotes</Typography>
              <Stack spacing={2}>
                {vendorBenefits.map((b) => (
                  <Box key={b.title}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{b.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{b.detail}</Typography>
                  </Box>
                ))}
              </Stack>
              <LinkButton href="/vendor/login" variant="outlined" sx={{ mt: 3 }}>
                Open the vendor portal
              </LinkButton>
            </Card>
          </Reveal>
        </Box>
      </Section>

      {/* ------------------------------------------------------ standards -- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Our standards"
          title="What every listing has to satisfy"
          description="A listing goes live only once it can answer the questions a customer would otherwise have to ask on the phone."
        />
        <CardGrid min={290}>
          {valueProps.map((prop, i) => (
            <Reveal key={prop.title} delay={i * 70} sx={{ height: "100%" }}>
              <FeatureCard {...prop} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* ----------------------------------------------------- milestones -- */}
      <Section tone="subtle">
        <Box sx={{ display: "grid", gap: { xs: 4, md: 8 }, gridTemplateColumns: { xs: "1fr", md: "0.9fr 1.1fr" } }}>
          <SectionHeading
            eyebrow="Our story"
            title="Six years of taking friction out of event booking"
            description="Each step below removed one reason a family had to leave the portal and pick up the phone."
            sx={{ mb: 0 }}
          />
          <MilestoneTimeline milestones={milestones} />
        </Box>
      </Section>

      {/* -------------------------------------------------- vendor voices -- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="From our vendors"
          title="The other side of the marketplace"
          description="Halls and caterers who run their week from the portal."
        />
        <CardGrid min={320}>
          {vendorVoices.map((v, i) => (
            <Reveal key={v.id} delay={i * 90} sx={{ height: "100%" }}>
              <TestimonialCard testimonial={v} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      {/* ----------------------------------------------------------- faq -- */}
      <Section tone="subtle">
        <Box sx={{ display: "grid", gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "0.8fr 1.2fr" } }}>
          <SectionHeading
            eyebrow="Questions"
            title="Everything people ask before their first booking"
            description="Still unsure? The support team answers in minutes during business hours."
            sx={{ mb: 0 }}
          />
          <FaqAccordion faqs={faqs} />
        </Box>
      </Section>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <CTABanner
          eyebrow="Two ways in"
          title="Book an event, or put your venue in front of thousands"
          description="Customers browse and book for free. Vendors list for free and pay only on completed bookings."
          primary={{ label: "Browse listings", href: "/listings" }}
          secondary={{ label: "List your business", href: "/vendor/login" }}
        />
      </Container>
    </>
  );
}
