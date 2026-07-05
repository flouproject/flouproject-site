"use client";

import { useState } from "react";
import { TICKET_TIERS } from "../lib/tickets";

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
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal.");
        setLoading(false);
        return;
      }

      const itemLabel = `Pendaftaran Workshop — ${data.ticketName}`;
      const url = `/pembayaran?orderId=${encodeURIComponent(data.orderId)}&amount=${data.amount}&item=${encodeURIComponent(itemLabel)}`;
      window.open(url, "_blank");
      setDone(true);
    } catch (err) {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const selectedTier = TICKET_TIERS.find((t) => t.id === form.ticketTier);

  if (done) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
          background: "#fff",
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Pendaftaran Berhasil! 🎉</h2>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
          Halaman pembayaran sudah terbuka di tab baru. Kalau tidak muncul
          (mungkin diblokir browser), klik tombol di bawah ini.
        </p>
        <button
          onClick={() => setDone(false)}
          style={{
            padding: "10px 20px",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Daftar Lagi
        </button>
      </div>
    );
  }

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
        {loading ? "Memproses..." : `Lanjut ke Pembayaran — ${selectedTier ? formatRupiah(selectedTier.price) : ""}`}
      </button>

      {error && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
            background: "#fdecea",
            color: "#c0392b",
          }}
        >
          {error}
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
