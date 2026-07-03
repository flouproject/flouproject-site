"use client";

import { useEffect, useMemo, useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import EventCard, { categoryColor } from "../../components/EventCard";
import { colors, fonts } from "../../lib/theme";

export default function WorkshopPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("semua");

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setEvents(data.events);
        }
      })
      .catch(() => setError("Gagal memuat event."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(events.map((e) => e.category).filter(Boolean))),
    [events]
  );

  const filteredEvents = useMemo(() => {
    if (activeCategory === "semua") return events;
    return events.filter((e) => e.category === activeCategory);
  }, [events, activeCategory]);

  return (
    <>
      <NavBar />
      <main>
        {/* Header ala mynoosa: judul besar + subjudul singkat */}
        <section style={{ padding: "56px 24px 32px", maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ fontFamily: fonts.accent, fontSize: 20, color: colors.textMuted, marginBottom: 2 }}>
            ikut kelasnya
          </div>
          <h1 style={{ fontSize: 40, marginBottom: 10 }}>Workshop & Event</h1>
          <p style={{ color: colors.textMuted, fontSize: 15, maxWidth: 520, margin: 0 }}>
            Pilih workshop yang paling menarik buatmu, amankan tempat, dan datang siap berkarya.
          </p>
        </section>

        <section style={{ padding: "0 24px 72px", maxWidth: 1040, margin: "0 auto" }}>
          {loading && <p style={{ color: colors.textMuted }}>Memuat event...</p>}
          {error && <p style={{ color: colors.danger }}>{error}</p>}

          {!loading && !error && categories.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
              <CategoryChip
                label="Semua"
                active={activeCategory === "semua"}
                color={colors.ink}
                onClick={() => setActiveCategory("semua")}
              />
              {categories.map((cat) => (
                <CategoryChip
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  color={categoryColor(cat, categories)}
                  onClick={() => setActiveCategory(cat)}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <p style={{ color: colors.textMuted }}>
              {events.length === 0 ? "Belum ada workshop yang dijadwalkan." : "Belum ada event di kategori ini."}
            </p>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 22,
            }}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} accentColor={categoryColor(event.category, categories)} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function CategoryChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{
        border: `1.5px solid ${active ? color : colors.line}`,
        background: active ? color : colors.paperRaised,
        color: active ? "#fff" : colors.ink,
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}
