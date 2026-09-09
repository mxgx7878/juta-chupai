import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export function accountSwitcherMenuItems({ label, items, activeId, onSelect, onLogout }) {
  return [
    <Typography key="switcher-label" variant="overline" sx={{ px: 2, color: "text.secondary" }}>{label}</Typography>,
    ...items.map((item) => (
      <MenuItem key={item.id} selected={item.id === activeId} onClick={() => onSelect(item.id)}>
        <ListItemIcon>
          {item.id === activeId ? <CheckRoundedIcon fontSize="small" /> : <SwapHorizRoundedIcon fontSize="small" />}
        </ListItemIcon>
        {item.label}
      </MenuItem>
    )),
    <Divider key="switcher-divider" />,
    <MenuItem key="switcher-logout" onClick={onLogout}>
      <ListItemIcon><LogoutRoundedIcon fontSize="small" /></ListItemIcon>
      Log out
    </MenuItem>,
  ];
}
