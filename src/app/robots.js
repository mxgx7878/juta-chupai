import { absoluteUrl } from "@/config/site";

/* The three portals hold personal data and per-account views — there is nothing
   for a crawler to index there, and booking receipts are keyed by reference. */
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/vendor", "/vendor/", "/user", "/user/", "/booking/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
