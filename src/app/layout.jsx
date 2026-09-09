import "@fontsource-variable/inter";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Joota Chupai — Pakistan Wedding Marketplace",
  description: "Discover wedding venues, caterers and trusted event vendors across Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
