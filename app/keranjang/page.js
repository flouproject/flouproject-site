"use client";

import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import { useCart } from "../../lib/CartContext";

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const SNAP_SRC = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

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
  const [message, setMessage] = useState(null);
  const [snapReady, setSnapReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = SNAP_SRC;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY || "");
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCheckout(e) {
    e.preventDefault();
    setMessage(null);
    if (items.length === 0) {
      setMessage({ type: "error", text: "Keranjang kamu masih kosong." });
      return;
    }
    if (!snapReady || !window.snap) {
      setMessage({ type: "error", text: "Sistem pembayaran belum siap, coba lagi sebentar." });
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
        setMessage({ type: "error", text: data.error || "Checkout gagal." });
        setLoading(false);
        return;
      }
      window.snap.pay(data.snapToken, {
        onSuccess: () => { setMessage({ type: "success", text: "Pembayaran berhasil! Terima kasih sudah belanja." }); clearCart(); },
        onPending: () => { setMessage({ type: "info", text: "Pembayaran sedang diproses." }); clearCart(); },
        onError: () => setMessage({ type: "error", text: "Pembayaran gagal, silakan coba lagi." }),
        onClose: () => setMessage({ type: "info", text: "Kamu menutup jendela pembayaran sebelum selesai." }),
      });
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(180deg, var(--color-sky-top) 0%, var(--color-sky-bottom) 55%)", zIndex: -1 }} />
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
              {loading ? "Memproses..." : `Bayar ${formatRupiah(total)}`}
            </button>
          </form>
        )}

        {message && (
          <div style={{ marginTop: 16, padding: 12, borderRadius: 8, fontSize: 14, background: message.type === "success" ? "#e6f7ed" : message.type === "error" ? "#fdecea" : "#eef3fb", color: message.type === "success" ? "#1e7e42" : message.type === "error" ? "#c0392b" : "#2c5aa0" }}>
            {message.text}
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
