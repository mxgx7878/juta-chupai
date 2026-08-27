import "@fontsource-variable/inter";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Joota Chupai — Admin",
  description: "Event marketplace administration dashboard",
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
