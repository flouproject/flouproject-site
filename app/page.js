import Link from "next/link";
import NavBar from "../components/NavBar";
import { colors, fonts } from "../lib/theme";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section
          style={{
            padding: "96px 24px 80px",
            textAlign: "center",
            background: colors.paper,
          }}
        >
          <div
            style={{
              fontFamily: fonts.accent,
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: colors.coral,
              marginBottom: 18,
            }}
          >
            Dibuat dengan tangan, sejak hari pertama
          </div>
          <h1
            style={{
              fontSize: "clamp(38px, 6vw, 58px)",
              lineHeight: 1.08,
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
            <Link href="/produk" style={primaryBtn}>Lihat Produk</Link>
            <Link href="/workshop" style={secondaryBtn}>Daftar Workshop</Link>
          </div>
        </section>

        <hr className="stitch-divider" />

        {/* Tentang */}
        <section style={{ padding: "64px 24px", maxWidth: 680, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: fonts.accent,
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: colors.sage,
              marginBottom: 12,
            }}
          >
            Tentang Kami
          </div>
          <h2 style={{ fontSize: 26, marginBottom: 16 }}>Kerajinan yang punya cerita</h2>
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
            padding: "0 24px 72px",
            maxWidth: 920,
            margin: "0 auto",
          }}
        >
          <Link href="/produk" style={cardStyle}>
            <div style={{ fontFamily: fonts.accent, fontSize: 12, color: colors.coral, marginBottom: 10 }}>
              01 — Belanja
            </div>
            <h3 style={{ fontSize: 19, marginBottom: 8 }}>Produk Handmade</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>
              Jelajahi koleksi produk buatan tangan kami, dibuat terbatas dan
              penuh detail.
            </p>
          </Link>
          <Link href="/workshop" style={cardStyle}>
            <div style={{ fontFamily: fonts.accent, fontSize: 12, color: colors.coral, marginBottom: 10 }}>
              02 — Belajar
            </div>
            <h3 style={{ fontSize: 19, marginBottom: 8 }}>Workshop</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14, lineHeight: 1.6 }}>
              Daftar workshop terdekat dan belajar kriya langsung bersama
              kami.
            </p>
          </Link>
        </section>
      </main>
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
  borderRadius: 4,
  padding: 28,
  textDecoration: "none",
  color: colors.ink,
  border: `1px solid ${colors.line}`,
};
