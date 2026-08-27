"use client";

import HallListingFormDialog from "./HallListingFormDialog";
import CateringListingFormDialog from "./CateringListingFormDialog";
import { VERTICALS } from "@/config/categoryTree";

/* One entry point for every listing form. The vendor's vertical decides which
   shape opens, so pages don't branch on it themselves. */
export default function ListingFormDialog({ vertical, ...props }) {
  const v = props.listing?.vertical || vertical;
  if (v === VERTICALS.CATERING) return <CateringListingFormDialog {...props} />;
  if (v === VERTICALS.HALL) return <HallListingFormDialog {...props} />;
  return null;
}
