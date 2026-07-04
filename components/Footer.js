export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 90,
        padding: "36px 24px 40px",
        textAlign: "center",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-flou)",
          fontWeight: 600,
          fontSize: 18,
          marginBottom: 14,
        }}
      >
        flou project
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          flexWrap: "wrap",
          marginBottom: 16,
        }}
      >
        <a
          href="https://instagram.com/by.flouprojects"
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="#1A1A1A" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="4" stroke="#1A1A1A" strokeWidth="1.8" />
            <circle cx="17.2" cy="6.8" r="1.1" fill="#1A1A1A" />
          </svg>
          Instagram · @by.flouprojects
        </a>

        <a
          href="https://tiktok.com/@by.flouprojects"
          target="_blank"
          rel="noopener noreferrer"
          style={socialLinkStyle}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 3v10.2a2.8 2.8 0 1 1-2-2.68"
              stroke="#1A1A1A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 3c.3 2.2 2 3.9 4.2 4.2"
              stroke="#1A1A1A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          TikTok · @by.flouprojects
        </a>
      </div>

      <p style={{ fontSize: 12.5, color: "#5c5c5c", margin: 0 }}>
        &copy; {new Date().getFullYear()} Flou Project. Berbasis di Cianjur.
      </p>
    </footer>
  );
}

const socialLinkStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--font-body)",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#1A1A1A",
  textDecoration: "none",
};
