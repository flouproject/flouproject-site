# Flou Project — Website Toko & Workshop

Website lengkap dengan 3 bagian:
- **Beranda** — profil & sorotan Flou Project
- **Produk** (`/produk`) — katalog produk handmade dengan checkout online (Midtrans)
- **Workshop** (`/workshop`) — form pendaftaran & pembayaran workshop (Midtrans)
- **Admin** (`/admin`) — dashboard gabungan: pesanan produk & pendaftar workshop

Dibangun dengan Next.js + Supabase + Midtrans.

---

## 1. Setup Supabase (Database)

1. Buat project di [supabase.com](https://supabase.com) (gratis).
2. Buka **SQL Editor**, jalankan seluruh isi `supabase-schema.sql` (ada tabel `registrations`, `products`, `orders`, plus 2 contoh produk).
3. Ambil kredensial di **Project Settings > API Keys**:
   - **Project URL** → `SUPABASE_URL`
   - **Secret key** (`sb_secret_...`, tab "Publishable and secret API keys") **atau** **service_role key** (tab "Legacy API Keys") → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Setup Midtrans (Payment Gateway)

1. Daftar di [midtrans.com](https://midtrans.com).
2. Untuk testing, pakai mode **Sandbox** dulu (langsung aktif tanpa verifikasi).
3. Ambil di **Settings > Access Keys**:
   - `Server Key` → `MIDTRANS_SERVER_KEY`
   - `Client Key` → `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
4. Ajukan verifikasi bisnis/production sesegera mungkin kalau event/toko kamu perlu terima pembayaran sungguhan dalam waktu dekat — prosesnya butuh beberapa hari.
5. Setelah deploy, daftarkan **Payment Notification URL**:
   ```
   https://domain-kamu.vercel.app/api/webhook
   ```
   Webhook ini otomatis menangani transaksi produk maupun workshop.

## 3. Jalankan di Lokal

```bash
npm install
cp .env.example .env.local
# isi .env.local dengan kredensial kamu
npm run dev
```

- `http://localhost:3000` → Beranda
- `http://localhost:3000/produk` → Katalog produk
- `http://localhost:3000/workshop` → Form pendaftaran workshop
- `http://localhost:3000/admin` → Dashboard admin

## 4. Deploy ke Vercel

1. Push project ke GitHub.
2. Buka [vercel.com](https://vercel.com), import repo ini.
3. Masukkan semua environment variable dari `.env.example`.
4. Deploy → dapat URL publik.
5. Daftarkan URL webhook ke Midtrans (lihat langkah 2.5).

## 5. Kelola Produk

Untuk sekarang, tambah/ubah/hapus produk dilakukan langsung lewat **Supabase Dashboard > Table Editor > products**:
- `slug` — dipakai di URL, harus unik, contoh: `tas-rajut-mini`
- `price` — dalam Rupiah, angka bulat
- `image_url` — link gambar produk (bisa upload ke Supabase Storage atau host lain, lalu paste link-nya)
- `stock` — jumlah stok, otomatis berkurang saat pesanan lunas
- `is_active` — set `false` untuk sembunyikan produk dari katalog tanpa menghapusnya

## 6. Kelola Tiket Workshop

Edit file `lib/tickets.js` untuk ubah nama/harga/kuota tier tiket.

## 7. Sebelum Go-Live

- [ ] Sudah testing 1 transaksi produk & 1 transaksi workshop penuh di mode Sandbox
- [ ] Data produk asli sudah dimasukkan ke Supabase (nama, harga, foto, stok)
- [ ] Ganti ke kredensial **Production** Midtrans setelah verifikasi selesai
- [ ] Ganti `ADMIN_PASSWORD` ke password kuat
- [ ] Webhook production sudah terdaftar di Midtrans Dashboard
- [ ] Ganti "Nama Bisnis Kamu" di `app/page.js`, `app/layout.js`, dan `components/NavBar.js` dengan nama asli

## Catatan Keamanan

- `/admin` diproteksi password sederhana lewat header — cukup untuk skala kecil, jangan bagikan password ke sembarang orang.
- Semua interaksi database lewat API route server-side (Service Role/Secret Key), browser tidak pernah menyentuh database langsung.
- Harga & stok produk selalu divalidasi ulang di server saat checkout — client tidak bisa memanipulasi harga.
