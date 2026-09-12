/* Icon registry for the public site.

   Content files (publicSite.js) store an icon *key* — a plain string — instead
   of importing a component, so content stays serialisable and free of JSX. This
   is the only place a public-site icon is chosen, which keeps the visual
   language consistent. No emoji anywhere on the site. */

import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PaymentsRoundedIcon from "@mui/icons-material/PaymentsRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";

export const PUBLIC_ICONS = {
  storefront: StorefrontRoundedIcon,
  event: EventAvailableRoundedIcon,
  place: PlaceRoundedIcon,
  star: StarRateRoundedIcon,
  search: SearchRoundedIcon,
  listing: ArticleRoundedIcon,
  calendar: CalendarMonthRoundedIcon,
  check: CheckCircleRoundedIcon,
  verified: VerifiedRoundedIcon,
  price: SellRoundedIcon,
  wallet: AccountBalanceWalletRoundedIcon,
  timeline: TimelineRoundedIcon,
  support: SupportAgentRoundedIcon,
  guests: GroupsRoundedIcon,
  payments: PaymentsRoundedIcon,
  insights: InsightsRoundedIcon,
};

export const getPublicIcon = (key) => PUBLIC_ICONS[key] || CheckCircleRoundedIcon;
