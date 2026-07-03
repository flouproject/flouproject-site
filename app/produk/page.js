"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { colors, fonts } from "../../lib/theme";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Warna chip dirotasi dari palet logo, supaya tiap kategori
// punya identitas warna sendiri tanpa perlu di-hardcode manual.
const CHIP_COLORS = [colors.coral, colors.teal, colors.mustard, colors.sage, colors.lavender];

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("semua");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products);
        }
      })
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return unique;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "semua") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 24px 72px", maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ fontFamily: fonts.accent, fontSize: 20, color: colors.textMuted, marginBottom: 2 }}>
          koleksi
        </div>
        <h1 style={{ fontSize: 30, marginBottom: 24 }}>Produk Handmade</h1>

        {loading && <p style={{ color: colors.textMuted }}>Memuat produk...</p>}
        {error && <p style={{ color: colors.danger }}>{error}</p>}

        {!loading && !error && categories.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 28,
            }}
          >
            <CategoryChip
              label="Semua"
              active={activeCategory === "semua"}
              color={colors.ink}
              onClick={() => setActiveCategory("semua")}
            />
            {categories.map((cat, i) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                color={CHIP_COLORS[i % CHIP_COLORS.length]}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p style={{ color: colors.textMuted }}>
            {products.length === 0 ? "Belum ada produk tersedia." : "Belum ada produk di kategori ini."}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 22,
          }}
        >
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              href={`/produk/${p.slug}`}
              className="hover-card"
              style={{
                background: colors.paperRaised,
                borderRadius: 16,
                overflow: "hidden",
                textDecoration: "none",
                color: colors.ink,
                border: `1px solid ${colors.line}`,
              }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  background: colors.paper,
                  backgroundImage: p.image_url ? `url(${p.image_url})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: 16 }}>
                {p.category && (
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: colors.textMuted,
                      marginBottom: 6,
                    }}
                  >
                    {p.category}
                  </div>
                )}
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{p.name}</div>
                <div className="tag-price" style={{ color: colors.coral, fontSize: 14 }}>
                  {formatRupiah(p.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

function CategoryChip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{
        border: `1.5px solid ${active ? color : colors.line}`,
        background: active ? color : colors.paperRaised,
        color: active ? "#fff" : colors.ink,
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}
