-- Jalankan script ini di Supabase Dashboard > SQL Editor

create extension if not exists "pgcrypto";

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  ticket_tier text not null,
  ticket_name text not null,
  amount integer not null,
  payment_status text not null default 'pending', -- pending | paid | failed | expired
  midtrans_order_id text unique not null,
  midtrans_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_registrations_order_id on registrations (midtrans_order_id);
create index if not exists idx_registrations_status on registrations (payment_status);

-- Trigger sederhana untuk auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_set_updated_at on registrations;
create trigger trg_set_updated_at
before update on registrations
for each row execute function set_updated_at();

-- Row Level Security: matikan akses publik langsung.
-- Semua akses lewat API route (pakai Service Role Key), bukan dari browser.
alter table registrations enable row level security;
-- Tidak ada policy dibuat = tidak ada akses publik sama sekali (aman by default).

-- =========================================================
-- PRODUK HANDMADE & PESANAN (TOKO)
-- =========================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  price integer not null,
  image_url text,
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products enable row level security;
drop policy if exists "Public can view active products" on products;
create policy "Public can view active products"
  on products for select
  using (is_active = true);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  email text not null,
  whatsapp text not null,
  address text not null,
  items jsonb not null,
  amount integer not null,
  payment_status text not null default 'pending',
  fulfillment_status text not null default 'unfulfilled',
  midtrans_order_id text unique not null,
  midtrans_transaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_order_id on orders (midtrans_order_id);
create index if not exists idx_orders_status on orders (payment_status);

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at
before update on orders
for each row execute function set_updated_at();

alter table orders enable row level security;

insert into products (slug, name, description, price, image_url, stock)
values
  ('tas-rajut-mini', 'Tas Rajut Mini', 'Tas rajut handmade ukuran mini, cocok buat sehari-hari.', 85000, null, 10),
  ('gantungan-kunci-flanel', 'Gantungan Kunci Flanel', 'Gantungan kunci lucu dari kain flanel, dibuat tangan.', 25000, null, 20)
on conflict (slug) do nothing;

-- =========================================================
-- EVENT / WORKSHOP (banyak event, masing-masing punya tanggal,
-- lokasi, gambar & harga sendiri — dipakai di halaman /workshop
-- ala listing "mynoosa": grid kartu + filter kategori)
-- =========================================================

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  image_url text,
  category text not null default 'lainnya',
  location text not null default 'Flou Project Space',
  event_date date not null,
  event_time text not null default '',
  price integer not null default 0,
  quota integer,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table events enable row level security;
drop policy if exists "Public can view active events" on events;
create policy "Public can view active events"
  on events for select
  using (is_active = true);

-- Hubungkan pendaftaran ke event tertentu. Kolom lama (ticket_tier,
-- ticket_name) tetap dipakai untuk menyimpan slug & judul event supaya
-- dashboard admin yang sudah ada tidak perlu diubah.
alter table registrations add column if not exists event_id uuid references events(id);

create index if not exists idx_registrations_event_id on registrations (event_id);

insert into events (slug, title, description, category, location, event_date, event_time, price, quota, image_url)
values
  (
    'rajut-untuk-pemula',
    'Workshop Rajut untuk Pemula',
    'Belajar teknik dasar merajut dari nol — tusuk rantai, tunggal, dan ganda — sampai pulang bawa pulang karya sendiri. Semua alat & bahan disediakan.',
    'rajut',
    'Flou Project Space, Bandung',
    current_date + interval '14 days',
    '09.00 - 12.00',
    150000,
    15,
    null
  ),
  (
    'makrame-dasar',
    'Kelas Makrame Dasar: Gantungan Dinding',
    'Kenalan sama simpul-simpul dasar makrame dan bikin gantungan dinding mini buat mempercantik ruangan kamu.',
    'makrame',
    'Flou Project Space, Bandung',
    current_date + interval '21 days',
    '13.00 - 16.00',
    175000,
    12,
    null
  ),
  (
    'flanel-keluarga',
    'Workshop Flanel: Orang Tua & Anak',
    'Sesi seru bikin gantungan kunci flanel bareng si kecil. Cocok untuk anak usia 6 tahun ke atas, ditemani orang tua.',
    'flanel',
    'Flou Project Space, Bandung',
    current_date + interval '28 days',
    '10.00 - 12.00',
    120000,
    20,
    null
  ),
  (
    'ngobrol-kriya',
    'Ngobrol Kriya: Temu Komunitas',
    'Sesi santai kumpul bareng komunitas kriya lokal — sharing proses berkarya, tukar ide, sambil ngeteh bareng. Gratis, kuota terbatas.',
    'komunitas',
    'Flou Project Space, Bandung',
    current_date + interval '7 days',
    '16.00 - 18.00',
    0,
    30,
    null
  )
on conflict (slug) do nothing;

-- =========================================================
-- KATEGORI PRODUK (untuk chip filter di halaman /produk)
-- Jalankan blok ini di Supabase SQL Editor jika tabel products
-- sudah ada sebelumnya (aman dijalankan berkali-kali).
-- =========================================================

alter table products add column if not exists category text not null default 'lainnya';

update products set category = 'rajut' where slug = 'tas-rajut-mini';
update products set category = 'flanel' where slug = 'gantungan-kunci-flanel';

-- Contoh nilai category yang bisa kamu pakai untuk produk baru:
-- 'rajut', 'flanel', 'keramik', 'kayu', 'kertas', dst — bebas sesuai jenis produkmu.
-- Chip filter di halaman Produk otomatis mengikuti nilai category yang ada di data.
