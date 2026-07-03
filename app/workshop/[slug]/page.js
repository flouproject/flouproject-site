"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../components/NavBar";
import Footer from "../../../components/Footer";
import RegistrationForm from "../../../components/RegistrationForm";
import { colors } from "../../../lib/theme";
import { formatRupiah, formatEventDateLong } from "../../../lib/format";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.events || []).find((e) => e.slug === params.slug);
        if (!found) {
          setNotFound(true);
        } else {
          setEvent(found);
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 32, color: colors.textMuted }}>Memuat...</main>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 32 }}>
          <p style={{ color: colors.textMuted }}>Event tidak ditemukan.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main
        style={{
          padding: "48px 24px 72px",
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 320px" }}>
          <div
            style={{
              aspectRatio: "4/3",
              borderRadius: 18,
              background: colors.paper,
              border: `1px solid ${colors.line}`,
              backgroundImage: event.image_url ? `url(${event.image_url})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              marginBottom: 24,
            }}
          />

          {event.category && (
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "capitalize",
                color: colors.coral,
                background: `${colors.coral}1a`,
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 12,
              }}
            >
              {event.category}
            </span>
          )}
          <h1 style={{ fontSize: 34, marginBottom: 14 }}>{event.title}</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20, fontSize: 14, color: colors.ink }}>
            <div>🗓️ {formatEventDateLong(event.event_date)} · {event.event_time} WIB</div>
            <div>📍 {event.location}</div>
            <div className="tag-price" style={{ color: colors.coral, fontSize: 18 }}>
              {formatRupiah(event.price)}
            </div>
          </div>

          <p style={{ color: colors.textMuted, lineHeight: 1.7 }}>{event.description}</p>
        </div>

        <div style={{ flex: "1 1 320px" }}>
          <RegistrationForm event={event} />
        </div>
      </main>
      <Footer />
    </>
  );
}
