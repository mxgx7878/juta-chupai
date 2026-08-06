import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import LocalFloristRoundedIcon from "@mui/icons-material/LocalFloristRounded";
import MusicNoteRoundedIcon from "@mui/icons-material/MusicNoteRounded";
import BrushRoundedIcon from "@mui/icons-material/BrushRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import CakeRoundedIcon from "@mui/icons-material/CakeRounded";
import CelebrationRoundedIcon from "@mui/icons-material/CelebrationRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import CheckroomRoundedIcon from "@mui/icons-material/CheckroomRounded";
import NightlifeRoundedIcon from "@mui/icons-material/NightlifeRounded";
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

/* Serializable icon registry — categories store an `iconKey` (string) so they
   can live in Redux and be created at runtime; we resolve to a component here. */
export const ICON_REGISTRY = {
  venue: AccountBalanceRoundedIcon,
  camera: PhotoCameraRoundedIcon,
  restaurant: RestaurantRoundedIcon,
  floral: LocalFloristRoundedIcon,
  music: MusicNoteRoundedIcon,
  brush: BrushRoundedIcon,
  car: DirectionsCarRoundedIcon,
  cake: CakeRoundedIcon,
  celebration: CelebrationRoundedIcon,
  diamond: DiamondRoundedIcon,
  attire: CheckroomRoundedIcon,
  nightlife: NightlifeRoundedIcon,
  gift: CardGiftcardRoundedIcon,
  favorite: FavoriteRoundedIcon,
};

export const ICON_OPTIONS = Object.keys(ICON_REGISTRY);

export const getCategoryIcon = (key) => ICON_REGISTRY[key] || CelebrationRoundedIcon;

export const CATEGORY_COLORS = [
  "#4f46e5", "#0ea5a4", "#f59e0b", "#7c3aed",
  "#ec4899", "#2f6fed", "#22a06b", "#d99400",
];
