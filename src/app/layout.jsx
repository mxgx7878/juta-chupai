import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Juta Chupai",
  description: "Next.js application scaffold",
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
