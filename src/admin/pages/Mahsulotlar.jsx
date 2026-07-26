import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useProducts, saveProduct, resetProduct } from "../../store/data/productStore";
import { saveImageData, useResolvedImage } from "../../store/data/remote";
import Img from "../../store/components/Img";
import { fileToDataURL } from "../utils/image";

const card = { background: "#1a1f2e", border: "1px solid #2d3748", borderRadius: "12px" };
const text = "#e2e8f0";
const muted = "#64748b";
const inputStyle = {
  background: "#0f1117", border: "1px solid #2d3748",
  borderRadius: "8px", color: "#e2e8f0", fontSize: "13px",
  padding: "8px 12px", width: "100%", fontFamily: "inherit",
};

const EMPTY_FORM = { price: "", name: "", desc: "", image: "", hidden: false, featured: false };

export default function Mahsulotlar() {
  const { t } = useTranslation();
  const products = useProducts();               // Firestore dan jonli
  const [editing, setEditing] = useState(null);   // tahrirlanayotgan mahsulot id
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const nameOf = (p) => p.name || t(p.titleKey);
  const descOf = (p) => p.desc || t(p.descKey);

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      price: p.price || "",
      name: p._override?.name || "",
      desc: p._override?.desc || "",
      image: p._override?.image || "",   // faqat override rasm; bo'sh bo'lsa standart ishlatiladi
      hidden: !!p.hidden,
      featured: !!p.featured,
    });
  };

  const closeEdit = () => { setEditing(null); setForm(EMPTY_FORM); };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return alert("Faqat rasm fayli tanlang!");
    setUploading(true);
    try {
      const dataURL = await fileToDataURL(file);
      const imgRef = await saveImageData(dataURL);   // alohida hujjatga saqlaymiz
      setForm((f) => ({ ...f, image: imgRef }));
    } catch {
      alert("Rasmni saqlashda xatolik. Internetни tekshiring.");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveProduct(editing, {
        price: form.price.trim(),
        name: form.name.trim(),
        desc: form.desc.trim(),
        image: form.image,          // "" bo'lsa standart rasm ishlatiladi
        hidden: form.hidden,
        featured: form.featured,
      });
      closeEdit();
    } catch (err) {
      alert("Saqlashda xatolik. Rasm juda katta bo'lishi yoki internet bilan muammo bo'lishi mumkin.\n" + (err?.message || ""));
    }
    setSaving(false);
  };

  const reset = async (id) => {
    if (window.confirm("Bu mahsulotni standart holatiga qaytarasizmi?")) {
      try {
        await resetProduct(id);
        if (editing === id) closeEdit();
      } catch (err) {
        alert("Xatolik: " + (err?.message || ""));
      }
    }
  };

  const toggleHidden = async (p) => {
    try { await saveProduct(p.id, { hidden: !p.hidden }); }
    catch (err) { alert("Xatolik: " + (err?.message || "")); }
  };

  const visibleCount = products.filter((p) => !p.hidden).length;
  const featuredCount = products.filter((p) => p.featured).length;
  const customCount = products.filter((p) => p._override && Object.keys(p._override).length).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold" style={{ color: text }}>Mahsulotlar</h1>
          <p className="text-xs mt-1" style={{ color: muted }}>
            Saytdagi mahsulotlar rasmi, narxi va ma'lumotlarini shu yerdan boshqaring
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { lbl: "Jami mahsulot", val: products.length },
          { lbl: "Ko'rinadigan", val: visibleCount, green: true },
          { lbl: "Bosh sahifada", val: featuredCount, blue: true },
          { lbl: "O'zgartirilgan", val: customCount },
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

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} style={card} className="overflow-hidden flex flex-col">
            <div className="relative" style={{ height: "150px", background: "#0f1117" }}>
              <Img src={p.image} alt={nameOf(p)}
                className="w-full h-full object-cover"
                style={{ opacity: p.hidden ? 0.4 : 1 }}
                fallback={<div className="w-full h-full flex items-center justify-center text-3xl">🪟</div>} />
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                {p.featured && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "#1e3a5f", color: "#60a5fa" }}>★ Bosh sahifa</span>
                )}
                {p._override && Object.keys(p._override).length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "#2d1a4d", color: "#c084fc" }}>O'zgartirilgan</span>
                )}
                {p.hidden && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "#3d0d0d", color: "#f87171" }}>Yashirin</span>
                )}
              </div>
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg font-bold text-sm"
                style={{ background: "#780202", color: "#fff" }}>
                {p.price} <span className="text-xs font-normal">/ m²</span>
              </div>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <h3 className="font-medium text-sm mb-1" style={{ color: text }}>{nameOf(p)}</h3>
              <p className="text-xs flex-1 mb-3" style={{ color: muted,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {descOf(p)}
              </p>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)}
                  className="flex-1 text-xs py-2 rounded-lg text-white font-medium"
                  style={{ background: "#a80000" }}>
                  ✎ Tahrirlash
                </button>
                <button onClick={() => toggleHidden(p)}
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ background: "#0f1117", border: "1px solid #2d3748", color: muted }}
                  title={p.hidden ? "Ko'rsatish" : "Yashirish"}>
                  {p.hidden ? "👁" : "🚫"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}>
          <div style={{ ...card, borderRadius: "16px", padding: "22px", width: "460px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 className="text-base font-semibold mb-4" style={{ color: text }}>
              Mahsulotni tahrirlash
            </h2>

            <div className="space-y-3">
              {/* Rasm */}
              <div>
                <label className="text-xs block mb-1.5" style={{ color: muted }}>Rasm</label>
                <div className="flex items-center gap-3">
                  <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", background: "#0f1117", border: "1px solid #2d3748", flexShrink: 0 }}
                    className="flex items-center justify-center">
                    <Img src={form.image} alt="" className="w-full h-full object-cover"
                      fallback={<span className="text-2xl">🪟</span>} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="w-full text-xs py-2 rounded-lg"
                      style={{ background: "#1e3a5f", color: "#60a5fa", border: "1px solid #2d4a6f" }}>
                      {uploading ? "Yuklanmoqda..." : "📁 Rasm yuklash"}
                    </button>
                    {form.image && (
                      <button onClick={() => setForm((f) => ({ ...f, image: "" }))}
                        className="w-full text-xs py-1.5 rounded-lg"
                        style={{ background: "#0f1117", color: muted, border: "1px solid #2d3748" }}>
                        Standart rasmga qaytarish
                      </button>
                    )}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <input style={{ ...inputStyle, marginTop: "8px" }}
                  placeholder="yoki rasm URL manzili (https://...)"
                  value={/^(data:|img:)/.test(form.image || "") ? "" : (form.image || "")}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
              </div>

              {/* Narx */}
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>Narx (masalan $16 yoki €50)</label>
                <input style={inputStyle} placeholder="$16" value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
              </div>

              {/* Nomi */}
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>
                  Nomi <span style={{ color: "#475569" }}>(bo'sh qoldirsangiz tarjimadagi nom)</span>
                </label>
                <input style={inputStyle} placeholder={t(products.find((p) => p.id === editing)?.titleKey || "")}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>

              {/* Tavsif */}
              <div>
                <label className="text-xs block mb-1" style={{ color: muted }}>
                  Tavsif <span style={{ color: "#475569" }}>(bo'sh — tarjimadagi tavsif)</span>
                </label>
                <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
                  placeholder={t(products.find((p) => p.id === editing)?.descKey || "")}
                  value={form.desc}
                  onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
              </div>

              {/* Toggle lar */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: text }}>
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                  Bosh sahifada ko'rsatish
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: text }}>
                  <input type="checkbox" checked={form.hidden}
                    onChange={(e) => setForm((f) => ({ ...f, hidden: e.target.checked }))} />
                  Saytdan yashirish
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center gap-2 mt-5">
              <button onClick={() => reset(editing)}
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: "#0f1117", border: "1px solid #3d0d0d", color: "#f87171" }}>
                ↺ Standartga qaytarish
              </button>
              <div className="flex gap-2">
                <button onClick={closeEdit}
                  className="text-sm px-4 py-2 rounded-lg"
                  style={{ background: "#0f1117", border: "1px solid #2d3748", color: text }}>
                  Bekor
                </button>
                <button onClick={save} disabled={saving}
                  className="text-sm px-4 py-2 rounded-lg text-white"
                  style={{ background: "#a80000", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Saqlanmoqda…" : "Saqlash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
