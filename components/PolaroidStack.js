// Placeholder collage foto ala polaroid, mengikuti komposisi mockup kamu.
// Ganti `src` di array PHOTOS di bawah dengan URL foto asli kamu nanti
// (misal setelah upload ke Supabase Storage atau hosting gambar lain).
// Kalau `src` kosong, akan tampil placeholder abu-abu dengan label.

const LEFT_PHOTOS = [
  { src: "/images/produk-1.jpg", label: "Produk", top: "0px", left: "0px", rotate: "-6deg", size: 150 },
  { src: "/images/workshop-1.jpg", label: "Workshop", top: "150px", left: "40px", rotate: "4deg", size: 110 },
  { src: "/images/produk-2.jpg", label: "Produk", top: "180px", left: "-60px", rotate: "-3deg", size: 110 },
];

const RIGHT_PHOTOS = [
  { src: "/images/workshop-2.jpg", label: "Workshop", top: "0px", right: "0px", rotate: "5deg", size: 130 },
  { src: "/images/workshop-3.jpg", label: "Workshop", top: "160px", right: "-30px", rotate: "-4deg", size: 150 },
];

export default function PolaroidStack({ side }) {
  const photos = side === "left" ? LEFT_PHOTOS : RIGHT_PHOTOS;
  const positionStyle = side === "left" ? { left: "2%" } : { right: "2%" };

  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        ...positionStyle,
        width: 220,
        height: 320,
      }}
      className="polaroid-stack"
    >
      {photos.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            right: p.right,
            width: p.size,
            transform: `rotate(${p.rotate})`,
            background: "#fff",
            padding: 8,
            paddingBottom: 22,
            borderRadius: 4,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              background: p.src ? undefined : "#D8D2C4",
              backgroundImage: p.src ? `url(${p.src})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#8a8a8a",
              textAlign: "center",
              padding: 4,
            }}
          >
            {!p.src && p.label}
          </div>
        </div>
      ))}
    </div>
  );
}
