import { notFound } from "next/navigation";
import ListingDetailView from "@/components/public/ListingDetailView";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, listingSchema, venuePlaceSchema } from "@/lib/schema";
import { listings } from "@/data/marketplace";
import { vendors } from "@/data/screens";
import { VERTICALS } from "@/config/categoryTree";
import { priceLabel } from "@/utils/listing";

/* Resolved from the seed data rather than the Redux store: metadata and JSON-LD
   are generated on the server, before any client state exists. */
const findListing = (id) => listings.find((l) => l.id === id && l.status === "Published");
const findVendor = (vendorId) => vendors.find((v) => v.id === vendorId) || null;

/** Pre-renders every published listing at build time, so each has a static, crawlable URL. */
export function generateStaticParams() {
  return listings.filter((l) => l.status === "Published").map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const listing = findListing(id);
  if (!listing) return buildMetadata({ title: "Listing not found", path: `/listings/${id}`, noIndex: true });

  const vendor = findVendor(listing.vendorId);
  const isCatering = listing.vertical === VERTICALS.CATERING;
  const price = priceLabel(listing);
  const capacity = isCatering
    ? `${listing.catering?.minGuests}–${listing.catering?.maxGuests} guests`
    : `up to ${listing.hall?.capacity} guests`;

  return buildMetadata({
    title: `${listing.title} — ${isCatering ? "catering" : "wedding venue"} in ${listing.city}`,
    description: `${listing.description} ${capacity}. From ${price.value}${price.unit} with ${vendor?.name || "a verified vendor"}. Check live availability and book in four clicks.`,
    path: `/listings/${listing.id}`,
    type: "article",
    keywords: [
      `${listing.title} ${listing.city}`,
      `${isCatering ? "caterer" : "wedding hall"} in ${listing.city}`,
      vendor?.name,
    ].filter(Boolean),
  });
}

export default async function ListingPage({ params }) {
  const { id } = await params;
  const listing = findListing(id);
  if (!listing) notFound();

  const vendor = findVendor(listing.vendorId);

  return (
    <>
      <JsonLd
        data={[
          listingSchema(listing, vendor),
          venuePlaceSchema(listing, vendor),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Listings", path: "/listings" },
            { name: listing.title, path: `/listings/${listing.id}` },
          ]),
        ]}
      />
      <ListingDetailView listing={listing} vendor={vendor} />
    </>
  );
}
