import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ContactForm from "@/components/public/ContactForm";
import IconBadge from "@/components/public/IconBadge";
import Reveal from "@/components/public/Reveal";
import Section from "@/components/public/Section";
import SectionHeading from "@/components/public/SectionHeading";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { site } from "@/config/site";
import { colors, gradients } from "@/theme/tokens";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Talk to the Joota Chupai team about a venue, an existing booking or listing your business. Email, phone and office address for our Lahore head office.",
  path: "/contact",
  keywords: ["contact Joota Chupai", "event marketplace support Pakistan"],
});

const address = site.contact.address;

const CHANNELS = [
  { icon: MailOutlineRoundedIcon, label: "Email us", value: site.contact.email, href: `mailto:${site.contact.email}`, note: "Replies within one business day" },
  { icon: CallRoundedIcon, label: "Call us", value: site.contact.phone, href: `tel:${site.contact.phone.replace(/[^+\d]/g, "")}`, note: "Fastest route for a date that is close" },
  { icon: ScheduleRoundedIcon, label: "Office hours", value: site.contact.hours, note: "Closed on public holidays" },
  { icon: PlaceRoundedIcon, label: "Head office", value: `${address.street}, ${address.city}`, note: `${address.city}, ${address.countryName}` },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: "Contact us", description: metadata.description, path: "/contact", type: "ContactPage" }),
          breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]),
        ]}
      />

      <Box sx={{ background: gradients.night, color: colors.textOnInverse, pt: { xs: "116px", md: "160px" }, mt: { xs: "-68px", md: "-76px" }, pb: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <SectionHeading
            eyebrow="We answer"
            title="Talk to a person, not a ticket queue"
            description="Whether you are three days from a mehndi or three months from a walima, the support team can shortlist venues, chase a vendor or sort out a booking."
            inverse
            maxWidth={700}
            sx={{ mb: 0 }}
          />
        </Container>
      </Box>

      <Section tone="default" sx={{ mt: { xs: -5, md: -7 } }}>
        <Box sx={{ display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "1fr 1.2fr" }, alignItems: "start" }}>
          <Stack spacing={2.5}>
            {CHANNELS.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 80}>
                <Card sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2}>
                    <IconBadge icon={channel.icon} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="overline" color="text.secondary">{channel.label}</Typography>
                      <Typography
                        {...(channel.href ? { component: "a", href: channel.href } : {})}
                        sx={{ fontWeight: 700, display: "block", color: "text.primary", textDecoration: "none", wordBreak: "break-word", "&:hover": { color: colors.primary } }}
                      >
                        {channel.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">{channel.note}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Reveal>
            ))}
          </Stack>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </Box>
      </Section>
    </>
  );
}
