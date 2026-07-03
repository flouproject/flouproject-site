"use client";

import Link from "next/link";
import { useCart } from "../lib/CartContext";

export default function NavBar() {
  const { itemCount } = useCart();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        background: "#fff",
        borderBottom: "1px solid #eee",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: 18, textDecoration: "none", color: "#111" }}>
        Nama Bisnis Kamu
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <Link href="/" style={linkStyle}>Beranda</Link>
        <Link href="/produk" style={linkStyle}>Produk</Link>
        <Link href="/workshop" style={linkStyle}>Workshop</Link>
        <Link href="/keranjang" style={{ ...linkStyle, position: "relative" }}>
          Keranjang
          {itemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -14,
                background: "#111",
                color: "#fff",
                borderRadius: "50%",
                fontSize: 11,
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "#333",
  fontSize: 14,
  fontWeight: 500,
};
