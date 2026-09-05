// Bizning ishlarimiz — "Biz haqimizda" sahifasidagi galereyani boshqarish.
// Har bir ish = bitta kartochka + ichida bir nechta rasm. Birinchi rasm — muqova.
import { useState, useRef } from "react";
import {
  useSavedWorks, saveWorks, newWork, defaultWorks,
  MAX_IMAGES_PER_WORK, MAX_WORKS,
} from "../../store/data/worksStore";
import { useRemoteReady, saveImageData, useResolvedImage } from "../../store/data/remote";
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

// Bitta rasm (muqova belgisi, muqova qilish va o'chirish tugmalari bilan)
function Thumb({ value, index, onDelete, onMakeCover }) {
  const url = useResolvedImage(value);
  return (
    <div className="relative rounded-lg overflow-hidden group"
      style={{ width: 92, height: 92, background: "#0f1117", border: "1px solid #2d3748" }}>
      {url
        ? <img src={url} alt="" className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center" style={{ color: muted }}>…</div>}

      {index === 0 && (
        <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded"
          style={{ background: "#a80000", color: "#fff" }}>muqova</span>
      )}

      <div className="absolute inset-x-0 bottom-0 flex opacity-0 group-hover:opacity-100 transition-opacity">
        {index !== 0 && (
          <button onClick={onMakeCover} className="flex-1 text-[10px] py-1"
            style={{ background: "rgba(15,17,23,0.9)", color: "#60a5fa" }}>muqova</button>
        )}
        <button onClick={onDelete} className="flex-1 text-[10px] py-1"
          style={{ background: "rgba(15,17,23,0.9)", color: "#f87171" }}>o'chirish</button>
      </div>
    </div>
  );
}

// Matn maydoni — yozayotganda mahalliy, blur'da (yoki Enter'da) Firestore ga saqlanadi.
function TextField({ label, placeholder, value, onSave }) {
  const [draft, setDraft] = useState(null);
  const shown = draft === null ? (value || "") : draft;

  const commit = () => {
    if (draft !== null && draft !== (value || "")) onSave(draft);
    setDraft(null);
  };

  return (
    <div className="col-span-2 sm:col-span-1">
      <label className="text-xs block mb-1" style={{ color: muted }}>{label}</label>
      <input style={inputStyle} placeholder={placeholder} value={shown}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} />
    </div>
  );
}

