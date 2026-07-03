// Versi mobile dari koleksi foto: baris horizontal kecil,
// muncul di atas & bawah teks "flou project" (lihat app/globals.css
// untuk aturan tampil/sembunyi berdasarkan lebar layar).

export default function PolaroidRow({ photos }) {
  return (
    <div className="polaroid-row-mobile">
      {photos.map((p, i) => (
        <div
          key={i}
          className="polaroid-row-item"
          style={{ transform: `rotate(${i % 2 === 0 ? "-5deg" : "5deg"})` }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "1/1",
              background: p.src ? undefined : "#D8D2C4",
              backgroundImage: p.src ? `url(${p.src})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      ))}
    </div>
  );
}
