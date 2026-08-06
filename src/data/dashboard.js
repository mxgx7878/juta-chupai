import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

export const metrics = [
  {
    label: "Events in planning",
    value: "1,842",
    change: "+12.5%",
    up: true,
    note: "vs last month",
    icon: EventAvailableRoundedIcon,
    color: "primary",
  },
  {
    label: "Active vendors",
    value: "1,284",
    change: "+8.2%",
    up: true,
    note: "94% verified",
    icon: StorefrontRoundedIcon,
    color: "secondary",
  },
  {
    label: "Gross bookings",
    value: "PKR 8.4M",
    change: "+21.6%",
    up: true,
    note: "this month",
    icon: PaymentsRoundedIcon,
    color: "success",
  },
  {
    label: "Pending approvals",
    value: "26",
    change: "-4",
    up: false,
    note: "needs review",
    icon: PendingActionsRoundedIcon,
    color: "warning",
  },
];

export const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
export const bookingsSeries = [210, 260, 240, 320, 300, 410, 380, 470, 440, 540, 610, 720];
export const quotesSeries = [140, 180, 200, 230, 260, 300, 320, 360, 380, 420, 470, 520];

export const categoryMix = [
  { label: "Venues", value: 32 },
  { label: "Catering", value: 24 },
  { label: "Photography", value: 18 },
  { label: "Decor & Florals", value: 15 },
  { label: "Entertainment", value: 11 },
];

export const pendingVendors = [
  { name: "Nura Event Studio", category: "Event Planners", city: "Lahore", initials: "NE", rating: 4.9, submitted: "2h ago" },
  { name: "The Floral Chapter", category: "Decor & Florals", city: "Islamabad", initials: "FC", rating: 4.7, submitted: "5h ago" },
  { name: "Frame Story Films", category: "Photography", city: "Karachi", initials: "FS", rating: 4.8, submitted: "1d ago" },
  { name: "Saffron Table Co.", category: "Catering", city: "Multan", initials: "ST", rating: 4.6, submitted: "1d ago" },
];

export const recentBookings = [
  { id: "JC-2048", event: "Mehndi Night", customer: "Ayesha Khan", vendor: "Gulmohar Banquet", date: "Aug 24", amount: "PKR 420,000", status: "Confirmed" },
  { id: "JC-2047", event: "Corporate Gala", customer: "Zeeshan Ali", vendor: "The Grand Marquee", date: "Aug 22", amount: "PKR 1,150,000", status: "Pending" },
  { id: "JC-2046", event: "Birthday Soirée", customer: "Hina Raza", vendor: "Frame Story Films", date: "Aug 20", amount: "PKR 95,000", status: "Confirmed" },
  { id: "JC-2045", event: "Nikkah Ceremony", customer: "Bilal Ahmed", vendor: "Saffron Table Co.", date: "Aug 19", amount: "PKR 680,000", status: "Quote sent" },
  { id: "JC-2044", event: "Engagement", customer: "Mariam Yousuf", vendor: "The Floral Chapter", date: "Aug 18", amount: "PKR 240,000", status: "Declined" },
];

export const activityFeed = [
  { title: "New vendor application", detail: "Velvet Table Co. applied for approval", time: "4 min", color: "primary" },
  { title: "Booking confirmed", detail: "Booking #JC-2048 accepted by Gulmohar Banquet", time: "18 min", color: "success" },
  { title: "Review reported", detail: "A customer review needs moderation", time: "42 min", color: "error" },
  { title: "Featured listing purchased", detail: "Frame Story Films upgraded to Premium", time: "1 hr", color: "warning" },
  { title: "New city enabled", detail: "Multan is now live in discovery", time: "2 hr", color: "info" },
];

export const statusColor = {
  Confirmed: "success",
  Pending: "warning",
  "Quote sent": "info",
  Declined: "error",
};
