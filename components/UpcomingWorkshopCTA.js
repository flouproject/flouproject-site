"use client";

import { useState } from "react";
import Link from "next/link";
import { UPCOMING_WORKSHOPS } from "../lib/workshops";

export default function UpcomingWorkshopCTA() {
  const [index, setIndex] = useState(0);
  const hasMultiple = UPCOMING_WORKSHOPS.length > 1;
  const current = UPCOMING_WORKSHOPS[index];

  if (!current) return null;

  function goPrev() {
    setIndex((i) => (i === 0 ? UPCOMING_WORKSHOPS.length - 1 : i - 1));
  }

  function goNext() {
    setIndex((i) => (i === UPCOMING_WORKSHOPS.length - 1 ? 0 : i + 1));
  }

  return (
    <section
      className="upcoming-workshop-section"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(220px, 320px)",
        gap: 40,
        alignItems: "center",
        maxWidth: 1100,
        margin: "60px auto 0",
        padding: "40px 24px 80px",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "clamp(26px, 4vw, 34px)",
            lineHeight: 1.3,
            marginBottom: 18,
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 400 }}>
            jangan sampai ketinggalan{" "}
          </span>
          <span
            className="highlight-marker gold"
            style={{ fontFamily: "var(--font-script)", fontStyle: "italic" }}
          >
            lagi!
          </span>
        </h2>

        <p
          style={{
            fontSize: 15.5,
            lineHeight: 1.75,
            color: "#2c2c2c",
            maxWidth: 420,
            textAlign: "justify",
            marginBottom: 26,
          }}
        >
          tidak ada kata terlambat untuk memulai, kamu bisa jadi Flouers
          sekarang!
        </p>

        <Link
          href="/workshop/daftar"
          style={{
            display: "inline-block",
            background: "#F5C6A0",
            color: "#1A1A1A",
            fontFamily: "var(--font-heading)",
            fontWeight: 400,
            fontSize: 14,
            textDecoration: "none",
            padding: "14px 30px",
            borderRadius: 999,
            boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
          }}
        >
          Daftar Sekarang
        </Link>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 8,
            boxShadow: "0 10px 26px rgba(0,0,0,0.14)",
          }}
        >
          <img
            key={current.image}
            src={current.image}
            alt={current.title}
            style={{ width: "100%", borderRadius: 6, display: "block" }}
          />
        </div>

        {/* Label kecil ala folder, sesuai referensi desain */}
        <div
          style={{
            position: "absolute",
            top: -18,
            right: -18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
            <path
              d="M2 4a2 2 0 0 1 2-2h8l3 3h13a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"
              fill="#A9C8E8"
            />
          </svg>
          <span style={{ fontSize: 10.5, fontFamily: "var(--font-body)", color: "#4a4a4a" }}>
            next workshop
          </span>
        </div>

        {hasMultiple && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginTop: 14,
            }}
          >
            <button onClick={goPrev} style={carouselBtnStyle} aria-label="Sebelumnya">
              ‹
            </button>
            <span style={{ fontSize: 13, alignSelf: "center", color: "#555" }}>
              {index + 1} / {UPCOMING_WORKSHOPS.length}
            </span>
            <button onClick={goNext} style={carouselBtnStyle} aria-label="Selanjutnya">
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const carouselBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "1px solid var(--color-border)",
  background: "#fff",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
};
