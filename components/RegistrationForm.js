"use client";

import { useState, useEffect } from "react";
import { TICKET_TIERS } from "../lib/tickets";

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

export default function RegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    ticketTier: TICKET_TIERS[0]?.id || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error'|'info', text }
  const [snapReady, setSnapReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = SNAP_SRC;
    script.setAttribute("data-client-key", MIDTRANS_CLIENT_KEY || "");
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!snapReady || !window.snap) {
      setMessage({ type: "error", text: "Sistem pembayaran belum siap, coba lagi sebentar." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Pendaftaran gagal." });
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

  const selectedTier = TICKET_TIERS.find((t) => t.id === form.ticketTier);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 480,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 16,
        padding: 32,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Pendaftaran Workshop</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Isi data di bawah, lalu lanjutkan ke pembayaran.
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

      <Field label="Tipe Tiket">
        <select
          required
          name="ticketTier"
          value={form.ticketTier}
          onChange={handleChange}
          style={inputStyle}
        >
          {TICKET_TIERS.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.name} — {formatRupiah(tier.price)}
            </option>
          ))}
        </select>
      </Field>

      {selectedTier?.description && (
        <p style={{ fontSize: 13, color: "#888", marginTop: -8, marginBottom: 16 }}>
          {selectedTier.description}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "14px 0",
          background: loading ? "#999" : "#111",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Memproses..." : `Bayar ${selectedTier ? formatRupiah(selectedTier.price) : ""}`}
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
                ? "#e6f7ed"
                : message.type === "error"
                ? "#fdecea"
                : "#eef3fb",
            color:
              message.type === "success"
                ? "#1e7e42"
                : message.type === "error"
                ? "#c0392b"
                : "#2c5aa0",
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
  border: "1px solid #ddd",
  fontSize: 15,
  boxSizing: "border-box",
};
