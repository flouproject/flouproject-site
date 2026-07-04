import NavBar from "../components/NavBar";
import PolaroidStack from "../components/PolaroidStack";
import PolaroidRow from "../components/PolaroidRow";
import AboutSection from "../components/AboutSection";
import FlouerCTA from "../components/FlouerCTA";
import { TOP_PHOTOS, BOTTOM_PHOTOS } from "../lib/photos";

export default function HomePage() {
  return (
    <>
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
        {/* Foto kiri (desktop) */}
        <PolaroidStack side="left" />
        {/* Foto kanan (desktop) */}
        <PolaroidStack side="right" />

        {/* Foto baris atas (mobile saja) */}
        <div style={{ marginTop: 8 }}>
          <PolaroidRow photos={TOP_PHOTOS} />
        </div>

        {/* Teks hero tengah */}
        <div
          style={{
            textAlign: "center",
            maxWidth: 560,
            margin: "clamp(24px, 8vw, 80px) auto 0",
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

        {/* Foto baris bawah (mobile saja) */}
        <div style={{ marginTop: 28 }}>
          <PolaroidRow photos={BOTTOM_PHOTOS} />
        </div>

        {/* Section: Apa itu Flou Project */}
        <AboutSection />

        {/* Section: CTA ke Workshop */}
        <FlouerCTA />
      </main>
    </>
  );
}
