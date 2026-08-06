import {
  Banknote,
  Building2,
  CalendarCheck2,
  UsersRound,
} from "lucide-react";

export const dashboardStats = [
  {
    label: "Total customers",
    value: "12,840",
    change: "+12.5%",
    note: "vs last month",
    icon: UsersRound,
    tone: "primary",
  },
  {
    label: "Active vendors",
    value: "1,284",
    change: "+8.2%",
    note: "94% verified",
    icon: Building2,
    tone: "secondary",
  },
  {
    label: "Live bookings",
    value: "327",
    change: "+18.4%",
    note: "across 14 cities",
    icon: CalendarCheck2,
    tone: "info",
  },
  {
    label: "Gross value",
    value: "PKR 8.4M",
    change: "+21.6%",
    note: "this month",
    icon: Banknote,
    tone: "accent",
  },
];

export const bookingTrend = [
  { day: "Mon", value: 46 },
  { day: "Tue", value: 62 },
  { day: "Wed", value: 52 },
  { day: "Thu", value: 76 },
  { day: "Fri", value: 68 },
  { day: "Sat", value: 94 },
  { day: "Sun", value: 82 },
];

export const pendingVendors = [
  { name: "Nura Event Studio", category: "Event planners", city: "Lahore", initials: "NE", tone: "primary" },
  { name: "The Floral Chapter", category: "Decor & flowers", city: "Islamabad", initials: "FC", tone: "secondary" },
  { name: "Frame Story Films", category: "Photography", city: "Karachi", initials: "FS", tone: "accent" },
];

export const activityFeed = [
  { title: "New vendor application", detail: "Velvet Table Co. applied for approval", time: "4 min", tone: "primary" },
  { title: "Booking confirmed", detail: "Booking #JC-2048 was accepted", time: "18 min", tone: "success" },
  { title: "Review reported", detail: "A customer review needs moderation", time: "42 min", tone: "danger" },
  { title: "New city enabled", detail: "Multan is now available in discovery", time: "1 hr", tone: "accent" },
];

export const categoryMix = [
  { label: "Venues", value: 34, color: "var(--primary)" },
  { label: "Catering", value: 26, color: "var(--secondary)" },
  { label: "Photography", value: 22, color: "var(--accent)" },
  { label: "Other", value: 18, color: "var(--info)" },
];
