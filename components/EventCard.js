import Link from "next/link";
import { colors, fonts } from "../lib/theme";
import { formatRupiah, formatEventDateBadge } from "../lib/format";

// Warna chip kategori dirotasi dari palet logo, supaya tiap kategori
// event punya identitas warna sendiri tanpa hardcode manual.
const CATEGORY_COLORS = [colors.coral, colors.teal, colors.mustard, colors.sage, colors.lavender];

export function categoryColor(category, allCategories) {
  const i = allCategories.indexOf(category);
  return CATEGORY_COLORS[(i < 0 ? 0 : i) % CATEGORY_COLORS.length];
}

export default function EventCard({ event, accentColor, width }) {
  const badge = formatEventDateBadge(event.event_date);

  return (
    <Link
      href={`/workshop/${event.slug}`}
      className="hover-card"
      style={{
        display: "block",
        flex: width ? `0 0 ${width}` : "1 1 260px",
        width: width || undefined,
        background: colors.paperRaised,
        borderRadius: 16,
        overflow: "hidden",
        textDecoration: "none",
        color: colors.ink,
        border: `1px solid ${colors.line}`,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          background: colors.paper,
          backgroundImage: event.image_url ? `url(${event.image_url})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="date-badge">
          <div style={{ fontFamily: fonts.body, fontWeight: 800, fontSize: 16, color: colors.ink }}>
            {badge.day}
          </div>
          <div style={{ fontFamily: fonts.body, fontWeight: 600, fontSize: 10, color: colors.textMuted, textTransform: "uppercase" }}>
            {badge.month}
          </div>
        </div>
      </div>
      <div style={{ padding: 18 }}>
        {event.category && (
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "capitalize",
              color: accentColor || colors.coral,
              background: `${accentColor || colors.coral}1a`,
              borderRadius: 999,
              padding: "3px 10px",
              marginBottom: 10,
            }}
          >
            {event.category}
          </span>
        )}
        <h3 style={{ fontSize: 16, marginBottom: 8, lineHeight: 1.3 }}>{event.title}</h3>
        <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 10 }}>
          📍 {event.location}
        </div>
        <div className="tag-price" style={{ color: colors.coral, fontSize: 15 }}>
          {formatRupiah(event.price)}
        </div>
      </div>
    </Link>
  );
}
