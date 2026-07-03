"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";
import { useCart } from "../../../lib/CartContext";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = (data.products || []).find((p) => p.slug === params.slug);
        if (!found) setNotFound(true);
        else setProduct(found);
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 56, textAlign: "center", color: "#8a7f6c" }}>Memuat...</main>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 56, textAlign: "center", color: "#8a7f6c" }}>
          Produk tidak ditemukan.
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main
        style={{
          padding: "56px 40px",
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 340px",
            aspectRatio: "1/1",
            background: "var(--color-cream-deep)",
            borderRadius: "var(--radius-lg)",
            backgroundImage: product.image_url ? `url(${product.image_url})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ flex: "1 1 300px" }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Produk Handmade</div>
          <h1 style={{ fontSize: 32, marginBottom: 12 }}>{product.name}</h1>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "var(--color-terracotta-deep)",
              marginBottom: 20,
            }}
          >
            {formatRupiah(product.price)}
          </div>
          <p style={{ color: "#5c5346", lineHeight: 1.7, marginBottom: 28, fontSize: 15 }}>
            {product.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Jumlah:</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              style={{
                width: 70,
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-white)",
              }}
            />
            <span style={{ fontSize: 13, color: "#8a7f6c" }}>Stok: {product.stock}</span>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                addItem(product, qty);
                setAdded(true);
              }}
              disabled={product.stock <= 0}
              style={{
                padding: "14px 28px",
                background: product.stock <= 0 ? "#b8ac96" : "var(--color-terracotta)",
                color: "#fff",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontWeight: 600,
                fontSize: 14,
                cursor: product.stock <= 0 ? "not-allowed" : "pointer",
              }}
            >
              {product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
            </button>

            {added && (
              <button
                onClick={() => router.push("/keranjang")}
                style={{
                  padding: "14px 28px",
                  background: "transparent",
                  color: "var(--color-charcoal)",
                  border: "1px solid var(--color-charcoal)",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Lihat Keranjang
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
