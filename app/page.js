import Link from "next/link";
import NavBar from "../components/NavBar";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        {/* Hero */}
        <section
          style={{
            padding: "80px 24px",
            textAlign: "center",
            background: "#fff",
          }}
        >
          <h1 style={{ fontSize: 36, marginBottom: 12 }}>
            Nama Bisnis Kamu
          </h1>
          <p style={{ fontSize: 16, color: "#666", maxWidth: 480, margin: "0 auto 32px" }}>
            Tulis deskripsi singkat tentang bisnis kamu di sini — produk handmade
            yang dibuat dengan hati, dan workshop untuk belajar bareng.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link href="/produk" style={primaryBtn}>Lihat Produk</Link>
            <Link href="/workshop" style={secondaryBtn}>Daftar Workshop</Link>
          </div>
        </section>

        {/* Tentang */}
        <section style={{ padding: "48px 24px", maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, marginBottom: 12 }}>Tentang Kami</h2>
          <p style={{ color: "#555", lineHeight: 1.7 }}>
            Ganti paragraf ini dengan cerita bisnis kamu — kapan mulai, kenapa
            suka bikin produk handmade, dan apa yang bikin workshop kamu spesial.
          </p>
        </section>

        {/* CTA ganda */}
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            padding: "24px",
            maxWidth: 900,
            margin: "0 auto 48px",
          }}
        >
          <Link href="/produk" style={cardStyle}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>🧶 Produk Handmade</h3>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              Jelajahi koleksi produk buatan tangan kami.
            </p>
          </Link>
          <Link href="/workshop" style={cardStyle}>
            <h3 style={{ margin: 0, marginBottom: 8 }}>🎨 Workshop</h3>
            <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
              Daftar workshop terdekat dan belajar langsung bareng kami.
            </p>
          </Link>
        </section>
      </main>
    </>
  );
}

const primaryBtn = {
  padding: "12px 28px",
  background: "#111",
  color: "#fff",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const secondaryBtn = {
  padding: "12px 28px",
  background: "#fff",
  color: "#111",
  border: "1px solid #ddd",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
  fontSize: 14,
};

const cardStyle = {
  flex: "1 1 260px",
  background: "#fff",
  borderRadius: 14,
  padding: 24,
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};
