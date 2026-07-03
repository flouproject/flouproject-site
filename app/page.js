import NavBar from "../components/NavBar";
import PolaroidStack from "../components/PolaroidStack";

export default function HomePage() {
  return (
    <>
      {/* Background langit */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, var(--color-sky-top) 0%, var(--color-sky-bottom) 55%)",
          zIndex: -1,
        }}
      />

      <NavBar />

      <main
        style={{
          position: "relative",
          minHeight: "80vh",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px 120px",
        }}
      >
        {/* Foto kiri */}
        <PolaroidStack side="left" />
        {/* Foto kanan */}
        <PolaroidStack side="right" />

        {/* Teks hero tengah */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "80px auto 0",
            position: "relative",
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 84px)",
              lineHeight: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>
              flou
            </span>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
              <span className="highlight-marker" style={{ fontFamily: "var(--font-script)", fontStyle: "italic", fontSize: "0.85em" }}>
                project
              </span>
              <span style={{ fontFamily: "var(--font-script)", fontStyle: "italic" }}>.</span>
            </span>
          </h1>

          <p
            style={{
              marginTop: 28,
              fontSize: 17,
              fontFamily: "var(--font-script)",
              fontStyle: "italic",
              color: "#2c2c2c",
            }}
          >
            crafted quickly, <span className="wavy-underline">loved deeply</span>~
          </p>
        </div>
      </main>
    </>
  );
}
