import { useState, useEffect } from "react";
import { getOrders, saveOrders, getCollections, genId } from "../data/store";
import { PRODUCTS } from "./Ombor";

const STATUS = ["Yangi", "Jarayonda", "Tayyor", "Yetkazildi"];
const PAY = ["Kutilmoqda", "Qisman", "To'langan"];

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = { background: "#0f1117", border: "1px solid #2d3748", borderRadius: "8px", color: "#e2e8f0", fontSize: "13px", padding: "8px 12px", width: "100%", fontFamily: "inherit" };
const selectStyle = { ...inputStyle };

const statusStyle = {
  Yangi:      { background: "#1e3a5f", color: "#60a5fa" },
  Jarayonda:  { background: "#3d2e00", color: "#fbbf24" },
  Tayyor:     { background: "#0d3320", color: "#34d399" },
  Yetkazildi: { background: "#0d2e2e", color: "#2dd4bf" },
};
const payStyle = {
  "To'langan": { background: "#0d3320", color: "#34d399" },
  Kutilmoqda:  { background: "#3d0d0d", color: "#f87171" },
  Qisman:      { background: "#3d2e00", color: "#fbbf24" },
};

const EMPTY = {
  client: "", phone: "", address: "", product: "", colId: "",
  type: "", color: "", width: "", height: "",
  qty: 1, price: "", status: "Yangi", pay: "Kutilmoqda", note: "",
};

