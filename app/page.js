"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import EventCard, { categoryColor } from "../components/EventCard";
import { colors, fonts } from "../lib/theme";

export default function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]));
  }, []);

  const categories = Array.from(new Set(events.map((e) => e.category).filter(Boolean)));
  const featured = events.slice(0, 5);

  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section
          style={{
            padding: "96px 24px 72px",
            textAlign: "center",
            background: colors.paper,
          }}
        >
          <div
            style={{
              fontFamily: fonts.accent,
              fontSize: 20,
              color: colors.coral,
              marginBottom: 12,
            }}
          >
            Dibuat dengan tangan, sejak hari pertama
          </div>
          <h1
            style={{
              fontSize: "clamp(48px, 9vw, 84px)",
              lineHeight: 1,
              marginBottom: 20,
              color: colors.ink,
            }}
          >
            Flou Project
          </h1>
          <p
            style={{
              fontSize: 17,
              color: colors.textMuted,
              maxWidth: 520,
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            Produk handmade yang dibuat perlahan dan penuh perhatian, dan
            workshop kriya untuk siapa saja yang ingin belajar membuat karya
            dengan tangannya sendiri.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/workshop" style={primaryBtn}>Lihat Workshop</Link>
            <Link href="/produk" style={secondaryBtn}>Belanja Produk</Link>
          </div>
        </section>

        <hr className="stitch-divider" />

        {/* Event terdekat — scroll horizontal ala mynoosa */}
        {featured.length > 0 && (
          <section style={{ padding: "64px 24px 8px", maxWidth: 1040, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontFamily: fonts.accent, fontSize: 18, color: colors.sage, marginBottom: 2 }}>
                  jangan sampai kelewat
                </div>
                <h2 style={{ fontSize: 28 }}>Event Terdekat</h2>
              </div>
              <Link href="/workshop" style={{ fontSize: 14, fontWeight: 600, color: colors.ink, textDecoration: "none" }}>
                Lihat semua →
              </Link>
            </div>

            <div className="scroll-row">
              {featured.map((event) => (
                <EventCard key={event.id} event={event} accentColor={categoryColor(event.category, categories)} width="260px" />
              ))}
            </div>
          </section>
        )}

        {/* Kategori workshop */}
        {categories.length > 0 && (
          <section style={{ padding: "40px 24px 8px", maxWidth: 1040, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href="/workshop"
                  className="chip"
                  style={{
                    border: `1.5px solid ${categoryColor(cat, categories)}`,
                    color: categoryColor(cat, categories),
                    background: `${categoryColor(cat, categories)}14`,
                    textTransform: "capitalize",
                    textDecoration: "none",
                  }}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        )}

        <hr className="stitch-divider" style={{ marginTop: 64 }} />

        {/* Tentang */}
        <section id="tentang" style={{ padding: "64px 24px", maxWidth: 680, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: fonts.accent,
              fontSize: 18,
              color: colors.sage,
              marginBottom: 4,
            }}
          >
            Tentang Kami
          </div>
          <h2 style={{ fontSize: 30, marginBottom: 16 }}>Kerajinan yang punya cerita</h2>
          <p style={{ color: colors.textMuted, lineHeight: 1.8, fontSize: 16 }}>
            Flou Project lahir dari kecintaan pada proses membuat sesuatu
            dengan tangan — pelan, sengaja, dan tanpa terburu-buru. Setiap
            produk dikerjakan dalam jumlah terbatas, dan setiap workshop
            dirancang supaya siapa pun bisa pulang membawa karya buatannya
            sendiri.
          </p>
        </section>

        {/* CTA ganda */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
            padding: "0 24px 80px",
            maxWidth: 920,
            margin: "0 auto",
          }}
        >
          <Link href="/produk" className="hover-card" style={cardStyle}>
            <div style={{ fontFamily: fonts.accent, fontSize: 18, color: colors.coral, marginBottom: 6 }}>
              Belanja
            </div>
            <h3 style={{ fontSize: 19, marginBottom: 8 }}>Produk Handmade</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>
              Jelajahi koleksi produk buatan tangan kami, dibuat terbatas dan
              penuh detail.
            </p>
          </Link>
          <Link href="/workshop" className="hover-card" style={cardStyle}>
            <div style={{ fontFamily: fonts.accent, fontSize: 18, color: colors.coral, marginBottom: 6 }}>
              Belajar
            </div>
            <h3 style={{ fontSize: 19, marginBottom: 8 }}>Workshop</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>
              Daftar workshop terdekat dan belajar kriya langsung bersama
              kami.
            </p>
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}

const primaryBtn = {
  padding: "13px 30px",
  background: colors.coral,
  color: "#fff",
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  fontFamily: fonts.body,
};

const secondaryBtn = {
  padding: "13px 30px",
  background: "transparent",
  color: colors.ink,
  border: `1.5px solid ${colors.ink}`,
  borderRadius: 999,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
  fontFamily: fonts.body,
};

const cardStyle = {
  flex: "1 1 280px",
  background: colors.paperRaised,
  borderRadius: 16,
  padding: 28,
  textDecoration: "none",
  color: colors.ink,
  border: `1px solid ${colors.line}`,
};
