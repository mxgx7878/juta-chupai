"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

export default function RowMenu({ actions = [] }) {
  const [anchor, setAnchor] = useState(null);
  const open = Boolean(anchor);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreVertRoundedIcon fontSize="small" />
      </IconButton>
      <Menu anchorEl={anchor} open={open} onClose={() => setAnchor(null)}>
        {actions.map((a) => (
          <MenuItem
            key={a.label}
            onClick={() => {
              setAnchor(null);
              a.onClick();
            }}
            sx={a.danger ? { color: "error.main" } : undefined}
          >
            {a.icon && (
              <ListItemIcon sx={{ color: a.danger ? "error.main" : "inherit" }}>
                {a.icon}
              </ListItemIcon>
            )}
            {a.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
