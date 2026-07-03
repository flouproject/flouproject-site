"use client";

import { useState } from "react";

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const statusColor = {
  paid: { bg: "#e6f7ed", text: "#1e7e42" },
  pending: { bg: "#fff8e1", text: "#a06a00" },
  failed: { bg: "#fdecea", text: "#c0392b" },
};

function StatusBadge({ status }) {
  const color = statusColor[status] || statusColor.pending;
  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: color.bg,
        color: color.text,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("orders"); // 'orders' | 'workshop'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadData(pwd) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-data", {
        headers: { "x-admin-password": pwd },
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Gagal memuat data.");
        setAuthed(false);
        return;
      }
      setRegistrations(json.registrations || []);
      setOrders(json.orders || []);
      setAuthed(true);
    } catch (err) {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <main style={{ padding: 48, maxWidth: 360, margin: "0 auto" }}>
        <h1 style={{ fontSize: 20, marginBottom: 16 }}>Admin Login</h1>
        <input
          type="password"
          placeholder="Password admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd",
            marginBottom: 12,
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={() => loadData(password)}
          disabled={loading}
          style={{
            width: "100%",
            padding: 12,
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {loading ? "Memuat..." : "Masuk"}
        </button>
        {error && <p style={{ color: "#c0392b", marginTop: 12, fontSize: 14 }}>{error}</p>}
      </main>
    );
  }

  const paidOrders = orders.filter((o) => o.payment_status === "paid");
  const paidRegs = registrations.filter((r) => r.payment_status === "paid");
  const totalRevenue =
    paidOrders.reduce((s, o) => s + o.amount, 0) + paidRegs.reduce((s, r) => s + r.amount, 0);

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 22 }}>Dashboard Admin</h1>
        <button
          onClick={() => loadData(password)}
          style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <StatCard label="Total Pesanan Produk" value={orders.length} />
        <StatCard label="Total Pendaftar Workshop" value={registrations.length} />
        <StatCard label="Total Pendapatan (Lunas)" value={formatRupiah(totalRevenue)} />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          Pesanan Produk ({orders.length})
        </TabButton>
        <TabButton active={tab === "workshop"} onClick={() => setTab("workshop")}>
          Pendaftar Workshop ({registrations.length})
        </TabButton>
      </div>

      {tab === "orders" ? (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Kontak</th>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                  <td style={tdStyle}>{o.customer_name}</td>
                  <td style={tdStyle}>
                    {o.email}
                    <br />
                    <span style={{ color: "#888" }}>{o.whatsapp}</span>
                  </td>
                  <td style={tdStyle}>
                    {o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}
                  </td>
                  <td style={tdStyle}>{formatRupiah(o.amount)}</td>
                  <td style={tdStyle}><StatusBadge status={o.payment_status} /></td>
                  <td style={tdStyle}>{o.midtrans_order_id}</td>
                  <td style={tdStyle}>{new Date(o.created_at).toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: "center", color: "#999" }}>Belum ada pesanan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ overflowX: "auto", background: "#fff", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>WhatsApp</th>
                <th style={thStyle}>Tiket</th>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Waktu</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                  <td style={tdStyle}>{r.name}</td>
                  <td style={tdStyle}>{r.email}</td>
                  <td style={tdStyle}>{r.whatsapp}</td>
                  <td style={tdStyle}>{r.ticket_name}</td>
                  <td style={tdStyle}>{formatRupiah(r.amount)}</td>
                  <td style={tdStyle}><StatusBadge status={r.payment_status} /></td>
                  <td style={tdStyle}>{r.midtrans_order_id}</td>
                  <td style={tdStyle}>{new Date(r.created_at).toLocaleString("id-ID")}</td>
                </tr>
              ))}
              {registrations.length === 0 && (
                <tr><td colSpan={8} style={{ padding: 24, textAlign: "center", color: "#999" }}>Belum ada pendaftar.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ flex: 1, minWidth: 180, background: "#fff", borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 13, color: "#888" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: 8,
        border: "1px solid #ddd",
        background: active ? "#111" : "#fff",
        color: active ? "#fff" : "#333",
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

const thStyle = { padding: "12px 16px", fontWeight: 600, color: "#555" };
const tdStyle = { padding: "12px 16px" };
