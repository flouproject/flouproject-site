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
      <main style={{ padding: "32px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 26, marginBottom: 24 }}>Produk Handmade</h1>

        {loading && <p style={{ color: "#888" }}>Memuat produk...</p>}
        {error && <p style={{ color: "#c0392b" }}>{error}</p>}
        {!loading && !error && products.length === 0 && (
          <p style={{ color: "#888" }}>Belum ada produk tersedia.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/produk/${p.slug}`}
              style={{
                background: "#fff",
                borderRadius: 14,
                overflow: "hidden",
                textDecoration: "none",
                color: "#111",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  aspectRatio: "1/1",
                  background: "#eee",
                  backgroundImage: p.image_url ? `url(${p.image_url})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: "#666", fontSize: 14 }}>{formatRupiah(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
