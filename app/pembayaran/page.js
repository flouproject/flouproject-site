"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "../../components/NavBar";
import ManualPaymentInfo from "../../components/ManualPaymentInfo";

function PembayaranContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const amount = Number(searchParams.get("amount") || 0);
  const item = searchParams.get("item") || "Pesanan";

  if (!orderId || !amount) {
    return (
      <main style={{ padding: "60px 24px", textAlign: "center", color: "#8a7f6c" }}>
        <p>Data pembayaran tidak ditemukan. Silakan ulangi proses pendaftaran/checkout.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: "48px 24px 100px", maxWidth: 640, margin: "0 auto" }}>
      <ManualPaymentInfo orderId={orderId} amount={amount} itemLabel={item} />
    </main>
  );
}

export default function PembayaranPage() {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(180deg, var(--color-sky-top) 0%, var(--color-sky-bottom) 55%)",
          zIndex: -1,
        }}
      />
      <NavBar />
      <Suspense fallback={<main style={{ padding: 60, textAlign: "center" }}>Memuat...</main>}>
        <PembayaranContent />
      </Suspense>
    </>
  );
}
