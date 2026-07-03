"use client";

import { useState, useEffect } from "react";
import { TICKET_TIERS } from "../lib/tickets";
import { colors, fonts } from "../lib/theme";

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
  const [message, setMessage] = useState(null);
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
        background: colors.paperRaised,
        borderRadius: 4,
        padding: 36,
        border: `1px solid ${colors.line}`,
      }}
    >
      <div style={{ fontFamily: fonts.accent, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: colors.sage, marginBottom: 10 }}>
        Workshop
      </div>
      <h1 style={{ fontSize: 25, marginBottom: 6 }}>Pendaftaran Workshop</h1>
      <p style={{ color: colors.textMuted, marginBottom: 26, fontSize: 14 }}>
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
        <p style={{ fontSize: 13, color: colors.textMuted, marginTop: -8, marginBottom: 16 }}>
          {selectedTier.description}
        </p>
      )}

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
        }}
      >
        {loading ? "Memproses..." : `Bayar ${selectedTier ? formatRupiah(selectedTier.price) : ""}`}
      </button>

      {message && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 4,
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
  borderRadius: 4,
  border: `1px solid ${colors.line}`,
  fontSize: 15,
  fontFamily: fonts.body,
  boxSizing: "border-box",
};
