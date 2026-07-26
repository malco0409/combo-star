import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProducts } from "../../store/data/productStore";
import { useRemoteReady } from "../../store/data/remote";
import {
  useCollection, saveCollection, resetCollection,
  newItem, newColor, newColorOnly,
} from "../../store/data/collectionStore";
import { fileToDataURL } from "../utils/image";
import { translateUzToRu } from "../utils/translate";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
  padding: "7px 10px", width: "100%", fontFamily: "inherit",
};

// Rasmni kompyuterdan (fayldan) tanlash — kichraytirilib dataURL ga saqlanadi.
function ImageField({ value, onChange, size = 60 }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);

  const pick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("Faqat rasm fayli tanlang!");
    setBusy(true);
    try { onChange(await fileToDataURL(f)); }
    catch { alert("Rasmni o'qishda xatolik."); }
    setBusy(false);
    if (ref.current) ref.current.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <div onClick={() => ref.current?.click()} title="Rasm tanlash"
        className="flex items-center justify-center cursor-pointer"
        style={{ width: size, height: size, borderRadius: 8, overflow: "hidden", background: "#0f1117", border: "1px solid #2d3748" }}>
        {value
          ? <img src={value} alt="" className="w-full h-full object-cover" />
          : <span style={{ color: muted, fontSize: 20 }}>{busy ? "…" : "＋"}</span>}
      </div>
      {value
        ? <button onClick={() => onChange("")} style={{ color: "#f87171", fontSize: 10 }}>o'chirish</button>
        : <span style={{ color: muted, fontSize: 10 }}>rasm</span>}
      <input ref={ref} type="file" accept="image/*" onChange={pick} className="hidden" />
    </div>
  );
}

