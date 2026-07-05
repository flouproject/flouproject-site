"use client";

import { useState } from "react";

const BANK_NAME = "SeaBank";
const ACCOUNT_NUMBER = "901877494480";
const ACCOUNT_HOLDER = "Laila Febriyuni Eka Putri";
const WA_NUMBER = "6283817498827"; // format internasional tanpa + / spasi

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ManualPaymentInfo({ orderId, amount, itemLabel }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard?.writeText(ACCOUNT_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const waMessage = `Halo Flou Project! Saya sudah transfer untuk ${itemLabel} (Order ID: ${orderId}) sebesar ${formatRupiah(
    amount
  )}. Berikut saya lampirkan bukti transfernya 🙏`;
  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5ded0",
        borderRadius: 14,
        padding: 28,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      <div style={{ fontSize: 13, color: "#8a8a8a", marginBottom: 4 }}>
        Order ID: {orderId}
      </div>
      <h3 style={{ fontSize: 19, marginBottom: 4 }}>Selesaikan Pembayaran</h3>
      <p style={{ fontSize: 13.5, color: "#666", marginBottom: 20 }}>
        Pembayaran otomatis belum aktif (masih proses approval Midtrans),
        untuk sementara transfer manual ke rekening berikut:
      </p>

      <div
        style={{
          background: "#FBF8F1",
          border: "1px solid #ece5d6",
          borderRadius: 10,
          padding: 18,
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 2 }}>Bank</div>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>{BANK_NAME}</div>

        <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 2 }}>Nomor Rekening</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "0.03em" }}>
            {ACCOUNT_NUMBER}
          </span>
          <button
            onClick={handleCopy}
            style={{
              fontSize: 12,
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid #ccc",
              background: copied ? "#e9efe8" : "#fff",
              cursor: "pointer",
            }}
          >
            {copied ? "Tersalin ✓" : "Salin"}
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 2 }}>Atas Nama</div>
        <div style={{ fontWeight: 700, marginBottom: 14 }}>{ACCOUNT_HOLDER}</div>

        <div style={{ fontSize: 12, color: "#8a8a8a", marginBottom: 2 }}>Total Transfer</div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#C9982E" }}>
          {formatRupiah(amount)}
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#666", marginBottom: 16, lineHeight: 1.6 }}>
        Setelah transfer, kirim bukti pembayaran via WhatsApp supaya kami bisa
        konfirmasi pesanan/pendaftaran kamu:
      </p>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: "100%",
          padding: "13px 0",
          background: "#25D366",
          color: "#fff",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 14.5,
          textDecoration: "none",
          boxSizing: "border-box",
        }}
      >
        Konfirmasi via WhatsApp
      </a>
    </div>
  );
}
