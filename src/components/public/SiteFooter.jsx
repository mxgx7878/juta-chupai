"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import CallRoundedIcon from "@mui/icons-material/CallRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import BrandMark from "./BrandMark";
import { footerNav } from "@/config/publicNav";
import { site } from "@/config/site";
import { colors, gradients, motion, withAlpha } from "@/theme/tokens";

const SOCIALS = [
  { href: site.social.facebook, icon: FacebookRoundedIcon, label: "Facebook" },
  { href: site.social.instagram, icon: InstagramIcon, label: "Instagram" },
  { href: site.social.linkedin, icon: LinkedInIcon, label: "LinkedIn" },
  { href: site.social.youtube, icon: YouTubeIcon, label: "YouTube" },
];

export default function SiteFooter() {
  const address = site.contact.address;

  return (
    <Box component="footer" sx={{ background: gradients.night, color: colors.textOnInverse, pt: { xs: 6, md: 9 }, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "1.4fr repeat(3, 1fr)" } }}>
          <Stack spacing={2.5}>
            <BrandMark inverse />
            <Typography variant="body2" sx={{ color: colors.textOnInverseMuted, lineHeight: 1.8, maxWidth: 320 }}>
              {site.shortDescription}
            </Typography>

            <Stack spacing={1}>
              <ContactLine icon={MailOutlineRoundedIcon} href={`mailto:${site.contact.email}`}>{site.contact.email}</ContactLine>
              <ContactLine icon={CallRoundedIcon} href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}>{site.contact.phone}</ContactLine>
              <ContactLine icon={PlaceRoundedIcon}>{`${address.city}, ${address.countryName}`}</ContactLine>
            </Stack>

            <Stack direction="row" spacing={0.5}>
              {SOCIALS.map((s) => (
                <IconButton
                  key={s.label}
                  component="a"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  size="small"
                  sx={{
                    color: colors.textOnInverseMuted,
                    border: "1px solid",
                    borderColor: withAlpha(colors.surface, 0.14),
                    transition: `all ${motion.base} ${motion.ease}`,
                    "&:hover": { color: colors.textOnInverse, borderColor: colors.secondary, transform: "translateY(-2px)" },
                  }}
                >
                  <s.icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Stack>

          {footerNav.map((group) => (
            <Stack key={group.title} spacing={1.5}>
              <Typography variant="overline" sx={{ fontSize: 11, color: colors.secondaryLight }}>{group.title}</Typography>
              <Stack spacing={1.25}>
                {group.links.map((l) => (
                  <Typography
                    key={`${group.title}-${l.label}`}
                    component={Link}
                    href={l.href}
                    variant="body2"
                    sx={{
                      color: colors.textOnInverseMuted,
                      textDecoration: "none",
                      width: "fit-content",
                      transition: `color ${motion.fast} ${motion.ease}, transform ${motion.fast} ${motion.ease}`,
                      "&:hover": { color: colors.textOnInverse, transform: "translateX(3px)" },
                    }}
                  >
                    {l.label}
                  </Typography>
                ))}
              </Stack>
            </Stack>
          ))}
        </Box>

        <Divider sx={{ my: 4, borderColor: withAlpha(colors.surface, 0.12) }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}>
          <Typography variant="caption" sx={{ color: colors.textOnInverseMuted }}>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textOnInverseMuted }}>
            Built for Pakistan&apos;s event industry · {site.contact.hours}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

function ContactLine({ icon: Icon, href, children }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      {...(href ? { component: "a", href } : {})}
      sx={{ alignItems: "center", color: colors.textOnInverseMuted, textDecoration: "none", "&:hover": { color: colors.textOnInverse } }}
    >
      <Icon sx={{ fontSize: 16 }} />
      <Typography variant="body2">{children}</Typography>
    </Stack>
  );
}
