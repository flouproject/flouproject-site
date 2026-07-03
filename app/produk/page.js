"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavBar from "../../components/NavBar";

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
        if (data.error) setError(data.error);
        else setProducts(data.products);
      })
      .catch(() => setError("Gagal memuat produk."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <NavBar />
      <main style={{ padding: "56px 40px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Koleksi</div>
          <h1 style={{ fontSize: 36 }}>Produk Handmade</h1>
        </div>

        {loading && <p style={{ color: "#8a7f6c", textAlign: "center" }}>Memuat produk...</p>}
        {error && <p style={{ color: "#c0392b", textAlign: "center" }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: "#8a7f6c", textAlign: "center" }}>Belum ada produk tersedia.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 28,
          }}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/produk/${p.slug}`}
              style={{
                background: "var(--color-white)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                textDecoration: "none",
                color: "var(--color-charcoal)",
                border: "1px solid var(--color-border)",
                transition: "transform 0.15s ease",
              }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  background: "var(--color-cream-deep)",
                  backgroundImage: p.image_url ? `url(${p.image_url})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: 18 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, marginBottom: 6 }}>
                  {p.name}
                </div>
                <div style={{ color: "var(--color-terracotta-deep)", fontSize: 14, fontWeight: 600 }}>
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
