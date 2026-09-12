"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { getCategory, VERTICALS } from "@/config/categoryTree";
import { getCategoryIcon } from "@/config/categoryIcons";
import { priceLabel, capacityLabel, facts } from "@/utils/listing";
import { colors, motion, shadows, withAlpha } from "@/theme/tokens";

/**
 * The public listing card. Two routes out of it, both one click:
 *   - the card itself opens the detail page
 *   - "Book" opens the detail page with the booking wizard already open
 */
export default function PublicListingCard({ listing }) {
  const vendor = useSelector((s) => s.vendors.items.find((v) => v.id === listing.vendorId));
  const cat = getCategory(listing.categoryId);
  const Icon = getCategoryIcon(cat?.iconKey);
  const accent = cat?.color || colors.primary;
  const price = priceLabel(listing);
  const capacity = capacityLabel(listing);
  const isCatering = listing.vertical === VERTICALS.CATERING;
  const href = `/listings/${listing.id}`;

  return (
    <Card
      sx={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: `transform ${motion.base} ${motion.easeOut}, box-shadow ${motion.base} ${motion.easeOut}`,
        "&:hover": { transform: "translateY(-6px)", boxShadow: shadows.cardHover },
        "&:hover .jc-cover-icon": { transform: "scale(1.12) rotate(-6deg)" },
      }}
    >
      <Box
        component={Link}
        href={href}
        aria-label={`View ${listing.title}`}
        sx={{
          position: "relative",
          height: 150,
          display: "block",
          background: `linear-gradient(135deg, ${withAlpha(accent, 0.9)}, ${accent})`,
          textDecoration: "none",
        }}
      >
        {/* subtle pattern so the cover is not a flat block of colour */}
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: `radial-gradient(${withAlpha(colors.surface, 0.55)} 1px, transparent 1px)`, backgroundSize: "16px 16px" }} />
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <Icon className="jc-cover-icon" sx={{ fontSize: 46, color: colors.surface, opacity: 0.95, transition: `transform ${motion.slow} ${motion.easeOut}` }} />
        </Box>

        <Chip
          size="small"
          label={isCatering ? "Catering" : "Venue"}
          sx={{ position: "absolute", top: 12, left: 12, bgcolor: withAlpha(colors.surface, 0.94), fontWeight: 700 }}
        />
        {listing.featured && (
          <Chip
            size="small"
            label="Featured"
            sx={{ position: "absolute", top: 12, right: 12, bgcolor: colors.secondary, color: colors.secondaryContrast, fontWeight: 700 }}
          />
        )}
      </Box>

      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
          <Typography
            component={Link}
            href={href}
            variant="subtitle1"
            sx={{ fontWeight: 800, textDecoration: "none", color: "text.primary", "&:hover": { color: colors.primary } }}
            noWrap
          >
            {listing.title}
          </Typography>
          {vendor?.rating && (
            <Stack direction="row" spacing={0.25} sx={{ alignItems: "center", color: colors.secondaryDark }}>
              <StarRateRoundedIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={700}>{vendor.rating}</Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", color: "text.secondary", mt: 0.5 }}>
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
            <PlaceRoundedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption">{listing.city}</Typography>
          </Stack>
          {capacity && (
            <Stack direction="row" spacing={0.4} sx={{ alignItems: "center" }}>
              <GroupsRoundedIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption">{capacity}</Typography>
            </Stack>
          )}
        </Stack>

        {vendor && (
          <Stack direction="row" spacing={0.4} sx={{ alignItems: "center", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">by {vendor.name}</Typography>
            {vendor.verified && <VerifiedRoundedIcon sx={{ fontSize: 14, color: colors.primary }} />}
          </Stack>
        )}

        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: 1.5 }}>
          {facts(listing).slice(0, 2).map((f) => (
            <Chip key={f} size="small" label={f} sx={{ height: 24, fontSize: 11.5, bgcolor: withAlpha(accent, 0.1), color: accent }} />
          ))}
        </Stack>

        <Box sx={{ flex: 1, minHeight: 16 }} />

        <Stack direction="row" sx={{ alignItems: "flex-end", justifyContent: "space-between", pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1 }}>From</Typography>
            <Stack direction="row" spacing={0.25} sx={{ alignItems: "baseline" }}>
              <Typography sx={{ fontSize: 19, fontWeight: 800, color: colors.primary }}>{price.value}</Typography>
              <Typography variant="caption" color="text.secondary">{price.unit}</Typography>
            </Stack>
          </Box>
          <Button
            component={Link}
            href={`${href}?book=1`}
            size="small"
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
          >
            Book
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
