"use client";

import Link from "next/link";
import { useCart } from "../lib/CartContext";

const NAV_ITEMS = [
  { label: "Beranda", href: "/" },
  { label: "Info Workshop", href: "/workshop" },
  { label: "Produk", href: "/produk" },
  { label: "Keranjang", href: "/keranjang" },
  { label: "Kerjasama", href: "/kerjasama" },
];

export default function NavBar() {
  const { itemCount } = useCart();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "28px 16px 0",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "var(--color-pill)",
          backdropFilter: "blur(6px)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-pill)",
          padding: 6,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              textDecoration: "none",
              color: "var(--color-charcoal)",
              fontSize: 13,
              fontWeight: 500,
              position: "relative",
            }}
          >
            {item.label}
            {item.href === "/keranjang" && itemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  right: 4,
                  background: "var(--color-charcoal)",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: 10,
                  width: 16,
                  height: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {itemCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
