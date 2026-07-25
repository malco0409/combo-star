import { useEffect, useState } from "react";
import { getOrders, getClients, getCollections } from "../data/store";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const muted = "#64748b";
const text = "#e2e8f0";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [cols, setCols] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
    setClients(getClients());
    setCols(getCollections());
  }, []);

  const revenue = orders
    .filter((o) => o.pay === "To'langan")
    .reduce((a, o) => a + Number(o.price), 0);

  const stats = [
    { label: "Jami buyurtma", value: orders.length, icon: "📋", color: "#60a5fa" },
    { label: "Yangi", value: orders.filter((o) => o.status === "Yangi").length, icon: "🆕", color: "#fbbf24" },
    { label: "Mijozlar", value: clients.length, icon: "👥", color: "#34d399" },
    { label: "Tushum", value: (revenue / 1000000).toFixed(2) + " mln", icon: "💰", color: "#f87171" },
  ];

  const statusBadge = {
    Yangi: { background: "#1e3a5f", color: "#60a5fa" },
    Jarayonda: { background: "#3d2e00", color: "#fbbf24" },
    Tayyor: { background: "#0d3320", color: "#34d399" },
    Yetkazildi: { background: "#0d2e2e", color: "#2dd4bf" },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: text }}>Dashboard</h1>
        <p className="text-xs mt-1" style={{ color: muted }}>Umumiy ko'rsatkichlar va so'nggi faollik</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} style={card} className="p-4">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl sm:text-2xl font-semibold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: muted }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* So'nggi buyurtmalar */}
        <div style={card} className="p-4">
          <h2 className="text-sm font-medium mb-3" style={{ color: text }}>So'nggi buyurtmalar</h2>
          <div className="space-y-2">
            {orders.length === 0 && (
              <div className="text-sm text-center py-4" style={{ color: muted }}>Buyurtma yo'q</div>
            )}
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2d3748" }}>
                <div>
                  <div className="text-sm font-medium" style={{ color: text }}>{o.client}</div>
                  <div className="text-xs" style={{ color: muted }}>{o.date}</div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={statusBadge[o.status] || { background: "#2d3748", color: muted }}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Ombor holati */}
        <div style={card} className="p-4">
          <h2 className="text-sm font-medium mb-3" style={{ color: text }}>Ombor holati</h2>
          <div className="space-y-2">
            {cols.length === 0 && (
              <div className="text-sm text-center py-4" style={{ color: muted }}>Kolleksiya yo'q</div>
            )}
            {cols.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #2d3748" }}>
                <div className="flex items-center gap-2">
                  <span>{c.flag}</span>
                  <div>
                    <div className="text-sm font-medium" style={{ color: text }}>{c.name}</div>
                    <div className="text-xs" style={{ color: muted }}>{c.dims.length} o'lcham</div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={c.stock ? { background: "#0d3320", color: "#34d399" } : { background: "#3d0d0d", color: "#f87171" }}>
                  {c.stock ? "Bor ✅" : "Tugagan"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}