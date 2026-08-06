import {
  BellRing,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  CircleGauge,
  GalleryHorizontalEnd,
  LayoutGrid,
  MapPinned,
  MessageSquareText,
  Settings2,
  Shapes,
  Store,
  UsersRound,
} from "lucide-react";

export const navigationGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: CircleGauge, active: true },
      { label: "Bookings", icon: CalendarDays, badge: "12" },
      { label: "Messages", icon: MessageSquareText, badge: "8" },
    ],
  },
  {
    label: "Marketplace",
    items: [
      { label: "Customers", icon: UsersRound },
      { label: "Vendors", icon: Building2, badge: "6" },
      { label: "Listings", icon: Store },
      { label: "Categories", icon: Shapes },
      { label: "Cities", icon: MapPinned },
    ],
  },
  {
    label: "Engagement",
    items: [
      { label: "Banners", icon: GalleryHorizontalEnd },
      { label: "Notifications", icon: BellRing },
      { label: "Reports", icon: ChartNoAxesCombined },
    ],
  },
];

export const secondaryNavigation = [
  { label: "Settings", icon: Settings2 },
  { label: "View marketplace", icon: LayoutGrid },
];
