import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

export const vendorNav = [
  { label: "Dashboard", icon: SpaceDashboardRoundedIcon, href: "/vendor" },
  { label: "My Listings", icon: Inventory2RoundedIcon, href: "/vendor/listings" },
  { label: "Inquiries", icon: QuestionAnswerRoundedIcon, href: "/vendor/inquiries" },
  { label: "Calendar", icon: CalendarMonthRoundedIcon, href: "/vendor/calendar" },
  { label: "Profile", icon: StorefrontRoundedIcon, href: "/vendor/profile" },
];