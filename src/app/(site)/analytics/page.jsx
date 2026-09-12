import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import CardGrid from "@/components/public/CardGrid";
import CTABanner from "@/components/public/CTABanner";
import GrowthChart from "@/components/public/GrowthChart";
import MeasureBars from "@/components/public/MeasureBars";
import Reveal from "@/components/public/Reveal";
import Section from "@/components/public/Section";
import SectionHeading from "@/components/public/SectionHeading";
import StatTile from "@/components/public/StatTile";
import TestimonialCard from "@/components/public/TestimonialCard";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, reviewsSchema, webPageSchema } from "@/lib/schema";
import { categoryMix, coverage, headlineStats, portalStats, satisfaction, testimonials } from "@/data/publicSite";
import { colors, gradients } from "@/theme/tokens";

export const metadata = buildMetadata({
  title: "Portal analytics",
  description:
    "Open numbers from the Joota Chupai marketplace: vendors onboarded, events successfully delivered, booking value, city coverage, satisfaction scores and customer reviews.",
  path: "/analytics",
  keywords: ["event marketplace statistics Pakistan", "wedding vendor numbers", "booking platform analytics"],
});

/* A second tier of metrics, below the four headline tiles. Same tile component,
   so the numbers all animate and align identically. */
const QUALITY_STATS = [
  { id: "gbv", label: "Lifetime booking value", value: portalStats.grossBookingValue / 1e9, decimals: 2, suffix: "B PKR", icon: "payments", note: "Paid directly to vendors" },
  { id: "couples", label: "Families served", value: portalStats.couplesServed, suffix: "+", icon: "guests", note: `${portalStats.repeatCustomerRate}% book with us again` },
  { id: "response", label: "Average vendor reply", value: portalStats.averageResponseMinutes, suffix: " min", icon: "timeline", note: "During business hours" },
  { id: "delivery", label: "Delivered as booked", value: portalStats.onTimeDeliveryRate, decimals: 1, suffix: "%", icon: "insights", note: `Dispute rate ${portalStats.disputeRate}%` },
];

export default function AnalyticsPage() {
  const shown = testimonials.slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Portal analytics", description: metadata.description, path: "/analytics" }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Analytics", path: "/analytics" }]),
          reviewsSchema(shown),
        ]}
      />

      {/* ---------------------------------------------------------- hero -- */}
      <Box sx={{ background: gradients.night, color: colors.textOnInverse, pt: { xs: "116px", md: "160px" }, mt: { xs: "-68px", md: "-76px" }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Updated monthly"
            title="The portal, in numbers"
            description="We publish how many vendors trade here, how many events actually happened and how customers rated them. If a marketplace will not show its numbers, ask why."
            inverse
            maxWidth={720}
            sx={{ mb: 0 }}
          />
        </Container>
      </Box>

      {/* -------------------------------------------------------- tiles -- */}
      <Section tone="default" dense sx={{ mt: { xs: -5, md: -7 } }}>
        <CardGrid min={220} gap={2.5}>
          {headlineStats.map((stat, i) => <StatTile key={stat.id} stat={stat} delay={i * 80} />)}
        </CardGrid>

        <Box sx={{ mt: 2.5 }}>
          <CardGrid min={220} gap={2.5}>
            {QUALITY_STATS.map((stat, i) => <StatTile key={stat.id} stat={stat} delay={i * 80} />)}
          </CardGrid>
        </Box>
      </Section>

      {/* -------------------------------------------------------- growth -- */}
      <Section tone="subtle">
        <SectionHeading
          eyebrow="Growth"
          title="Twelve months of trading"
          description="Bookings, vendor sign-ups and booking value are shown one at a time — they sit on very different scales, and stacking them on two axes would only flatter the chart."
        />
        <Reveal><GrowthChart /></Reveal>

        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, mt: 3 }}>
          <Reveal delay={80}>
            <MeasureBars
              title="Where bookings go"
              caption="Share of all bookings by category, last 12 months"
              rows={categoryMix}
            />
          </Reveal>
          <Reveal delay={160}>
            <MeasureBars
              title="Post-event survey"
              caption="Verified customers, asked two weeks after the event"
              rows={satisfaction}
            />
          </Reveal>
        </Box>
      </Section>

      {/* ------------------------------------------------------ coverage -- */}
      <Section tone="default">
        <SectionHeading
          eyebrow="Coverage"
          title="City by city"
          description="A city goes live only once it has enough vendors for a customer to have a genuine choice. Cities still building supply are listed as onboarding."
        />
        <Reveal>
          <Card sx={{ overflow: "hidden" }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>City</TableCell>
                    <TableCell align="right">Vendors</TableCell>
                    <TableCell align="right">Events delivered</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {coverage.map((row) => (
                    <TableRow key={row.city}>
                      <TableCell sx={{ fontWeight: 700 }}>{row.city}</TableCell>
                      <TableCell align="right">{row.vendors.toLocaleString("en-PK")}</TableCell>
                      <TableCell align="right">{row.events.toLocaleString("en-PK")}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={row.live ? "Live" : "Onboarding"}
                          sx={{
                            bgcolor: row.live ? colors.successSoft : colors.warningSoft,
                            color: row.live ? colors.success : colors.warning,
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Reveal>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
          Figures cover the trailing twelve months to the end of last month and include only events that completed.
        </Typography>
      </Section>

      {/* -------------------------------------------------- testimonials -- */}
      <Section tone="subtle">
        <SectionHeading
          eyebrow="Behind the numbers"
          title="Clients who lived through the booking"
          description="Every review below belongs to a completed booking made on this portal."
        />
        <CardGrid min={300}>
          {shown.map((t, i) => (
            <Reveal key={t.id} delay={i * 80} sx={{ height: "100%" }}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <CTABanner
          eyebrow="Join the numbers"
          title="Add your event to next month's figures"
          description="Browse verified venues and caterers, check the date you want and confirm in four clicks."
          primary={{ label: "Browse listings", href: "/listings" }}
          secondary={{ label: "Read client reviews", href: "/testimonials" }}
        />
      </Container>
    </>
  );
}
