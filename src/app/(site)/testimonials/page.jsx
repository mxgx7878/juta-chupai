import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardGrid from "@/components/public/CardGrid";
import CTABanner from "@/components/public/CTABanner";
import MeasureBars from "@/components/public/MeasureBars";
import Reveal from "@/components/public/Reveal";
import Section from "@/components/public/Section";
import SectionHeading from "@/components/public/SectionHeading";
import TestimonialCard from "@/components/public/TestimonialCard";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, reviewsSchema, webPageSchema } from "@/lib/schema";
import { portalStats, satisfaction, testimonials, vendorVoices } from "@/data/publicSite";
import { colors, gradients } from "@/theme/tokens";

export const metadata = buildMetadata({
  title: "Client testimonials",
  description:
    "Verified reviews from families and companies who booked wedding venues and catering through Joota Chupai — collected after the event, from completed bookings only.",
  path: "/testimonials",
  keywords: ["Joota Chupai reviews", "wedding venue reviews Pakistan", "catering reviews"],
});

/* Star distribution is derived from the reviews themselves so the summary can
   never contradict the cards below it. */
const distribution = [5, 4, 3, 2, 1].map((star) => {
  const count = testimonials.filter((t) => Math.round(t.rating) === star).length;
  return { label: `${star} star${star === 1 ? "" : "s"}`, value: Math.round((count / testimonials.length) * 100) };
});

export default function TestimonialsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Client testimonials", description: metadata.description, path: "/testimonials" }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Testimonials", path: "/testimonials" }]),
          reviewsSchema(testimonials),
        ]}
      />

      <Box sx={{ background: gradients.night, color: colors.textOnInverse, pt: { xs: "116px", md: "160px" }, mt: { xs: "-68px", md: "-76px" }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="Verified reviews"
            title="The event happened. Here's what they said."
            description="We only ask for a review once a booking is marked complete by both sides, so nothing here is from someone who merely browsed."
            inverse
            maxWidth={720}
            sx={{ mb: 0 }}
          />
        </Container>
      </Box>

      <Section tone="default" dense sx={{ mt: { xs: -5, md: -7 } }}>
        <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          <Reveal>
            <Card sx={{ p: { xs: 3, md: 4 }, height: "100%" }}>
              <Typography variant="overline" color="text.secondary">Overall rating</Typography>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center", mt: 1 }}>
                <Typography sx={{ fontSize: 56, fontWeight: 800, lineHeight: 1, color: colors.primary }}>
                  {portalStats.averageRating}
                </Typography>
                <Box>
                  <Rating value={portalStats.averageRating} precision={0.1} readOnly sx={{ color: colors.secondary }} />
                  <Typography variant="body2" color="text.secondary">
                    {portalStats.reviewCount.toLocaleString("en-PK")} reviews across {portalStats.eventsDelivered.toLocaleString("en-PK")} delivered events
                  </Typography>
                </Box>
              </Stack>
              <Box sx={{ mt: 3 }}>
                <MeasureBars rows={distribution} caption="Share of reviews by star rating" />
              </Box>
            </Card>
          </Reveal>

          <Reveal delay={110}>
            <MeasureBars
              title="What they rated us on"
              caption="Post-event survey, verified customers"
              rows={satisfaction}
            />
          </Reveal>
        </Box>
      </Section>

      <Section tone="subtle">
        <SectionHeading eyebrow="Customers" title="From the people who booked" />
        <CardGrid min={320}>
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={Math.min(i, 6) * 70} sx={{ height: "100%" }}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      <Section tone="default">
        <SectionHeading eyebrow="Vendors" title="From the halls and caterers" />
        <CardGrid min={320}>
          {vendorVoices.map((t, i) => (
            <Reveal key={t.id} delay={i * 80} sx={{ height: "100%" }}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </CardGrid>
      </Section>

      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 12 } }}>
        <CTABanner
          eyebrow="Your turn"
          title="Book the venue, then tell us how it went"
          description="Four clicks to a confirmed date. A short review two weeks after the event, if you feel like it."
          primary={{ label: "Browse listings", href: "/listings" }}
          secondary={{ label: "See the numbers", href: "/analytics" }}
        />
      </Container>
    </>
  );
}
