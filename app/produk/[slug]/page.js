"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";
import { useCart } from "../../../lib/CartContext";
import { colors, fonts } from "../../../lib/theme";

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
        <main style={{ padding: 32, color: colors.textMuted }}>Memuat...</main>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <NavBar />
        <main style={{ padding: 32 }}>
          <p style={{ color: colors.textMuted }}>Produk tidak ditemukan.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main
        style={{
          padding: "48px 24px 72px",
          maxWidth: 860,
          margin: "0 auto",
          display: "flex",
          gap: 40,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: "1 1 300px",
            aspectRatio: "1/1",
            background: colors.paper,
            borderRadius: 4,
            border: `1px solid ${colors.line}`,
            backgroundImage: product.image_url ? `url(${product.image_url})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div style={{ flex: "1 1 300px" }}>
          {product.category && (
            <div
              style={{
                display: "inline-block",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.textMuted,
                border: `1px solid ${colors.line}`,
                borderRadius: 999,
                padding: "4px 12px",
                marginBottom: 12,
              }}
            >
              {product.category}
            </div>
          )}
          <h1 style={{ fontSize: 27, marginBottom: 10 }}>{product.name}</h1>
          <div className="tag-price" style={{ fontSize: 20, fontWeight: 500, color: colors.coral, marginBottom: 20 }}>
            {formatRupiah(product.price)}
          </div>
          <p style={{ color: colors.textMuted, lineHeight: 1.7, marginBottom: 28 }}>
            {product.description}
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
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
                borderRadius: 4,
                border: `1px solid ${colors.line}`,
                fontFamily: fonts.body,
              }}
            />
            <span style={{ fontSize: 13, color: colors.textMuted }}>Stok: {product.stock}</span>
          </div>

          <button
            onClick={() => {
              addItem(product, qty);
              setAdded(true);
            }}
            disabled={product.stock <= 0}
            style={{
              padding: "13px 26px",
              background: product.stock <= 0 ? "#999" : colors.coral,
              color: "#fff",
              border: "none",
              borderRadius: 999,
              fontWeight: 600,
              fontFamily: fonts.body,
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
                padding: "13px 26px",
                background: "transparent",
                color: colors.ink,
                border: `1.5px solid ${colors.ink}`,
                borderRadius: 999,
                fontWeight: 600,
                fontFamily: fonts.body,
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
