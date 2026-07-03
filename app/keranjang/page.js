"use client";

import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useCart } from "../../lib/CartContext";
import { colors, fonts } from "../../lib/theme";

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
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
        onSuccess: () => {
          setMessage({ type: "success", text: "Pembayaran berhasil! Terima kasih sudah belanja." });
          clearCart();
        },
        onPending: () => {
          setMessage({ type: "info", text: "Pembayaran sedang diproses." });
          clearCart();
        },
        onError: () => {
          setMessage({ type: "error", text: "Pembayaran gagal, silakan coba lagi." });
        },
        onClose: () => {
          setMessage({ type: "info", text: "Kamu menutup jendela pembayaran sebelum selesai." });
        },
      });
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavBar />
      <main style={{ padding: "48px 24px 72px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ fontFamily: fonts.accent, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.sage, marginBottom: 10 }}>
          Checkout
        </div>
        <h1 style={{ fontSize: 27, marginBottom: 28 }}>Keranjang Belanja</h1>

        {items.length === 0 ? (
          <p style={{ color: colors.textMuted }}>Keranjang kamu masih kosong.</p>
        ) : (
          <div style={{ marginBottom: 32 }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: colors.paperRaised,
                  borderRadius: 14,
                  border: `1px solid ${colors.line}`,
                  padding: 16,
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div className="tag-price" style={{ color: colors.textMuted, fontSize: 13 }}>
                    {formatRupiah(item.price)}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    style={{ width: 56, padding: 6, borderRadius: 4, border: `1px solid ${colors.line}` }}
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      border: "none",
                      background: "none",
                      color: colors.danger,
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: fonts.body,
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <div className="tag-price" style={{ textAlign: "right", fontWeight: 700, fontSize: 19, marginTop: 12, color: colors.coral }}>
              Total: {formatRupiah(total)}
            </div>
          </div>
        )}

        {items.length > 0 && (
          <form
            onSubmit={handleCheckout}
            style={{ background: colors.paperRaised, borderRadius: 16, border: `1px solid ${colors.line}`, padding: 28 }}
          >
            <h2 style={{ fontSize: 19, marginBottom: 18 }}>Data Pengiriman</h2>

            <Field label="Nama Lengkap">
              <input required name="name" value={form.name} onChange={handleChange} style={inputStyle} />
            </Field>
            <Field label="Email">
              <input required type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} />
            </Field>
            <Field label="No. WhatsApp">
              <input required name="whatsapp" value={form.whatsapp} onChange={handleChange} style={inputStyle} />
            </Field>
            <Field label="Alamat Pengiriman">
              <textarea
                required
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 0",
                background: loading ? "#999" : colors.coral,
                color: "#fff",
                border: "none",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 600,
                fontFamily: fonts.body,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 8,
              }}
            >
              {loading ? "Memproses..." : `Bayar ${formatRupiah(total)}`}
            </button>
          </form>
        )}

        {message && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 4,
              fontSize: 14,
              background: message.type === "success" ? "#e9efe8" : message.type === "error" ? "#f6e8e5" : "#e8eef2",
              color: message.type === "success" ? colors.success : message.type === "error" ? colors.danger : colors.info,
            }}
          >
            {message.text}
          </div>
        )}
      </main>
      <Footer />
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

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 4,
  border: `1px solid ${colors.line}`,
  fontSize: 15,
  fontFamily: fonts.body,
  boxSizing: "border-box",
};