export default function Kolleksiyalar() {
  const { t } = useTranslation();
  const ready = useRemoteReady();
  const products = useProducts();
  const [productId, setProductId] = useState(products[0]?.id || "");

  // remoteCol — Firestore dagi (yoki standart) joriy holat
  const remoteCol = useCollection(productId);
  // col — tahrirlash uchun mahalliy nusxa (darhol javob berishi uchun)
  const [col, setCol] = useState(null);
  const loadedKey = useRef("");

  // Ma'lumot tayyor bo'lgach yoki mahsulot o'zgargach mahalliy nusxani yangilaymiz
  useEffect(() => {
    if (ready && loadedKey.current !== productId) {
      setCol(remoteCol);
      loadedKey.current = productId;
    }
  }, [ready, productId, remoteCol]);

  // Har o'zgarish: mahalliy darhol, Firestore ga fon rejimida yoziladi.
  const update = (newCol) => {
    setCol(newCol);
    saveCollection(productId, newCol).catch((err) => {
      alert("Saqlashda xatolik. Rasm juda katta yoki internet bilan muammo bo'lishi mumkin.\n" + (err?.message || ""));
    });
  };

  const resetOne = async () => {
    if (window.confirm("Bu mahsulot kolleksiyasini standart holatiga qaytarasizmi?")) {
      try {
        await resetCollection(productId);
        loadedKey.current = "";   // yangi (standart) ma'lumot kelganda qayta yuklanadi
      } catch (err) {
        alert("Xatolik: " + (err?.message || ""));
      }
    }
  };

  const nameOf = (p) => p.name || t(p.titleKey);

  if (!ready || !col) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4" style={{ color: text }}>Kolleksiyalar &amp; Ranglar</h1>
        <p style={{ color: muted }}>Yuklanmoqda…</p>
      </div>
    );
  }

  // ── collections type: item + colors ──
  const updateItem = (itemId, patch) =>
    update({ ...col, items: col.items.map((it) => it.id === itemId ? { ...it, ...patch } : it) });

  const deleteItem = (itemId) => {
    if (window.confirm("Kolleksiya elementini o'chirasizmi?"))
      update({ ...col, items: col.items.filter((it) => it.id !== itemId) });
  };

  const addItem = () => update({ ...col, items: [...col.items, newItem()] });

  // Rang nomi (o'zbekcha) yozilib bo'lgach — ruscha bo'sh bo'lsa avtomatik tarjima qilamiz.
  const autoTranslate = async (name, currentRu, setRu) => {
    if (currentRu) return;                 // qo'lda yozilgan bo'lsa tegmaymiz
    const clean = (name || "").trim();
    if (!clean) return;
    const ru = await translateUzToRu(clean);
    if (ru) setRu(ru);
  };

  const updateColorIn = (itemId, colorId, patch) =>
    update({
      ...col,
      items: col.items.map((it) =>
        it.id === itemId
          ? { ...it, colors: it.colors.map((c) => c.id === colorId ? { ...c, ...patch } : c) }
          : it
      ),
    });

  const addColorIn = (itemId) =>
    update({
      ...col,
      items: col.items.map((it) =>
        it.id === itemId ? { ...it, colors: [...(it.colors || []), newColor()] } : it
      ),
    });

  const deleteColorIn = (itemId, colorId) =>
    update({
      ...col,
      items: col.items.map((it) =>
        it.id === itemId ? { ...it, colors: it.colors.filter((c) => c.id !== colorId) } : it
      ),
    });

  // ── colors_only type: itemlar bevosita ranglar ──
  const updateColorOnly = (colorId, patch) =>
    update({ ...col, items: col.items.map((c) => c.id === colorId ? { ...c, ...patch } : c) });

  const deleteColorOnly = (colorId) => {
    if (window.confirm("Rangni o'chirasizmi?"))
      update({ ...col, items: col.items.filter((c) => c.id !== colorId) });
  };

  const addColorOnly = () => update({ ...col, items: [...col.items, newColorOnly()] });

  const colorCount = col.type === "collections"
    ? col.items.reduce((a, it) => a + (it.colors?.length || 0), 0)
    : col.items.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: text }}>Kolleksiyalar &amp; Ranglar</h1>
          <p className="text-xs mt-1" style={{ color: muted }}>
            Har bir rangning kodi, nomi va rasmini shu yerdan boshqaring (masalan: 13 · mokriy asfalt)
          </p>
        </div>
        <button onClick={resetOne}
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: "#0f1117", border: "1px solid #3d0d0d", color: "#f87171" }}>
          ↺ Standartga qaytarish
        </button>
      </div>

      {/* Mahsulot tanlash */}
      <div className="flex items-center gap-3 my-4 flex-wrap">
        <label className="text-sm" style={{ color: muted }}>Mahsulot:</label>
        <select style={{ ...inputStyle, width: "auto", minWidth: "220px" }}
          value={productId} onChange={(e) => setProductId(e.target.value)}>
          {products.map((p) => <option key={p.id} value={p.id}>{nameOf(p)}</option>)}
        </select>
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "#2d1a4d", color: "#c084fc" }}>
          {col.type === "collections" ? "Kolleksiyali" : "Ranglar ro'yxati"}
        </span>
        <span className="text-xs" style={{ color: muted }}>
          {col.type === "collections" ? `${col.items.length} element · ` : ""}{colorCount} rang
        </span>
      </div>

      {/* ══ collections type ══ */}
      {col.type === "collections" && (
        <div className="space-y-4">
          {col.items.map((it) => (
            <div key={it.id} style={card} className="p-4">
              {/* Element sarlavhasi */}
              <div className="flex items-start gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #2d3748" }}>
                <ImageField value={it.image} onChange={(v) => updateItem(it.id, { image: v })} size={64} />
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs block mb-1" style={{ color: muted }}>Kolleksiya nomi</label>
                    <input style={inputStyle} placeholder="masalan: Lizbon" value={it.name}
                      onChange={(e) => updateItem(it.id, { name: e.target.value })} />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs block mb-1" style={{ color: muted }}>Narx</label>
                    <input style={inputStyle} placeholder="$15" value={it.price}
                      onChange={(e) => updateItem(it.id, { price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: muted }}>Belgi (badge)</label>
                    <input style={inputStyle} placeholder="Premium / Arzon" value={it.badge}
                      onChange={(e) => updateItem(it.id, { badge: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs block mb-1" style={{ color: muted }}>Belgi rangi</label>
                    <select style={inputStyle} value={it.badgeColor || ""}
                      onChange={(e) => updateItem(it.id, { badgeColor: e.target.value })}>
                      <option value="">—</option>
                      <option value="green">Yashil</option>
                      <option value="red">Qizil</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => deleteItem(it.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "#3d0d0d", color: "#f87171" }} title="Elementni o'chirish">✕</button>
              </div>

              {/* Ranglar */}
              <div className="space-y-2">
                <div className="text-xs font-medium mb-1" style={{ color: muted }}>Ranglar ({it.colors?.length || 0})</div>
                {(it.colors || []).map((c) => (
                  <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: "#0f1117", border: "1px solid #2d3748" }}>
                    <ImageField value={c.image} onChange={(v) => updateColorIn(it.id, c.id, { image: v })} size={48} />
                    <div className="flex-1 space-y-1.5">
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs block mb-0.5" style={{ color: muted }}>Kod</label>
                          <input style={inputStyle} placeholder="13" value={c.code}
                            onChange={(e) => updateColorIn(it.id, c.id, { code: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-xs block mb-0.5" style={{ color: muted }}>Rang nomi (o'zbekcha)</label>
                          <input style={inputStyle} placeholder="mokriy asfalt"
                            value={c.name || (c.nameKey ? t(c.nameKey) : "")}
                            onChange={(e) => updateColorIn(it.id, c.id, { name: e.target.value, nameKey: "" })}
                            onBlur={(e) => autoTranslate(e.target.value, c.nameRu, (ru) => updateColorIn(it.id, c.id, { nameRu: ru }))} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs block mb-0.5" style={{ color: muted }}>🇷🇺 Ruscha nomi (avtomatik)</label>
                        <input style={inputStyle} placeholder="русское название"
                          value={c.nameRu || ""}
                          onChange={(e) => updateColorIn(it.id, c.id, { nameRu: e.target.value })} />
                      </div>
                    </div>
                    <button onClick={() => deleteColorIn(it.id, c.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ background: "#1a1f2e", color: muted }} title="Rangni o'chirish">✕</button>
                  </div>
                ))}
                <button onClick={() => addColorIn(it.id)}
                  className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: "#1e3a5f", color: "#60a5fa", border: "1px solid #2d4a6f" }}>
                  + Rang qo'shish
                </button>
              </div>
            </div>
          ))}

          <button onClick={addItem}
            className="w-full text-sm py-3 rounded-xl text-white font-medium"
            style={{ background: "#a80000" }}>
            + Kolleksiya elementi qo'shish
          </button>
        </div>
      )}

      {/* ══ colors_only type ══ */}
      {col.type === "colors_only" && (
        <div style={card} className="p-4">
          <div className="space-y-2">
            {col.items.map((c) => (
              <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #2d3748" }}>
                <ImageField value={c.image} onChange={(v) => updateColorOnly(c.id, { image: v })} size={52} />
                <div className="flex-1 space-y-1.5">
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs block mb-0.5" style={{ color: muted }}>Kod</label>
                      <input style={inputStyle} placeholder="13" value={c.code}
                        onChange={(e) => updateColorOnly(c.id, { code: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs block mb-0.5" style={{ color: muted }}>Rang nomi (o'zbekcha)</label>
                      <input style={inputStyle} placeholder="mokriy asfalt"
                        value={c.name || (c.nameKey ? t(c.nameKey) : "")}
                        onChange={(e) => updateColorOnly(c.id, { name: e.target.value, nameKey: "" })}
                        onBlur={(e) => autoTranslate(e.target.value, c.nameRu, (ru) => updateColorOnly(c.id, { nameRu: ru }))} />
                    </div>
                    <div>
                      <label className="text-xs block mb-0.5" style={{ color: muted }}>Narx</label>
                      <input style={inputStyle} placeholder="$38" value={c.price}
                        onChange={(e) => updateColorOnly(c.id, { price: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs block mb-0.5" style={{ color: muted }}>🇷🇺 Ruscha nomi (avtomatik)</label>
                    <input style={inputStyle} placeholder="русское название"
                      value={c.nameRu || ""}
                      onChange={(e) => updateColorOnly(c.id, { nameRu: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => deleteColorOnly(c.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "#1a1f2e", color: muted }} title="Rangni o'chirish">✕</button>
              </div>
            ))}
          </div>
          <button onClick={addColorOnly}
            className="mt-3 text-sm px-4 py-2 rounded-lg text-white font-medium"
            style={{ background: "#a80000" }}>
            + Rang qo'shish
          </button>
        </div>
      )}
    </div>
  );
}