export default function Buyurtmalar() {
  const [orders, setOrders] = useState([]);
  const [cols, setCols] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPay, setFilterPay] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    setOrders(getOrders());
    setCols(getCollections());
  }, []);

  const update = (data) => { setOrders(data); saveOrders(data); };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const m = !q || o.client.toLowerCase().includes(q) || o.phone.includes(q) || o.id.toLowerCase().includes(q);
    return m && (!filterStatus || o.status === filterStatus) && (!filterPay || o.pay === filterPay);
  });

  // Tanlangan mahsulotga mos kolleksiyalar
  const availableCols = form.product
    ? cols.filter((c) => c.product === form.product)
    : cols;

  const selectProduct = (product) => {
    setForm((p) => ({ ...p, product, colId: "", type: "" }));
  };

  const fillFromCol = (colId) => {
    const c = cols.find((x) => x.id === colId);
    if (c) setForm((p) => ({ ...p, colId, type: c.type + " — " + c.name }));
  };

  const save = () => {
    if (!form.client || !form.phone) return alert("Ism va telefon majburiy!");
    update([{ ...form, id: genId("B"), date: new Date().toISOString().slice(0, 10) }, ...orders]);
    setShowModal(false);
    setForm(EMPTY);
  };

  const updateField = (id, field, val) =>
    update(orders.map((o) => (o.id === id ? { ...o, [field]: val } : o)));

  const del = (id) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?"))
      update(orders.filter((o) => o.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold" style={{ color: text }}>
          Buyurtmalar <span className="text-sm font-normal" style={{ color: muted }}>({orders.length})</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-lg"
          style={{ background: "#a80000" }}
        >
          + Yangi buyurtma
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          style={{ ...inputStyle, flex: 1, minWidth: "180px" }}
          placeholder="Qidirish: ism, tel, ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select style={selectStyle} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Barcha holat</option>
          {STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select style={selectStyle} value={filterPay} onChange={(e) => setFilterPay(e.target.value)}>
          <option value="">Barcha to'lov</option>
          {PAY.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: muted }}>Buyurtma topilmadi</div>
        )}
        {filtered.map((o) => {
          const col = cols.find((c) => c.id === o.colId);
          return (
            <div key={o.id} style={card} className="overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                style={{ borderBottom: expanded === o.id ? "1px solid #2d3748" : "none" }}
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                {col && <span>{col.flag}</span>}
                <span className="text-xs w-10" style={{ color: muted }}>{o.id}</span>
                <span className="font-medium text-sm flex-1" style={{ color: text }}>{o.client}</span>
                {o.source === "web" && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#0d2e2e", color: "#2dd4bf" }}>
                    🌐 Sayt
                  </span>
                )}
                {o.product && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#2d1a4d", color: "#c084fc" }}>
                    {o.product}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={statusStyle[o.status] || {}}>
                  {o.status}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={payStyle[o.pay] || {}}>
                  {o.pay}
                </span>
                <span style={{ color: muted, fontSize: "14px", transition: "transform .2s", display: "inline-block", transform: expanded === o.id ? "rotate(180deg)" : "none" }}>▾</span>
              </div>

              {expanded === o.id && (
                <div className="px-4 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                    {[
                      { label: "Telefon", value: o.phone },
                      { label: "Manzil", value: o.address },
                      { label: "Sana", value: o.date },
                      { label: "Mahsulot", value: o.product || "—" },
                      { label: "Kolleksiya", value: col ? col.name : "—" },
                      { label: "O'lcham", value: `${o.width} × ${o.height} sm` },
                      { label: "Rang / Miqdor", value: `${o.color || "—"} / ${o.qty} dona` },
                      { label: "Narx", value: Number(o.price).toLocaleString() + " so'm", bold: true },
                    ].map((f) => (
                      <div key={f.label}>
                        <span className="text-xs block mb-0.5" style={{ color: muted }}>{f.label}</span>
                        <span style={{ color: f.bold ? "#a80000" : text, fontWeight: f.bold ? 600 : 400 }}>{f.value}</span>
                      </div>
                    ))}
                    {o.note && (
                      <div className="col-span-3">
                        <span className="text-xs block mb-0.5" style={{ color: muted }}>Izoh</span>
                        <span style={{ color: text }}>{o.note}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs" style={{ color: muted }}>Holat:</span>
                    <select
                      style={{ ...selectStyle, width: "auto", padding: "4px 8px" }}
                      value={o.status}
                      onChange={(e) => updateField(o.id, "status", e.target.value)}
                    >
                      {STATUS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <span className="text-xs" style={{ color: muted }}>To'lov:</span>
                    <select
                      style={{ ...selectStyle, width: "auto", padding: "4px 8px" }}
                      value={o.pay}
                      onChange={(e) => updateField(o.id, "pay", e.target.value)}
                    >
                      {PAY.map((p) => <option key={p}>{p}</option>)}
                    </select>
                    <button
                      onClick={() => del(o.id)}
                      className="ml-auto text-xs px-3 py-1.5 rounded-lg"
                      style={{ background: "#3d0d0d", color: "#f87171", border: "1px solid #7f1d1d" }}
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "16px", padding: "24px", width: "480px", maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: text }}>Yangi buyurtma</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Mijoz ismi *", key: "client", placeholder: "Ism Familiya" },
                { label: "Telefon *", key: "phone", placeholder: "+998..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs block mb-1" style={{ color: muted }}>{f.label}</label>
                  <input style={inputStyle} placeholder={f.placeholder} value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: muted }}>Manzil</label>
                <input style={inputStyle} placeholder="Shahar, tuman..." value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
              </div>

              {/* Mahsulot */}
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: muted }}>Mahsulot</label>
                <select style={selectStyle} value={form.product} onChange={(e) => selectProduct(e.target.value)}>
                  <option value="">— tanlang —</option>
                  {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Kolleksiya — faqat tanlangan mahsulotga mos */}
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: muted }}>Kolleksiya</label>
                <select
                  style={selectStyle}
                  value={form.colId}
                  onChange={(e) => fillFromCol(e.target.value)}
                  disabled={!form.product}
                >
                  <option value="">{form.product ? "— tanlang —" : "avval mahsulot tanlang"}</option>
                  {availableCols.map((c) => (
                    <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Rang</label>
                <input style={inputStyle} placeholder="Oq..." value={form.color}
                  onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Miqdor</label>
                <input type="number" style={inputStyle} value={form.qty}
                  onChange={(e) => setForm((p) => ({ ...p, qty: e.target.value }))} />
              </div>

              {[
                { label: "Eni (sm)", key: "width" },
                { label: "Balandligi (sm)", key: "height" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs block mb-1" style={{ color: muted }}>{f.label}</label>
                  <input type="number" style={inputStyle} value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Narx (so'm)</label>
                <input type="number" style={inputStyle} value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Holat</label>
                <select style={selectStyle} value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>To'lov</label>
                <select style={selectStyle} value={form.pay}
                  onChange={(e) => setForm((p) => ({ ...p, pay: e.target.value }))}>
                  {PAY.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: muted }}>Izoh</label>
                <textarea style={{ ...inputStyle, resize: "none" }} rows={2} value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>
                Bekor
              </button>
              <button onClick={save}
                className="text-sm px-4 py-2 rounded-lg text-white"
                style={{ background: "#a80000" }}>
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}