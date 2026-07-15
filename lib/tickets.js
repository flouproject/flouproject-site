// Ubah/tambahkan tier tiket di sini sesuai kebutuhan workshop kamu.
// `id` harus unik, `price` dalam Rupiah (angka bulat, tanpa titik/koma).

export const TICKET_TIERS = [
  {
    id: "reguler",
    name: "Reguler",
    price: 135000,
    description: "Harga normal",
    quota: 30,
  },
  // Early Bird disembunyikan (sudah lewat masa promo).
  // Aktifkan lagi dengan menghapus tanda komentar di bawah kalau perlu.
  // {
  //   id: "early_bird",
  //   name: "Early Bird",
  //   price: 130000,
  //   description: "Harga spesial untuk pendaftar tercepat",
  //   quota: 20,
  // },
];

export function getTierById(id) {
  return TICKET_TIERS.find((t) => t.id === id);
}
