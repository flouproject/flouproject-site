// Ubah/tambahkan tier tiket di sini sesuai kebutuhan workshop kamu.
// `id` harus unik, `price` dalam Rupiah (angka bulat, tanpa titik/koma).

export const TICKET_TIERS = [
  {
    id: "early_bird",
    name: "Early Bird",
    price: 150000,
    description: "Harga spesial untuk pendaftar tercepat",
    quota: 20, // opsional, dipakai untuk validasi kuota sederhana
  },
  {
    id: "reguler",
    name: "Reguler",
    price: 200000,
    description: "Harga normal",
    quota: 30,
  },
];

export function getTierById(id) {
  return TICKET_TIERS.find((t) => t.id === id);
}
