"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar";
import { colors, fonts } from "../../lib/theme";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProdukPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 24px 72px", maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ fontFamily: fonts.accent, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.sage, marginBottom: 10 }}>
          Koleksi
        </div>
        <h1 style={{ fontSize: 30, marginBottom: 32 }}>Produk Handmade</h1>

        {loading && <p style={{ color: colors.textMuted }}>Memuat produk...</p>}
        {error && <p style={{ color: colors.danger }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: colors.textMuted }}>Belum ada produk tersedia.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 22,
          }}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/produk/${p.slug}`}
              style={{
                background: colors.paperRaised,
                borderRadius: 4,
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
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 15 }}>{p.name}</div>
                <div className="tag-price" style={{ color: colors.coral, fontSize: 14 }}>
                  {formatRupiah(p.price)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
