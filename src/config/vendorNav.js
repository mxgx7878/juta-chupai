import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import { copyFor } from "@/utils/vertical";

/* The label of the listings item follows the vendor's vertical ("My Halls" vs
   "My Packages"), so the nav is built per vendor rather than being a constant. */
export function vendorNavFor(vertical) {
  const copy = copyFor(vertical);
  return [
    { label: "Dashboard", icon: SpaceDashboardRoundedIcon, href: "/vendor" },
    { label: copy.navLabel, icon: Inventory2RoundedIcon, href: "/vendor/listings" },
    { label: "Inquiries", icon: QuestionAnswerRoundedIcon, href: "/vendor/inquiries" },
    { label: "Bookings", icon: EventAvailableRoundedIcon, href: "/vendor/bookings" },
    { label: "Calendar", icon: CalendarMonthRoundedIcon, href: "/vendor/calendar" },
    { label: "Profile", icon: StorefrontRoundedIcon, href: "/vendor/profile" },
  ];
}

/* Fallback for anything importing the old constant. */
export const vendorNav = vendorNavFor("hall");
