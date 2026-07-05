"use client";

import { useState } from "react";
import NavBar from "../../components/NavBar";
import { useCart } from "../../lib/CartContext";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function KeranjangPage() {
  const { items, updateQty, removeItem, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setError(null);
    if (items.length === 0) {
      setError("Keranjang kamu masih kosong.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout gagal.");
        setLoading(false);
        return;
      }
      const url = `/pembayaran?orderId=${encodeURIComponent(data.orderId)}&amount=${data.amount}&item=${encodeURIComponent("Pesanan Produk")}`;
      window.open(url, "_blank");
      clearCart();
      setDone(true);
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <NavBar />
        <main style={{ padding: "40px 24px 100px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <div style={{ background: "rgba(255,255,255,0.85)", borderRadius: 18, padding: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Checkout Berhasil! 🎉</h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
              Halaman pembayaran sudah terbuka di tab baru. Kalau tidak muncul
              (mungkin diblokir browser), klik tombol di bawah ini.
            </p>
            <button
              onClick={() => setDone(false)}
              style={{
                padding: "10px 20px",
                background: "var(--color-charcoal)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Belanja Lagi
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main style={{ padding: "40px 24px 100px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontSize: 30, marginBottom: 28, textAlign: "center" }}>Keranjang</h1>

        {items.length === 0 ? (
          <p style={{ color: "#555", textAlign: "center" }}>Keranjang kamu masih kosong.</p>
        ) : (
          <div style={{ marginBottom: 28 }}>
            {items.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.7)", borderRadius: 14, padding: 16, marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontFamily: "var(--font-heading)" }}>{item.name}</div>
                  <div style={{ color: "#555", fontSize: 13 }}>{formatRupiah(item.price)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="number" min={1} value={item.qty} onChange={(e) => updateQty(item.id, Number(e.target.value))} style={{ width: 56, padding: 6, borderRadius: 6, border: "1px solid var(--color-border)" }} />
                  <button onClick={() => removeItem(item.id)} style={{ border: "none", background: "none", color: "#b5493a", cursor: "pointer", fontSize: 13 }}>Hapus</button>
                </div>
              </div>
            ))}
            <div style={{ textAlign: "right", fontWeight: 700, fontSize: 18, marginTop: 12 }}>Total: {formatRupiah(total)}</div>
          </div>
        )}

        {items.length > 0 && (
          <form onSubmit={handleCheckout} style={{ background: "rgba(255,255,255,0.75)", borderRadius: 18, padding: 24 }}>
            <h2 style={{ fontSize: 18, marginBottom: 16 }}>Data Pengiriman</h2>
            <Field label="Nama Lengkap"><input required name="name" value={form.name} onChange={handleChange} style={inputStyle} /></Field>
            <Field label="Email"><input required type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} /></Field>
            <Field label="No. WhatsApp"><input required name="whatsapp" value={form.whatsapp} onChange={handleChange} style={inputStyle} /></Field>
            <Field label="Alamat Pengiriman"><textarea required name="address" value={form.address} onChange={handleChange} rows={3} style={{ ...inputStyle, resize: "vertical" }} /></Field>
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "14px 0", background: loading ? "#999" : "var(--color-charcoal)", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}>
              {loading ? "Memproses..." : `Lanjut ke Pembayaran — ${formatRupiah(total)}`}
            </button>
          </form>
        )}

        {error && (
          <div style={{ marginTop: 16, padding: 12, borderRadius: 8, fontSize: 14, background: "#fdecea", color: "#c0392b" }}>
            {error}
          </div>
        )}
      </main>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 15, boxSizing: "border-box", background: "#fff" };
