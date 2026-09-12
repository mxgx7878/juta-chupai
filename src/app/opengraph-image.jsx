import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { colors } from "@/theme/tokens";
import { portalStats } from "@/data/publicSite";

/* The social card every page links to (buildMetadata points OG and Twitter at
   /opengraph-image). Generated from the brand tokens, so it restyles itself when
   the palette changes — no design file to keep in sync. */
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `linear-gradient(135deg, ${colors.inverse} 0%, ${colors.primaryDark} 55%, ${colors.accent} 140%)`,
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "#ffffff",
              color: colors.primaryDark,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            JC
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 68, fontWeight: 800, letterSpacing: -2, lineHeight: 1.1, maxWidth: 900 }}>
            {site.tagline}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.78)", maxWidth: 820, lineHeight: 1.4 }}>
            {site.shortDescription}
          </div>
        </div>

        <div style={{ display: "flex", gap: 44, fontSize: 24, color: "rgba(255,255,255,0.82)" }}>
          <div style={{ display: "flex" }}>{portalStats.vendors.toLocaleString("en-US")}+ verified vendors</div>
          <div style={{ display: "flex" }}>{portalStats.eventsDelivered.toLocaleString("en-US")}+ events delivered</div>
          <div style={{ display: "flex" }}>{portalStats.averageRating} / 5 rating</div>
        </div>
      </div>
    ),
    size,
  );
}
