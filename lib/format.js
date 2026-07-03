export function formatRupiah(amount) {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

const MONTHS_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

// Dipakai untuk badge tanggal kecil di pojok gambar kartu event: { day: "14", month: "Jul" }
export function formatEventDateBadge(dateStr) {
  const d = new Date(dateStr);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS_SHORT[d.getMonth()] };
}

// Dipakai untuk teks tanggal lengkap, mis. "Sabtu, 14 Juli 2026"
export function formatEventDateLong(dateStr) {
  const d = new Date(dateStr);
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return `${days[d.getDay()]}, ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
}
