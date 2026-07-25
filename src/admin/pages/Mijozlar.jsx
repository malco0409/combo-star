import { useState, useEffect } from "react";
import { getClients, saveClients, genId } from "../data/store";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
  padding: "8px 12px", width: "100%", fontFamily: "inherit",
};

const EMPTY = { name: "", phone: "", address: "", note: "" };

export default function Mijozlar() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY);

  useEffect(() => { setClients(getClients()); }, []);

  const update = (data) => { setClients(data); saveClients(data); };

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  const save = () => {
    if (!form.name || !form.phone) return alert("Ism va telefon majburiy!");
    update([{ ...form, id: genId("M"), date: new Date().toISOString().slice(0, 10) }, ...clients]);
    setShowModal(false);
    setForm(EMPTY);
  };

  const del = (id) => {
    if (window.confirm("O'chirishni tasdiqlaysizmi?"))
      update(clients.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold" style={{ color: text }}>
          Mijozlar <span className="text-sm font-normal" style={{ color: muted }}>({clients.length})</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-lg"
          style={{ background: "#a80000" }}
        >
          + Mijoz qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          style={{ ...inputStyle, maxWidth: "360px" }}
          placeholder="Qidirish: ism, telefon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: muted }}>Mijoz topilmadi</div>
        )}
        {filtered.map((c) => (
          <div key={c.id} style={card} className="px-4 py-3 flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
              style={{ background: "#3d0d0d", color: "#a80000" }}
            >
              {c.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm" style={{ color: text }}>{c.name}</div>
              <div className="text-xs mt-0.5" style={{ color: muted }}>{c.phone} · {c.address}</div>
              {c.note && <div className="text-xs mt-0.5" style={{ color: muted }}>{c.note}</div>}
            </div>
            <div className="text-xs" style={{ color: muted }}>{c.date}</div>
            <button
              onClick={() => del(c.id)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-sm"
              style={{ color: muted, background: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#3d0d0d"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = muted; }}
            >✕</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "16px", padding: "24px", width: "380px", maxWidth: "95%" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: text }}>Yangi mijoz</h2>
            <div className="space-y-3">
              {[
                { label: "Ism Familiya *", key: "name", placeholder: "To'liq ism" },
                { label: "Telefon *", key: "phone", placeholder: "+998..." },
                { label: "Manzil", key: "address", placeholder: "Shahar, tuman..." },
                { label: "Izoh", key: "note", placeholder: "VIP, maxsus holat..." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs block mb-1" style={{ color: muted }}>{f.label}</label>
                  <input
                    style={inputStyle}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}
              >Bekor</button>
              <button
                onClick={save}
                className="text-sm px-4 py-2 rounded-lg text-white"
                style={{ background: "#a80000" }}
              >Saqlash</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}