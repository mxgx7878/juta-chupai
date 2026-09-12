/* Navigation for the public website. The header, the mobile drawer and the
   footer all read this, so a new page is added in exactly one place. */

export const publicNav = [
  { label: "Listings", href: "/listings" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
  { label: "Analytics", href: "/analytics" },
  { label: "Reviews", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

/* Grouped links for the footer. */
export const footerNav = [
  {
    title: "Explore",
    links: [
      { label: "All listings", href: "/listings" },
      { label: "Wedding venues", href: "/listings?type=hall" },
      { label: "Catering", href: "/listings?type=catering" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Portal analytics", href: "/analytics" },
      { label: "Client reviews", href: "/testimonials" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Customer sign in", href: "/user/login" },
      { label: "Vendor portal", href: "/vendor/login" },
      { label: "List your business", href: "/vendor/login" },
      { label: "Admin console", href: "/admin" },
    ],
  },
];
