import "@fontsource-variable/inter";
import "./globals.css";
import Providers from "./providers";
import { site } from "@/config/site";
import { colors } from "@/theme/tokens";

/* Site-wide defaults. Individual pages override title/description/canonical via
   buildMetadata(); anything not overridden falls back to what is set here.
   `metadataBase` is what turns every relative OG/canonical path into an absolute
   URL, so it must stay in sync with NEXT_PUBLIC_SITE_URL. */
export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: site.keywords,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "Events",
  icons: { icon: [{ url: "/logo.svg", type: "image/svg+xml" }], apple: "/logo.svg" },
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    site: site.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false, address: false },
};

export const viewport = {
  themeColor: colors.primary,
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html lang={site.language}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
