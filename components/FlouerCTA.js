import Link from "next/link";

export default function FlouerCTA() {
  return (
    <section
      className="flouer-section"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(260px, 420px) minmax(200px, 300px)",
        justifyContent: "center",
        gap: 56,
        alignItems: "center",
        marginTop: 110,
        background: "rgba(255,255,255,0.55)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
        padding: "40px 48px",
      }}
    >
      <div style={{ paddingLeft: "clamp(8px, 3vw, 28px)" }}>
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
        <img
          src="/images/ring-box.png"
          alt="Kotak cincin"
          style={{ width: "100%", maxWidth: 280, height: "auto", display: "block" }}
        />
      </div>
    </section>
  );
}
