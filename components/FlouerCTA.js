import Link from "next/link";

export default function FlouerCTA() {
  return (
    <section
      className="flouer-section"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(220px, 340px)",
        gap: 40,
        alignItems: "center",
        marginTop: 110,
        background: "rgba(255,255,255,0.55)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        padding: "40px 36px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "clamp(28px, 4.5vw, 40px)",
            lineHeight: 1.15,
            marginBottom: 18,
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            will you be our{" "}
          </span>
          <br />
          <span
            className="highlight-marker peach"
            style={{ fontFamily: "var(--font-script)", fontStyle: "italic" }}
          >
            flouer?
          </span>
        </h2>

        <p style={{ fontSize: 16, lineHeight: 1.7, color: "#2c2c2c", marginBottom: 26, maxWidth: 380 }}>
          ayo, jelajahi ruang kreasi dari kami!
        </p>

        <Link
          href="/workshop"
          style={{
            display: "inline-block",
            background: "var(--color-highlight-sage)",
            color: "#1A1A1A",
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: "0.02em",
            textDecoration: "none",
            padding: "14px 30px",
            borderRadius: "var(--radius-pill)",
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          }}
        >
          YA, AKU MAU!
        </Link>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <RingBoxIllustration />
      </div>
    </section>
  );
}

function RingBoxIllustration() {
  return (
    <svg width="220" height="200" viewBox="0 0 220 200" fill="none" aria-hidden="true">
      {/* Kotak bawah */}
      <rect x="30" y="90" width="160" height="90" rx="14" fill="#F6C9CE" />
      <rect x="30" y="90" width="160" height="90" rx="14" stroke="#E8A9B1" strokeWidth="2" />
      {/* Tutup kotak terbuka */}
      <path
        d="M35 92 C35 40 75 10 110 10 C145 10 185 40 185 92 Z"
        fill="#FADDE1"
        stroke="#E8A9B1"
        strokeWidth="2"
      />
      {/* Bantalan dalam kotak */}
      <ellipse cx="110" cy="118" rx="58" ry="30" fill="#FCEEF0" />
      {/* Cincin */}
      <circle cx="110" cy="128" r="20" fill="none" stroke="#D9A441" strokeWidth="6" />
      {/* Berlian */}
      <polygon points="110,96 122,110 110,128 98,110" fill="#EAF6FF" stroke="#BFE0F2" strokeWidth="2" />
      <polygon points="110,96 116,110 110,118 104,110" fill="#ffffff" />
    </svg>
  );
}
