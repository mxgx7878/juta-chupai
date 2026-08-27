import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";

export const userNav = [
  { label: "Home", icon: HomeRoundedIcon, href: "/user" },
  { label: "Browse", icon: SearchRoundedIcon, href: "/user/browse" },
  { label: "Budget planner", icon: CalculateRoundedIcon, href: "/user/budget" },
  { label: "My inquiries", icon: QuestionAnswerRoundedIcon, href: "/user/inquiries" },
];
