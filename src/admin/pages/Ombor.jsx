import { useState, useEffect } from "react";
import { getCollections, saveCollections, genId } from "../data/store";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
  padding: "8px 12px", width: "100%", fontFamily: "inherit",
};
const editInputStyle = {
  background: "#0f1117", border: "1px solid #a80000",
  borderRadius: "6px", color: "#e2e8f0", fontSize: "12px",
  padding: "3px 6px", fontFamily: "monospace",
};

const TYPE_STYLES = {
  RULON: { background: "#1e3a5f", color: "#60a5fa" },
  ATXOD: { background: "#3d2e00", color: "#fbbf24" },
};

export const PRODUCTS = ["Plisse", "Combo", "Dikkey", "Rollo", "DablRoll", "Maskitniy setka", "Senaks", "Razdvijnoy"];

const EMPTY_COL = { name: "", flag: "", type: "RULON", len: "", width: "", product: PRODUCTS[0], stock: true };

function sqm(w, h, qty) {
  return ((w * h * qty) / 10000).toFixed(2);
}

export default function Ombor() {
  const [cols, setCols] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [filterProduct, setFilterProduct] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newCol, setNewCol] = useState(EMPTY_COL);
  const [newDim, setNewDim] = useState({});
  const [editing, setEditing] = useState(null);
  const [editVal, setEditVal] = useState({ w: "", h: "", qty: "" });
  const [editingCol, setEditingCol] = useState(null);
  const [editColVal, setEditColVal] = useState({});

  useEffect(() => { setCols(getCollections()); }, []);

  const update = (data) => { setCols(data); saveCollections(data); };

  const q = search.toLowerCase().trim();

  const filtered = cols.filter((c) => {
    const nameMatch = !q || c.name.toLowerCase().includes(q);
    const dimMatch = !q || c.dims.some(
      (d) => `${d.w}x${d.h}`.includes(q) || String(d.w).includes(q) || String(d.h).includes(q)
    );
    const typeMatch = !filterType || c.type === filterType;
    const stockMatch = filterStock === "" || String(c.stock) === filterStock;
    const productMatch = !filterProduct || c.product === filterProduct;
    return (nameMatch || dimMatch) && typeMatch && stockMatch && productMatch;
  });

  const toggleCol = (id) =>
    update(cols.map((c) => (c.id === id ? { ...c, open: !c.open } : c)));

  const delCol = (id) => {
    if (window.confirm("Kolleksiyani o'chirish?"))
      update(cols.filter((c) => c.id !== id));
  };

  const delDim = (cid, i) => {
    setEditing(null);
    update(cols.map((c) =>
      c.id === cid ? { ...c, dims: c.dims.filter((_, idx) => idx !== i) } : c
    ));
  };

  const chQty = (cid, i, delta) =>
    update(cols.map((c) =>
      c.id === cid
        ? { ...c, dims: c.dims.map((d, idx) => idx === i ? { ...d, qty: Math.max(1, (d.qty || 1) + delta) } : d) }
        : c
    ));

  const startEdit = (cid, i, d) => {
    setEditing({ cid, i });
    setEditVal({ w: d.w, h: d.h, qty: d.qty || 1 });
  };

  const saveEdit = () => {
    if (!editVal.w || !editVal.h) return alert("Eni va balandligini kiriting!");
    const { cid, i } = editing;
    update(cols.map((c) =>
      c.id === cid
        ? { ...c, dims: c.dims.map((d, idx) => idx === i ? { w: +editVal.w, h: +editVal.h, qty: +editVal.qty || 1 } : d) }
        : c
    ));
    setEditing(null);
  };

  const startEditCol = (e, c) => {
    e.stopPropagation();
    setEditingCol(c.id);
    setEditColVal({ name: c.name, flag: c.flag, type: c.type, len: c.len, width: c.width || "", product: c.product || PRODUCTS[0], stock: c.stock });
  };

  const saveEditCol = (e) => {
    e.stopPropagation();
    if (!editColVal.name.trim()) return alert("Nom majburiy!");
    update(cols.map((c) =>
      c.id === editingCol ? { ...c, ...editColVal, len: Number(editColVal.len) || 0, width: Number(editColVal.width) || 0 } : c
    ));
    setEditingCol(null);
  };

  const cancelEditCol = (e) => {
    e.stopPropagation();
    setEditingCol(null);
  };

  const addDim = (cid) => {
    const { w, h, qty } = newDim[cid] || {};
    if (!w || !h) return alert("Eni va balandligini kiriting!");
    update(cols.map((c) =>
      c.id === cid ? { ...c, dims: [...c.dims, { w: +w, h: +h, qty: +(qty || 1) }] } : c
    ));
    setNewDim((p) => ({ ...p, [cid]: { w: "", h: "", qty: "" } }));
  };

  const saveCol = () => {
    if (!newCol.name.trim()) return alert("Nom majburiy!");
    update([{
      id: genId("c"), name: newCol.name.trim(),
      flag: newCol.flag || "📦", type: newCol.type,
      len: Number(newCol.len) || 0, width: Number(newCol.width) || 0,
      product: newCol.product,
      stock: newCol.stock, open: true, dims: [],
    }, ...cols]);
    setNewCol(EMPTY_COL);
    setShowModal(false);
  };

  const totalDims = cols.reduce((a, c) => a + c.dims.length, 0);
  const totalSqm = cols.reduce((a, c) =>
    a + c.dims.reduce((b, d) => b + (d.w * d.h * (d.qty || 1)) / 10000, 0), 0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-semibold" style={{ color: text }}>Omborxona</h1>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-sm text-white rounded-lg"
          style={{ background: "#a80000" }}>
          + Kolleksiya qo'shish
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { lbl: "Kolleksiyalar", val: cols.length },
          { lbl: "Mavjud", val: cols.filter((c) => c.stock).length, green: true },
          { lbl: "Jami o'lchamlar", val: totalDims },
          { lbl: "Jami maydon", val: totalSqm.toFixed(2) + " m²", blue: true },
        ].map((s) => (
          <div key={s.lbl} style={card} className="p-3">
            <div className="text-xs mb-1" style={{ color: muted }}>{s.lbl}</div>
            <div className="text-xl font-semibold"
              style={{ color: s.green ? "#34d399" : s.blue ? "#60a5fa" : text }}>
              {s.val}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input style={{ ...inputStyle, flex: 1, minWidth: "180px" }}
          placeholder="Qidirish: nom, o'lcham (164x294)..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <select style={{ ...inputStyle, width: "auto" }} value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
          <option value="">Barcha mahsulot</option>
          {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select style={{ ...inputStyle, width: "auto" }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Barcha tur</option>
          <option>RULON</option>
          <option>ATXOD</option>
        </select>
        <select style={{ ...inputStyle, width: "auto" }} value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
          <option value="">Barchasi</option>
          <option value="true">Mavjud</option>
          <option value="false">Tugagan</option>
        </select>
      </div>

      {/* Collections */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-sm" style={{ color: muted }}>Hech narsa topilmadi</div>
        )}
        {filtered.map((c) => {
          const colSqm = c.dims.reduce((a, d) => a + (d.w * d.h * (d.qty || 1)) / 10000, 0);
          const isEditingThisCol = editingCol === c.id;

          return (
            <div key={c.id} style={card} className="overflow-hidden">

              {isEditingThisCol ? (
                <div className="px-4 py-3" style={{ borderBottom: "1px solid #a80000", background: "#111827" }}
                  onClick={(e) => e.stopPropagation()}>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Nomi</label>
                      <input style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.name}
                        onChange={(e) => setEditColVal((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Bayroq</label>
                      <input style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.flag}
                        onChange={(e) => setEditColVal((p) => ({ ...p, flag: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Mahsulot</label>
                      <select style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.product}
                        onChange={(e) => setEditColVal((p) => ({ ...p, product: e.target.value }))}>
                        {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Tur</label>
                      <select style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.type}
                        onChange={(e) => setEditColVal((p) => ({ ...p, type: e.target.value }))}>
                        <option>RULON</option>
                        <option>ATXOD</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Mavjudligi</label>
                      <select style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.stock}
                        onChange={(e) => setEditColVal((p) => ({ ...p, stock: e.target.value === "true" }))}>
                        <option value="true">Bor ✅</option>
                        <option value="false">Qo'magan ❌</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Kenglik (sm)</label>
                      <input type="number" style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.width}
                        onChange={(e) => setEditColVal((p) => ({ ...p, width: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-xs block mb-1" style={{ color: muted }}>Uzunlik (m)</label>
                      <input type="number" style={{ ...editInputStyle, width: "100%", padding: "5px 8px" }}
                        value={editColVal.len}
                        onChange={(e) => setEditColVal((p) => ({ ...p, len: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={cancelEditCol}
                      className="text-xs px-3 py-1.5 rounded"
                      style={{ background: "#0f1117", border: "1px solid #2d3748", color: muted }}>
                      Bekor
                    </button>
                    <button onClick={saveEditCol}
                      className="text-xs px-3 py-1.5 rounded text-white"
                      style={{ background: "#a80000" }}>
                      Saqlash
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                  style={{ borderBottom: c.open ? "1px solid #2d3748" : "none" }}
                  onClick={() => toggleCol(c.id)}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="font-medium text-sm flex-1" style={{ color: text }}>{c.name}</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#2d1a4d", color: "#c084fc" }}>
                      {c.product || "—"}
                    </span>
                    {c.len > 0 && <span className="text-xs" style={{ color: muted }}>{c.len} m</span>}
                    {c.width > 0 && <span className="text-xs" style={{ color: muted }}>{c.width} sm keng</span>}
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={TYPE_STYLES[c.type] || { background: "#2d3748", color: muted }}>
                      {c.type}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={c.stock ? { background: "#0d3320", color: "#34d399" } : { background: "#3d0d0d", color: "#f87171" }}>
                      {c.stock ? "Bor ✅" : "Qo'magan ❌"}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#60a5fa" }}>{colSqm.toFixed(2)} m²</span>
                    <span className="text-xs" style={{ color: muted }}>{c.dims.length} o'lcham</span>
                    <button onClick={(e) => startEditCol(e, c)}
                      className="w-6 h-6 flex items-center justify-center rounded text-xs"
                      style={{ color: "#60a5fa", background: "#1e3a5f" }}
                      title="Tahrirlash">✎</button>
                    <button onClick={(e) => { e.stopPropagation(); delCol(c.id); }}
                      className="w-6 h-6 flex items-center justify-center rounded text-sm"
                      style={{ color: muted }}>✕</button>
                  </div>
                  <span style={{ color: muted, fontSize: "14px", display: "inline-block", transition: "transform .2s", transform: c.open ? "rotate(180deg)" : "none" }}>▾</span>
                </div>
              )}

              {c.open && !isEditingThisCol && (
                <div>
                  <div style={{ overflowX: "auto" }}>
                  <table className="text-sm" style={{ minWidth: "545px", width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
                    <colgroup>
                      <col style={{ width: "130px" }} />
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "75px" }} />
                      <col style={{ width: "100px" }} />
                      <col style={{ width: "85px" }} />
                      <col style={{ width: "80px" }} />
                    </colgroup>
                    <thead>
                      <tr style={{ background: "#0f1117", borderBottom: "1px solid #2d3748" }}>
                        {["O'lcham", "Eni", "Balandligi", "Miqdor", "Maydon", ""].map((h) => (
                          <th key={h} className="text-left px-3 py-2"
                            style={{ fontSize: "11px", color: muted, fontWeight: 500 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {c.dims.map((d, i) => {
                        const isEditingDim = editing && editing.cid === c.id && editing.i === i;
                        const hi = !isEditingDim && q && q.length > 1 && (
                          `${d.w}x${d.h}`.includes(q) || String(d.w).includes(q) || String(d.h).includes(q)
                        );
                        return (
                          <tr key={i} style={{
                            borderBottom: "1px solid #2d3748",
                            background: isEditingDim ? "#111827" : hi ? "#2d1a0e" : "transparent"
                          }}>
                            {isEditingDim ? (
                              <>
                                <td className="px-3 py-2" colSpan={3}>
                                  <div className="flex items-center gap-2">
                                    <input type="number" value={editVal.w} autoFocus
                                      onChange={(e) => setEditVal((p) => ({ ...p, w: e.target.value }))}
                                      style={{ ...editInputStyle, width: "58px" }} />
                                    <span style={{ color: muted }}>×</span>
                                    <input type="number" value={editVal.h}
                                      onChange={(e) => setEditVal((p) => ({ ...p, h: e.target.value }))}
                                      style={{ ...editInputStyle, width: "58px" }} />
                                  </div>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-1">
                                    <button onClick={() => setEditVal((p) => ({ ...p, qty: Math.max(1, +p.qty - 1) }))}
                                      className="w-5 h-5 flex items-center justify-center rounded text-xs"
                                      style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>−</button>
                                    <input type="number" value={editVal.qty}
                                      onChange={(e) => setEditVal((p) => ({ ...p, qty: e.target.value }))}
                                      style={{ ...editInputStyle, width: "34px", textAlign: "center" }} />
                                    <button onClick={() => setEditVal((p) => ({ ...p, qty: +p.qty + 1 }))}
                                      className="w-5 h-5 flex items-center justify-center rounded text-xs"
                                      style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>+</button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs" style={{ color: "#60a5fa" }}>
                                  {editVal.w && editVal.h ? sqm(+editVal.w, +editVal.h, +editVal.qty || 1) : "—"} m²
                                </td>
                                <td className="px-2 py-2">
                                  <div className="flex gap-1">
                                    <button onClick={saveEdit}
                                      className="px-2 py-1 rounded text-xs font-medium"
                                      style={{ background: "#0d3320", color: "#34d399", border: "1px solid #1a5c35" }}>✓</button>
                                    <button onClick={() => setEditing(null)}
                                      className="px-2 py-1 rounded text-xs"
                                      style={{ background: "#0f1117", color: muted, border: "1px solid #2d3748" }}>✕</button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="px-3 py-2" style={{ fontFamily: "monospace", fontWeight: 500, color: hi ? "#fbbf24" : text }}>
                                  {d.w} × {d.h}
                                </td>
                                <td className="px-3 py-2 text-xs" style={{ color: muted }}>{d.w} sm</td>
                                <td className="px-3 py-2 text-xs" style={{ color: muted }}>{d.h} sm</td>
                                <td className="px-3 py-2">
                                  <div className="flex items-center gap-1.5">
                                    <button onClick={() => chQty(c.id, i, -1)}
                                      className="w-5 h-5 flex items-center justify-center rounded text-xs"
                                      style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>−</button>
                                    <span className="font-medium text-sm min-w-[18px] text-center" style={{ color: text }}>{d.qty || 1}</span>
                                    <button onClick={() => chQty(c.id, i, 1)}
                                      className="w-5 h-5 flex items-center justify-center rounded text-xs"
                                      style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>+</button>
                                  </div>
                                </td>
                                <td className="px-3 py-2 text-xs font-medium" style={{ color: "#60a5fa" }}>
                                  {sqm(d.w, d.h, d.qty || 1)} m²
                                </td>
                                <td className="px-2 py-2">
                                  <div className="flex gap-1">
                                    <button onClick={() => startEdit(c.id, i, d)}
                                      className="w-6 h-6 flex items-center justify-center rounded text-xs"
                                      style={{ color: "#60a5fa", background: "#1e3a5f" }}
                                      title="Tahrirlash">✎</button>
                                    <button onClick={() => delDim(c.id, i)}
                                      className="w-6 h-6 flex items-center justify-center rounded text-xs"
                                      style={{ color: muted }}>✕</button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 flex-wrap"
                    style={{ background: "#0f1117", borderTop: "1px solid #2d3748" }}>
                    <span className="text-xs" style={{ color: muted }}>+ yangi:</span>
                    <input type="number" placeholder="Eni"
                      value={newDim[c.id]?.w || ""}
                      onChange={(e) => setNewDim((p) => ({ ...p, [c.id]: { ...p[c.id], w: e.target.value } }))}
                      style={{ ...inputStyle, width: "70px", padding: "4px 8px" }} />
                    <span style={{ color: muted, fontSize: "12px" }}>×</span>
                    <input type="number" placeholder="Balandligi"
                      value={newDim[c.id]?.h || ""}
                      onChange={(e) => setNewDim((p) => ({ ...p, [c.id]: { ...p[c.id], h: e.target.value } }))}
                      style={{ ...inputStyle, width: "90px", padding: "4px 8px" }} />
                    <input type="number" placeholder="Miqdor" min="1"
                      value={newDim[c.id]?.qty || ""}
                      onChange={(e) => setNewDim((p) => ({ ...p, [c.id]: { ...p[c.id], qty: e.target.value } }))}
                      style={{ ...inputStyle, width: "70px", padding: "4px 8px" }} />
                    <button onClick={() => addDim(c.id)}
                      className="text-xs px-3 py-1 rounded"
                      style={{ background: "#1a1f2e", border: "1px solid #2d3748", color: text }}>
                      + Qo'shish
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Col Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "16px", padding: "24px", width: "380px", maxWidth: "95%" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: text }}>Yangi kolleksiya</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Kolleksiya nomi *</label>
                <input style={inputStyle} placeholder="masalan: HD-33" value={newCol.name}
                  onChange={(e) => setNewCol((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Mahsulot turi</label>
                <select style={inputStyle} value={newCol.product}
                  onChange={(e) => setNewCol((p) => ({ ...p, product: e.target.value }))}>
                  {PRODUCTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1" style={{ color: muted }}>Tur</label>
                  <select style={inputStyle} value={newCol.type}
                    onChange={(e) => setNewCol((p) => ({ ...p, type: e.target.value }))}>
                    <option>RULON</option>
                    <option>ATXOD</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: muted }}>Kenglik (sm)</label>
                  <input type="number" style={inputStyle} placeholder="120" value={newCol.width || ""}
                    onChange={(e) => setNewCol((p) => ({ ...p, width: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs block mb-1" style={{ color: muted }}>Uzunlik (m)</label>
                  <input type="number" style={inputStyle} placeholder="300" value={newCol.len}
                    onChange={(e) => setNewCol((p) => ({ ...p, len: e.target.value }))} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: muted }}>Mavjudligi</label>
                  <select style={inputStyle} value={newCol.stock}
                    onChange={(e) => setNewCol((p) => ({ ...p, stock: e.target.value === "true" }))}>
                    <option value="true">Bor ✅</option>
                    <option value="false">Qo'magan ❌</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Bayroq emoji</label>
                <input style={inputStyle} placeholder="🇨🇳" value={newCol.flag}
                  onChange={(e) => setNewCol((p) => ({ ...p, flag: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)}
                className="text-sm px-4 py-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>
                Bekor
              </button>
              <button onClick={saveCol}
                className="text-sm px-4 py-2 rounded-lg text-white"
                style={{ background: "#a80000" }}>
                Qo'shish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}