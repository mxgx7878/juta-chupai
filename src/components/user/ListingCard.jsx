"use client";

import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import { getCategory, VERTICALS } from "@/config/categoryTree";
import { getCategoryIcon } from "@/config/categoryIcons";
import { priceLabel, capacityLabel, facts } from "@/utils/listing";

export default function ListingCard({ listing }) {
  const router = useRouter();
  const cat = getCategory(listing.categoryId);
  const Icon = getCategoryIcon(cat?.iconKey);
  const color = cat?.color || "#4f46e5";
  const price = priceLabel(listing);
  const cap = capacityLabel(listing);
  const isCatering = listing.vertical === VERTICALS.CATERING;

  return (
    <Card
      onClick={() => router.push(`/user/listing/${listing.id}`)}
      sx={{ overflow: "hidden", cursor: "pointer", transition: "0.15s", display: "flex", flexDirection: "column", "&:hover": { boxShadow: 5, transform: "translateY(-2px)" } }}
    >
      <Box sx={{ height: 120, position: "relative", background: `linear-gradient(135deg, ${alpha(color, 0.85)}, ${color})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon sx={{ fontSize: 42, color: "#fff", opacity: 0.9 }} />
        <Chip
          size="small"
          label={isCatering ? "Catering" : "Venue"}
          sx={{ position: "absolute", top: 10, left: 10, fontWeight: 700, bgcolor: "rgba(255,255,255,0.92)" }}
        />
        {listing.featured && (
          <Chip size="small" label="Featured" color="warning" sx={{ position: "absolute", top: 10, right: 10, fontWeight: 700 }} />
        )}
      </Box>

      <Box sx={{ p: 2.25, flex: 1, display: "flex", flexDirection: "column" }}>
        <Typography variant="subtitle1" fontWeight={800} noWrap>{listing.title}</Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "text.secondary", mt: 0.25 }}>
          <PlaceRoundedIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">{listing.city}</Typography>
          {cap && (
            <>
              <GroupsRoundedIcon sx={{ fontSize: 14, ml: 0.75 }} />
              <Typography variant="caption">{cap}</Typography>
            </>
          )}
        </Stack>

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mt: 1.25 }}>
          {facts(listing).slice(0, 3).map((f) => (
            <Chip key={f} label={f} size="small" sx={{ height: 22, fontSize: 11, bgcolor: alpha(color, 0.1), color, fontWeight: 600 }} />
          ))}
        </Stack>

        <Box sx={{ flex: 1 }} />
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="primary.main" component="span">{price.value}</Typography>
            <Typography variant="caption" color="text.secondary" component="span">{price.unit}</Typography>
          </Box>
          <Button size="small" variant="outlined" color="inherit">View</Button>
        </Stack>
      </Box>
    </Card>
  );
}
