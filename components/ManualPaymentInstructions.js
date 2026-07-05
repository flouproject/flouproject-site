"use client";

import { useState } from "react";
import { BANK_INFO, WHATSAPP_CONFIRM_NUMBER } from "../lib/payment";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function ManualPaymentInstructions({ orderId, amount, itemLabel, customerName }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(BANK_INFO.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const waMessage = encodeURIComponent(
    `Halo Flou Project, saya ${customerName} sudah transfer untuk ${itemLabel} (Order ID: ${orderId}) sejumlah ${formatRupiah(
      amount
    )}. Berikut saya lampirkan bukti transfernya.`
  );
  const waLink = `https://wa.me/${WHATSAPP_CONFIRM_NUMBER}?text=${waMessage}`;

  return (
    <div
      style={{
        background: "#FFF8EF",
        border: "1px solid #E8D9BF",
        borderRadius: 12,
        padding: 24,
        marginTop: 20,
      }}
    >
      <h3 style={{ fontSize: 17, marginBottom: 4 }}>Selesaikan Pembayaran</h3>
      <p style={{ fontSize: 13.5, color: "#6b6558", marginBottom: 18 }}>
        Order ID: <strong>{orderId}</strong>
      </p>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "#6b6558", marginBottom: 4 }}>
          Transfer sejumlah
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#C9982E" }}>
          {formatRupiah(amount)}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          marginBottom: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "#6b6558" }}>{BANK_INFO.bankName}</div>
          <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "0.02em" }}>
            {BANK_INFO.accountNumber}
          </div>
          <div style={{ fontSize: 13.5 }}>a.n. {BANK_INFO.accountHolder}</div>
        </div>
        <button
          onClick={handleCopy}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "1px solid #C9982E",
            background: copied ? "#C9982E" : "transparent",
            color: copied ? "#fff" : "#C9982E",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {copied ? "Tersalin!" : "Salin No. Rekening"}
        </button>
      </div>

      <ol style={{ fontSize: 13.5, color: "#3a3630", lineHeight: 1.8, paddingLeft: 18, marginBottom: 20 }}>
        <li>Transfer sesuai nominal di atas ke rekening tujuan.</li>
        <li>Simpan bukti transfernya (screenshot).</li>
        <li>Konfirmasi lewat WhatsApp lewat tombol di bawah, sertakan bukti transfer.</li>
      </ol>

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textAlign: "center",
          background: "#25D366",
          color: "#fff",
          padding: "14px 0",
          borderRadius: 999,
          textDecoration: "none",
          fontWeight: 700,
          fontSize: 15,
        }}
      >
        Konfirmasi via WhatsApp
      </a>
    </div>
  );
}
