import Link from "next/link";
import { colors, fonts } from "../lib/theme";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${colors.line}`,
        padding: "40px 24px 28px",
        marginTop: 64,
      }}
    >
      <div
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <img src="/logo.png" alt="Flou Project" style={{ height: 34, width: "auto", marginBottom: 10 }} />
          <p style={{ fontSize: 13, color: colors.textMuted, maxWidth: 260, lineHeight: 1.6, margin: 0 }}>
            Produk handmade & workshop kriya, dibuat perlahan dan penuh perhatian.
          </p>
        </div>

        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <FooterCol
            title="Jelajahi"
            links={[
              { href: "/produk", label: "Produk" },
              { href: "/workshop", label: "Workshop" },
              { href: "/#tentang", label: "Tentang Kami" },
            ]}
          />
          <FooterCol
            title="Terhubung"
            links={[
              { href: "https://instagram.com", label: "Instagram" },
              { href: "https://wa.me/6280000000000", label: "WhatsApp" },
              { href: "mailto:halo@flouproject.id", label: "Email" },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: 1040,
          margin: "32px auto 0",
          paddingTop: 20,
          borderTop: `1px solid ${colors.line}`,
          fontSize: 12,
          color: colors.textMuted,
          fontFamily: fonts.body,
        }}
      >
        © {new Date().getFullYear()} Flou Project. Dibuat dengan tangan.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: colors.ink, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            style={{ fontSize: 14, color: colors.textMuted, textDecoration: "none" }}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
