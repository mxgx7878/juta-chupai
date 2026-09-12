import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import ViewCarouselRoundedIcon from "@mui/icons-material/ViewCarouselRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";

/* Listings, Inquiries and Bookings return here once the hall and catering
   verticals are built. */
export const navigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: SpaceDashboardRoundedIcon, href: "/admin" },
      { label: "Calculator", icon: CalculateRoundedIcon, href: "/admin/calculator" },
      { label: "Messages", icon: ChatRoundedIcon, href: "/admin/messages" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { label: "Customers", icon: GroupRoundedIcon, href: "/admin/customers" },
      { label: "Vendors", icon: StorefrontRoundedIcon, href: "/admin/vendors" },
      { label: "Categories", icon: CategoryRoundedIcon, href: "/admin/categories" },
      { label: "Cities", icon: PlaceRoundedIcon, href: "/admin/cities" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Banners", icon: ViewCarouselRoundedIcon, href: "/admin/banners" },
      { label: "Notifications", icon: NotificationsRoundedIcon, href: "/admin/notifications" },
      { label: "Reports", icon: InsightsRoundedIcon, href: "/admin/reports" },
    ],
  },
];

export const secondaryNavigation = [
  { label: "Settings", icon: SettingsRoundedIcon, href: "/admin/settings" },
];