export default function Ishlarimiz() {
  const ready = useRemoteReady();
  const works = useSavedWorks();
  const [busy, setBusy] = useState("");          // yuklanish holati matni
  const fileRefs = useRef({});                    // workId -> <input type=file>

  const commit = (list) => {
    saveWorks(list).catch((err) => {
      alert("Saqlashda xatolik. Internetni tekshiring.\n" + (err?.message || ""));
    });
  };

  const updateWork = (id, patch) =>
    commit(works.map((w) => (w.id === id ? { ...w, ...patch } : w)));

  const addWork = () => {
    if (works.length >= MAX_WORKS) return alert(`Ko'pi bilan ${MAX_WORKS} ta ish qo'shish mumkin.`);
    commit([...works, newWork()]);
  };

  const deleteWork = (id) => {
    if (window.confirm("Bu ishni (barcha rasmlari bilan) o'chirasizmi?"))
      commit(works.filter((w) => w.id !== id));
  };

  const moveWork = (index, dir) => {
    const next = [...works];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };

  // Namunaviy loyihalarni ro'yxatga ko'chirish (keyin tahrirlash mumkin)
  const loadDefaults = () => {
    if (!window.confirm("Namunaviy 6 ta loyiha ro'yxatga qo'shilsinmi?")) return;
    commit(defaultWorks().map((w) => ({
      id: `w-${w.id}`,
      title: "", titleRu: "", desc: "", descRu: "",
      titleKey: w.titleKey, descKey: w.descKey,
      images: [...w.images],
    })));
  };

  // Bir vaqtda bir nechta rasm yuklash
  const pickImages = async (work, e) => {
    const files = Array.from(e.target.files || []);
    if (fileRefs.current[work.id]) fileRefs.current[work.id].value = "";
    if (!files.length) return;

    const bosh = work.images.length;
    const joy = MAX_IMAGES_PER_WORK - bosh;
    if (joy <= 0) return alert(`Bitta ishga ko'pi bilan ${MAX_IMAGES_PER_WORK} ta rasm.`);

    const tanlangan = files.filter((f) => f.type.startsWith("image/")).slice(0, joy);
    if (files.length > tanlangan.length)
      alert(`Faqat ${tanlangan.length} ta rasm qabul qilinadi (chegara: ${MAX_IMAGES_PER_WORK} ta).`);

    const yangi = [];
    for (let i = 0; i < tanlangan.length; i++) {
      setBusy(`Yuklanmoqda… ${i + 1}/${tanlangan.length}`);
      try {
        const dataURL = await fileToDataURL(tanlangan[i]);
        yangi.push(await saveImageData(dataURL));
      } catch {
        alert(`"${tanlangan[i].name}" yuklanmadi.`);
      }
    }
    setBusy("");
    if (yangi.length)
      commit(works.map((w) => (w.id === work.id ? { ...w, images: [...w.images, ...yangi] } : w)));
  };

  const deleteImage = (work, i) =>
    updateWork(work.id, { images: work.images.filter((_, idx) => idx !== i) });

  const makeCover = (work, i) => {
    const imgs = [...work.images];
    const [pick] = imgs.splice(i, 1);
    updateWork(work.id, { images: [pick, ...imgs] });
  };

  // O'zbekcha nom yozilgach — ruschasi bo'sh bo'lsa avtomatik tarjima
  const autoTranslate = async (uz, ru, apply) => {
    if (ru) return;
    const clean = (uz || "").trim();
    if (!clean) return;
    const res = await translateUzToRu(clean);
    if (res) apply(res);
  };

  const jamiRasm = works.reduce((a, w) => a + w.images.length, 0);

  if (!ready) {
    return (
      <div>
        <h1 className="text-xl font-semibold mb-4" style={{ color: text }}>Bizning ishlarimiz</h1>
        <p style={{ color: muted }}>Yuklanmoqda…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold" style={{ color: text }}>Bizning ishlarimiz</h1>
        <p className="text-xs mt-1" style={{ color: muted }}>
          Saytdagi «Biz haqimizda → Bajarilgan ishlar» galereyasi. Har bir ishga{" "}
          {MAX_IMAGES_PER_WORK} tagacha rasm, jami {MAX_WORKS} tagacha ish.
          Birinchi rasm kartochkada muqova bo'lib ko'rinadi.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: "#2d1a4d", color: "#c084fc" }}>
          {works.length} ish · {jamiRasm} rasm
        </span>
        {busy && <span className="text-xs" style={{ color: "#fbbf24" }}>{busy}</span>}
      </div>

      {works.length === 0 && (
        <div style={card} className="p-6 text-center mb-4">
          <div className="text-3xl mb-2">🖼️</div>
          <p className="text-sm mb-1" style={{ color: text }}>Hozircha ish qo'shilmagan.</p>
          <p className="text-xs mb-4" style={{ color: muted }}>
            Shu sababli saytda namunaviy loyihalar ko'rinmoqda. Birinchi ishni qo'shsangiz,
            saytda faqat sizning ishlaringiz chiqadi.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={addWork} className="text-sm px-4 py-2 rounded-lg text-white font-medium"
              style={{ background: "#a80000" }}>+ Yangi ish qo'shish</button>
            <button onClick={loadDefaults} className="text-sm px-4 py-2 rounded-lg"
              style={{ background: "#0f1117", border: "1px solid #2d3748", color: muted }}>
              Namunalarni ro'yxatga olish
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {works.map((w, index) => (
          <div key={w.id} style={card} className="p-4">

            {/* Sarlavha qatori */}
            <div className="flex items-start gap-3 mb-3 pb-3" style={{ borderBottom: "1px solid #2d3748" }}>
              <div className="flex-1 grid grid-cols-2 gap-2">
                <TextField
                  label="Ish nomi (o'zbekcha)" placeholder="masalan: Zamonaviy ofis"
                  value={w.title}
                  onSave={(v) => {
                    updateWork(w.id, { title: v, titleKey: "" });
                    autoTranslate(v, w.titleRu, (ru) => updateWork(w.id, { title: v, titleKey: "", titleRu: ru }));
                  }} />
                <TextField
                  label="🇷🇺 Nomi (avtomatik)" placeholder="Современный офис"
                  value={w.titleRu}
                  onSave={(v) => updateWork(w.id, { titleRu: v })} />
                <TextField
                  label="Tavsif (o'zbekcha)" placeholder="Ofis uchun o'rnatilgan jaluziyalar"
                  value={w.desc}
                  onSave={(v) => {
                    updateWork(w.id, { desc: v, descKey: "" });
                    autoTranslate(v, w.descRu, (ru) => updateWork(w.id, { desc: v, descKey: "", descRu: ru }));
                  }} />
                <TextField
                  label="🇷🇺 Tavsif (avtomatik)" placeholder="Жалюзи для офиса"
                  value={w.descRu}
                  onSave={(v) => updateWork(w.id, { descRu: v })} />
              </div>

              <div className="flex flex-col gap-1 flex-shrink-0">
                <button onClick={() => moveWork(index, -1)} title="Yuqoriga"
                  className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: "#0f1117", border: "1px solid #2d3748", color: muted }}>↑</button>
                <button onClick={() => moveWork(index, 1)} title="Pastga"
                  className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: "#0f1117", border: "1px solid #2d3748", color: muted }}>↓</button>
                <button onClick={() => deleteWork(w.id)} title="Ishni o'chirish"
                  className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ background: "#3d0d0d", color: "#f87171" }}>✕</button>
              </div>
            </div>

            {/* Rasmlar */}
            <div className="text-xs font-medium mb-2" style={{ color: muted }}>
              Rasmlar ({w.images.length} / {MAX_IMAGES_PER_WORK})
            </div>
            <div className="flex flex-wrap gap-2">
              {w.images.map((img, i) => (
                <Thumb key={`${img}-${i}`} value={img} index={i}
                  onDelete={() => deleteImage(w, i)}
                  onMakeCover={() => makeCover(w, i)} />
              ))}

              <button
                onClick={() => fileRefs.current[w.id]?.click()}
                disabled={!!busy || w.images.length >= MAX_IMAGES_PER_WORK}
                className="flex flex-col items-center justify-center rounded-lg text-xs"
                style={{
                  width: 92, height: 92, background: "#0f1117",
                  border: "1px dashed #2d3748", color: muted,
                  opacity: w.images.length >= MAX_IMAGES_PER_WORK ? 0.4 : 1,
                }}>
                <span style={{ fontSize: 20 }}>＋</span>
                <span>rasm qo'shish</span>
              </button>
              <input
                ref={(el) => { fileRefs.current[w.id] = el; }}
                type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => pickImages(w, e)} />
            </div>
          </div>
        ))}
      </div>

      {works.length > 0 && (
        <button onClick={addWork}
          className="w-full mt-4 text-sm py-3 rounded-xl text-white font-medium"
          style={{ background: "#a80000" }}>
          + Yangi ish qo'shish
        </button>
      )}
    </div>
  );
}
