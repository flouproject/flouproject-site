export default function AboutSection() {
  return (
    <section
      className="about-section"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(200px, 300px) 1fr",
        gap: 44,
        alignItems: "start",
        marginTop: 110,
      }}
    >
      <div
        className="section-card about-logo-card"
        style={{
          padding: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          aspectRatio: "1/1",
        }}
      >
        <img
          src="/logo.png"
          alt="Flou Project"
          style={{ width: "72%", height: "auto", display: "block" }}
        />
      </div>

      <div>
        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 34px)",
            lineHeight: 1.25,
            marginBottom: 18,
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
            apa itu{" "}
          </span>
          <span style={{ fontFamily: "var(--font-script)", fontStyle: "italic" }}>
            flou{" "}
          </span>
          <span
            className="highlight-marker gold"
            style={{ fontFamily: "var(--font-script)", fontStyle: "italic" }}
          >
            project?
          </span>
        </h2>

        <p style={{ fontSize: 15.5, lineHeight: 1.75, color: "#2c2c2c", maxWidth: 480, textAlign: "justify" }}>
          Flou Project adalah ruang kreatif yang menghadirkan workshop santai dan
          fun untuk mengekspresikan diri. Melalui aktivitas seperti painting dan
          crafting, Flou Project mengajak setiap orang untuk sejenak jeda dari
          rutinitas, menikmati proses, dan terhubung kembali dengan diri sendiri.
        </p>

        <div className="notes-card">
          <div className="notes-card-header">
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 500 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="#C9982E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Notes
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v13M7 8l5-5 5 5M5 21h14" stroke="#C9982E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#C9982E" strokeWidth="2" />
                <path d="M8 12h8" stroke="#C9982E" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <span className="highlight-marker gold notes-card-tag">affirmation</span>
          <p className="notes-card-quote">
            Tak perlu jadi ahli, cukup jadi diri sendiri.
          </p>
        </div>
      </div>
    </section>
  );
}
