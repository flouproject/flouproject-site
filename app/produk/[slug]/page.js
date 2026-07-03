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
        if (!found) {
          setNotFound(true);
        } else {
          setProduct(found);
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 32 }}>Memuat...</main>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 32 }}>
          <p>Produk tidak ditemukan.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main
        style={{
          padding: "32px 24px",
          maxWidth: 800,
          margin: "0 auto",
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            aspectRatio: "1/1",
            background: "#eee",
            borderRadius: 14,
            backgroundImage: product.image_url ? `url(${product.image_url})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ flex: "1 1 300px" }}>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>{product.name}</h1>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
            {formatRupiah(product.price)}
          </div>
          <p style={{ color: "#555", lineHeight: 1.6, marginBottom: 24 }}>
            {product.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600 }}>Jumlah:</label>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              style={{
                width: 70,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />
            <span style={{ fontSize: 13, color: "#888" }}>Stok: {product.stock}</span>
          </div>

          <button
            onClick={() => {
              addItem(product, qty);
              setAdded(true);
            }}
            disabled={product.stock <= 0}
            style={{
              padding: "12px 24px",
              background: product.stock <= 0 ? "#999" : "#111",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 600,
              cursor: product.stock <= 0 ? "not-allowed" : "pointer",
              marginRight: 12,
            }}
          >
            {product.stock <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}
          </button>

          {added && (
            <button
              onClick={() => router.push("/keranjang")}
              style={{
                padding: "12px 24px",
                background: "#fff",
                color: "#111",
                border: "1px solid #ddd",
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Lihat Keranjang
            </button>
          )}
        </div>
      </main>
    </>
  );
}
