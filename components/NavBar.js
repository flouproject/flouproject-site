"use client";

import Link from "next/link";
import { useCart } from "../lib/CartContext";
import { colors, fonts } from "../lib/theme";

export default function NavBar() {
  const { itemCount } = useCart();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: colors.paper,
        borderBottom: `1px solid ${colors.line}`,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="Flou Project"
          style={{ height: 40, width: "auto", display: "block" }}
        />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <Link href="/" style={linkStyle}>Beranda</Link>
        <Link href="/produk" style={linkStyle}>Produk</Link>
        <Link href="/workshop" style={linkStyle}>Workshop</Link>
        <Link href="/keranjang" style={{ ...linkStyle, position: "relative" }}>
          Keranjang
          {itemCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -10,
                right: -16,
                background: colors.coral,
                color: "#fff",
                borderRadius: "50%",
                fontSize: 11,
                fontFamily: fonts.body,
                fontWeight: 700,
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
  color: colors.ink,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: fonts.body,
};
