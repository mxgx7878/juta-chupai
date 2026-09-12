# Joota Chupai — event marketplace

A Next.js (App Router) marketplace for wedding venues and catering in Pakistan.
It contains a **public website** plus three signed-in portals, all rendering
through one MUI theme that is generated from a single design-token file.

## Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Set `NEXT_PUBLIC_SITE_URL` in production — canonical URLs, Open Graph tags,
`sitemap.xml`, `robots.txt` and JSON-LD are all built from it.

## Routes

| Area | Route | Notes |
|------|-------|-------|
| Public site | `/` | Landing page, hero search, featured listings, how it works, reviews |
| | `/listings` | Browse, filter and sort every published listing |
| | `/listings/[id]` | Listing detail + four-click booking (statically pre-rendered) |
| | `/about` | About the portal, standards, history, FAQ |
| | `/analytics` | Published portal numbers, growth charts, coverage |
| | `/testimonials` | Client and vendor reviews |
| | `/contact` | Contact channels and message form |
| | `/booking/[reference]` | Booking receipt (noindex) |
| Customer portal | `/user/...` | Signed-in browse, budget planner, inquiries |
| Vendor portal | `/vendor/...` | Listings, calendar, bookings, inquiries |
| Admin console | `/admin/...` | Marketplace administration |

Only the public site is indexable; `robots.js` disallows the three portals.

## Booking in four clicks

1. **Book** on a listing card → opens the listing with the wizard already open
2. pick a free date/slot (or a catering package) → auto-advances
3. **Continue** once name, phone, email and guest count are in
4. **Confirm booking** → booking reference, receipt page, vendor notified

Availability is derived from confirmed bookings (`utils/availability.js`), so a
slot that is taken can never be selected. Tapping a free slot on the listing
calendar jumps straight into step 2.

## Changing the colour scheme

Every colour, radius, shadow and animation timing is defined **once** in
`src/theme/tokens.js`. Change a value there and it flows to:

- the MUI theme (`src/theme/theme.js`) — every component, every `sx` prop
- the `--jc-*` CSS custom properties injected in `src/app/providers.jsx`
- charts, the social share image, the web manifest and `theme-color`

Nothing else in the codebase hard-codes a brand colour.

## SEO

- `src/lib/seo.js` — `buildMetadata()`; every page calls it for title,
  description, canonical, Open Graph, Twitter card and robots directives
- `src/lib/schema.js` — JSON-LD builders (Organization, WebSite, Product,
  EventVenue, BreadcrumbList, FAQPage, Review, ItemList)
- `src/app/sitemap.js`, `src/app/robots.js`, `src/app/manifest.js`
- `src/app/opengraph-image.jsx` — social card generated from the brand tokens

## Structure

```text
src/
├── app/
│   ├── (site)/             # public website (own header/footer shell)
│   ├── admin/              # admin console
│   ├── user/               # customer portal
│   ├── vendor/             # vendor portal
│   ├── sitemap.js robots.js manifest.js opengraph-image.jsx
│   └── layout.jsx providers.jsx
├── components/
│   ├── public/             # public-site components (+ home/ hero pieces)
│   ├── booking/ listing/ user/ vendor/ dashboard/ layout/ ui/
│   └── seo/JsonLd.jsx
├── config/                 # site facts, navigation, categories, icons
├── data/                   # seed + editorial content (publicSite.js)
├── hooks/                  # useInView, useCountUp
├── lib/                    # seo.js, schema.js
├── store/                  # Redux Toolkit slices (demo data, no API yet)
├── theme/                  # tokens.js (single source of truth) + theme.js
└── utils/                  # booking, availability, listing filters, dates
```

Data still comes from `src/data/*` through Redux; there is no API layer yet, so
bookings made on the public site live in memory for the session.
