"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts((data.products || []).slice(0, 6)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: "#6b6558", fontSize: 14 }}>Memuat produk...</p>;
  }

  if (products.length === 0) {
    return <p style={{ color: "#6b6558", fontSize: 14 }}>Belum ada produk tersedia.</p>;
  }

  return (
    <div className="product-scroll">
      {products.map((p) => (
        <Link
          key={p.id}
          href={`/produk/${p.slug}`}
          className="product-scroll-item"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 4,
              padding: 8,
              paddingBottom: 14,
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              transform: "rotate(-1.5deg)",
            }}
          >
            <div
              style={{
                width: "100%",
                aspectRatio: "1/1",
                borderRadius: 2,
                background: p.image_url ? undefined : "#D8D2C4",
                backgroundImage: p.image_url ? `url(${p.image_url})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                marginBottom: 10,
              }}
            />
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "#5B8DBF" }}>{formatRupiah(p.price)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
