import BookingConfirmation from "@/components/public/BookingConfirmation";
import { buildMetadata } from "@/lib/seo";

/* A personal receipt, so it is deliberately kept out of the index. */
export async function generateMetadata({ params }) {
  const { reference } = await params;
  return buildMetadata({
    title: `Booking ${reference}`,
    description: "Your Joota Chupai booking confirmation and next steps.",
    path: `/booking/${reference}`,
    noIndex: true,
  });
}

export default async function BookingPage({ params }) {
  const { reference } = await params;
  return <BookingConfirmation reference={reference} />;
}
