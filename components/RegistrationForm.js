"use client";

import { useState, useEffect } from "react";
import { colors, fonts } from "../lib/theme";

const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
const MIDTRANS_IS_PRODUCTION =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
const SNAP_SRC = MIDTRANS_IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

function formatRupiah(amount) {
  if (amount === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function RegistrationForm({ event }) {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [snapReady, setSnapReady] = useState(false);

  const isFree = event.price === 0;

  useEffect(() => {
    if (isFree) return; // event gratis tidak butuh Midtrans Snap
    const script = document.createElement("script");
    script.src = SNAP_SRC;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY || "");
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [isFree]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!isFree && (!snapReady || !window.snap)) {
      setMessage({ type: "error", text: "Sistem pembayaran belum siap, coba lagi sebentar." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, eventSlug: event.slug }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Pendaftaran gagal." });
        setLoading(false);
        return;
      }

      if (data.free) {
        setMessage({
          type: "success",
          text: "Pendaftaran berhasil! Sampai jumpa di lokasi ya.",
        });
        setLoading(false);
        return;
      }

      window.snap.pay(data.snapToken, {
        onSuccess: () => {
          setMessage({
            type: "success",
            text: "Pembayaran berhasil! Cek email kamu untuk konfirmasi.",
          });
        },
        onPending: () => {
          setMessage({
            type: "info",
            text: "Pembayaran kamu sedang diproses. Kami akan update status begitu terkonfirmasi.",
          });
        },
        onError: () => {
          setMessage({ type: "error", text: "Pembayaran gagal, silakan coba lagi." });
        },
        onClose: () => {
          setMessage({
            type: "info",
            text: "Kamu menutup jendela pembayaran sebelum selesai. Kamu bisa daftar ulang untuk melanjutkan.",
          });
        },
      });
    } catch (err) {
      setMessage({ type: "error", text: "Terjadi kesalahan, coba lagi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: colors.paperRaised,
        borderRadius: 16,
        padding: 32,
        border: `1px solid ${colors.line}`,
      }}
    >
      <h2 style={{ fontSize: 24, marginBottom: 4 }}>Daftar Sekarang</h2>
      <p style={{ color: colors.textMuted, marginBottom: 22, fontSize: 14 }}>
        Isi data di bawah untuk mengamankan tempatmu.
      </p>

      <Field label="Nama Lengkap">
        <input
          required
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama kamu"
          style={inputStyle}
        />
      </Field>

      <Field label="Email">
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@contoh.com"
          style={inputStyle}
        />
      </Field>

      <Field label="No. WhatsApp">
        <input
          required
          name="whatsapp"
          value={form.whatsapp}
          onChange={handleChange}
          placeholder="08xxxxxxxxxx"
          style={inputStyle}
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
          marginTop: 6,
        }}
      >
        {loading ? "Memproses..." : isFree ? "Daftar Gratis" : `Bayar ${formatRupiah(event.price)}`}
      </button>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
            background:
              message.type === "success"
                ? "#e9efe8"
                : message.type === "error"
                ? "#f6e8e5"
                : "#e8eef2",
            color:
              message.type === "success"
                ? colors.success
                : message.type === "error"
                ? colors.danger
                : colors.info,
          }}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: `1px solid ${colors.line}`,
  fontSize: 15,
  fontFamily: fonts.body,
  boxSizing: "border-box",
};
