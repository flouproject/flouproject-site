import { PAST_WORKSHOPS } from "../lib/workshops";

export default function PastWorkshopsHero() {
  return (
    <section style={{ padding: "48px 24px 24px", maxWidth: 1100, margin: "0 auto" }}>
      <h1
        style={{
          fontSize: "clamp(24px, 4vw, 34px)",
          lineHeight: 1.3,
          marginBottom: 36,
        }}
      >
        <span
          className="highlight-marker gold"
          style={{ fontFamily: "var(--font-script)", fontStyle: "italic", fontWeight: 700 }}
        >
          Creactivity
        </span>{" "}
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}>
          yang sudah terlaksana
        </span>
      </h1>

      <div
        className="past-workshops-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 28,
        }}
      >
        {PAST_WORKSHOPS.map((w, i) => (
          <div key={w.title}>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 700,
                color: "var(--color-charcoal)",
                opacity: 0.55,
                marginBottom: 6,
              }}
            >
              [{i + 1}]
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>{w.title}</div>
            <img
              src={w.image}
              alt={w.title}
              style={{
                width: "100%",
                borderRadius: 10,
                display: "block",
                boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
