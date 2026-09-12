import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinkButton from "@/components/public/LinkButton";
import SiteFooter from "@/components/public/SiteFooter";
import SiteHeader from "@/components/public/SiteHeader";
import { buildMetadata } from "@/lib/seo";
import { colors, gradients } from "@/theme/tokens";

export const metadata = buildMetadata({ title: "Page not found", path: "/404", noIndex: true });

export default function NotFound() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: colors.surface }}>
      <SiteHeader />
      <Container maxWidth="sm" component="main" sx={{ flex: 1, display: "grid", placeItems: "center", py: { xs: 8, md: 14 }, textAlign: "center" }}>
        <Box>
          <Typography
            sx={{
              fontSize: { xs: 96, md: 140 }, fontWeight: 800, lineHeight: 1,
              background: gradients.brand, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
            }}
          >
            404
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>This page has left the wedding</Typography>
          <Typography color="text.secondary" sx={{ mt: 1.5, mb: 4 }}>
            The link is broken or the listing is no longer published. Everything that is live is one click away.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "center" }}>
            <LinkButton href="/listings" size="large">Browse listings</LinkButton>
            <LinkButton href="/" variant="outlined" size="large">
              Back to home
            </LinkButton>
          </Stack>
        </Box>
      </Container>
      <SiteFooter />
    </Box>
  );
}
