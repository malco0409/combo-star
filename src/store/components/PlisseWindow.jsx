// PlisseWindow — interaktiv plisse jalyuzi (deraza ortida manzara + tortiladigan profillar).
// Asli: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/ (HTML+CSS+JS) — React ga ko'chirildi.
// Uslublar PlisseWindow.css da, hammasi `.plisse-window` ichiga yopilgan.
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./PlisseWindow.css";

const FOLDS = 40;
const PROFILE_HEIGHT = 25;   // CSS dagi `.profile { height: 25px }` bilan bir xil

// Ranglar — mijoz profil va romni ALOHIDA tanlaydi.
// profile/border/handle/shine — ushlagich uchun; frame/frameShine — rom uchun.
const COLORS = [
  {
    id: "white", labelKey: "plisse.color_white",
    profile: "#ecf0f1", border: "#bdc3c7", handle: "#95a5a6",
    shine: "rgba(255,255,255,.95)",
    frame: "#e7ebed", frameShine: "rgba(0,0,0,.06)",
  },
  {
    id: "navy", labelKey: "plisse.color_navy",
    profile: "#1c212d", border: "#12161f", handle: "#4a5468",
    shine: "rgba(255,255,255,.18)",
    frame: "#1c212d", frameShine: "rgba(255,255,255,.05)",
  },
  {
    // Tilla-jigarrang (bronza): to'q jigarrang asos + tilla tutqich va tilla yaltirash
    id: "brown", labelKey: "plisse.color_brown",
    profile: "#4d3820", border: "#2b1e11", handle: "#b08c4f",
    shine: "rgba(255,226,160,.32)",
    frame: "#493420", frameShine: "rgba(255,226,160,.10)",
  },
];

// ── Mato (lenta) ranglari — NEWMOON namunalar kitobidan ──
// Raqamlar namuna kitobidagi kodlar. HEX qiymatlar egasi yuborgan SURATDAN ko'z bilan
// olingan (iliq yorug'lik sabab biroz farq qilishi mumkin) — aniq kodlar kelsa shu yerda
// to'g'rilanadi. Yangi rang qo'shish: massivga bitta qator qo'shish kifoya.
const FABRICS = [
  { code: "03", hex: "#e6e3d0", name: "Sut rang",      nameRu: "Молочный" },
  { code: "04", hex: "#cbc5b7", name: "Kulrang-bej",   nameRu: "Серо-бежевый" },
  { code: "05", hex: "#d4c6a4", name: "Bej",           nameRu: "Бежевый" },
  { code: "06", hex: "#8f8278", name: "Kofe",          nameRu: "Кофейный" },
  { code: "07", hex: "#efd0c0", name: "Pudra",         nameRu: "Пудровый" },
  { code: "09", hex: "#a7d7d4", name: "Firuza",        nameRu: "Бирюзовый" },
  { code: "10", hex: "#d51f26", name: "Qizil",         nameRu: "Красный" },
  { code: "12", hex: "#c7c5c1", name: "Och kulrang",   nameRu: "Светло-серый" },
  { code: "13", hex: "#32363c", name: "To'q kulrang",  nameRu: "Тёмно-серый" },
  { code: "14", hex: "#3e332e", name: "Shokolad",      nameRu: "Тёмно-коричневый" },
];

// Ip (kord) rangi — profil/rom bilan bir xil 3 rangdan MATOGA eng yaqini avtomatik tanlanadi.
// Masalan: mato jigarrang bo'lsa ip ham jigarrang, mato och bo'lsa ip oq.
// "redmean" formulasi — oddiy RGB masofasidan ko'ra ko'zga yaqinroq natija beradi.
function nearestColor(hex) {
  const rgb = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = rgb(hex);

  let best = COLORS[0], bestDist = Infinity;
  for (const c of COLORS) {
    const [r2, g2, b2] = rgb(c.profile);
    const rm = (r1 + r2) / 2;
    const dist =
      (2 + rm / 256) * (r1 - r2) ** 2 +
      4 * (g1 - g2) ** 2 +
      (2 + (255 - rm) / 256) * (b1 - b2) ** 2;
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  return best;
}

// HEX -> HSL (burmalarning yorug'/to'q almashinuvini shu asosda hisoblaymiz)
function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, sat = 0;
  if (max !== min) {
    const d = max - min;
    sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else                h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: sat * 100, l: l * 100 };
}

// Bitta rang qatori (yorliq + 3 ta doiracha)
function ColorRow({ label, value, onChange, t }) {
  return (
    <div className="row">
      <span className="row-label text-gray-500 text-sm">{label}:</span>
      <div className="swatches">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            className="swatch"
            style={{ backgroundColor: c.profile }}
            onClick={() => onChange(c.id)}
            aria-pressed={c.id === value}
            aria-label={`${label}: ${t(c.labelKey)}`}
            title={t(c.labelKey)}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlisseWindow() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "uz";
  // Profil oq, rom to'q ko'k — standart holat
  const [profileId, setProfileId] = useState("white");
  const [frameId, setFrameId]     = useState("navy");

  const [fabricCode, setFabricCode] = useState(FABRICS[0].code);

  const pick = (id) => COLORS.find((c) => c.id === id) || COLORS[0];
  const profileColor = pick(profileId);
  const frameColor   = pick(frameId);
  const fabric = FABRICS.find((f) => f.code === fabricCode) || FABRICS[0];
  const fabricName = lang === "ru" ? fabric.nameRu : fabric.name;
  const cordColor  = nearestColor(fabric.hex);   // ip rangi matoga qarab

  // Burmalarni chizuvchi kod effekt ichida — rangni ref orqali beramiz
  const fabricRef = useRef(hexToHsl(fabric.hex));
  const repaintRef = useRef(null);

  const containerRef = useRef(null);
  const topRef       = useRef(null);
  const bottomRef    = useRef(null);
  const blindsRef    = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const topEl     = topRef.current;
    const bottomEl  = bottomRef.current;
    const blindsEl  = blindsRef.current;
    if (!container || !topEl || !bottomEl || !blindsEl) return;

    // Holatni nisbat (0..1) sifatida saqlaymiz — oyna o'lchami o'zgarsa ham
    // jalyuzi o'z joyida qoladi (asl kodda bu joy piksellarda edi va "sakrardi").
    let topFrac = 0;
    let bottomFrac = 1;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    function layout() {
      const H = container.clientHeight;
      if (!H) return;

      let topY    = clamp(topFrac * H, 0, H - PROFILE_HEIGHT * 2);
      let bottomY = clamp(bottomFrac * H - PROFILE_HEIGHT, topY + PROFILE_HEIGHT, H - PROFILE_HEIGHT);

      topEl.style.top    = `${topY}px`;
      bottomEl.style.top = `${bottomY}px`;

      const blindsTop    = topY + PROFILE_HEIGHT;
      const blindsHeight = Math.max(bottomY - blindsTop, 0);
      blindsEl.style.top    = `${blindsTop}px`;
      blindsEl.style.height = `${blindsHeight}px`;

      // Ekran o'quvchilari uchun: jalyuzi qay darajada ochiq
      topEl.setAttribute("aria-valuenow", Math.round((topY / H) * 100));
      bottomEl.setAttribute("aria-valuenow", Math.round((bottomY / H) * 100));

      paintFolds(blindsHeight, H);
    }

    // Jalyuzi yig'ilgan sari burmalar qorayadi va kontrast oshadi.
    // Rang tanlangan matodan olinadi: to'q/yorug' burma almashinuvi nisbat bilan
    // hisoblanadi, shuning uchun har qanday rang (och sut ham, qizil ham) tabiiy chiqadi.
    function paintFolds(blindsHeight, H) {
      const maxHeight = H - PROFILE_HEIGHT * 2;
      const progress  = maxHeight > 0 ? clamp(1 - blindsHeight / maxHeight, 0, 1) : 0;

      const { h, s, l } = fabricRef.current;
      const shade  = 1 - progress * 0.45;              // yig'ilganda umumiy qorayish
      const evenL  = clamp(l * shade, 4, 98);
      const oddL   = clamp(evenL * (1 - (0.07 + progress * 0.30)), 3, 98);

      for (let i = 0; i < blindsEl.children.length; i++) {
        const fold = blindsEl.children[i];
        if (i % 2 === 0) {
          // Yorug' burma — oq soya yo'q, hajm faqat rang farqi bilan beriladi
          fold.style.backgroundColor = `hsl(${h}, ${s}%, ${evenL}%)`;
          fold.style.boxShadow = "none";
        } else {
          // To'q burma — yengil ichki soya (bu burma chizig'ini hosil qiladi)
          fold.style.backgroundColor = `hsl(${h}, ${s}%, ${oddL}%)`;
          fold.style.boxShadow = `inset 0 -${1 + progress * 2}px ${2 + progress * 3}px rgba(0,0,0,${0.15 + progress * 0.35})`;
        }
      }
    }

    // ── Tortish (sichqoncha + barmoq) ──
    let active = null;          // "top" | "bottom" | null
    let startMouseY = 0;
    let startY = 0;

    const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

    function dragStart(e, which) {
      const H = container.clientHeight;
      if (!H) return;
      active = which;
      startMouseY = pointerY(e);
      startY = which === "top" ? topFrac * H : bottomFrac * H - PROFILE_HEIGHT;
      document.body.style.cursor = "grabbing";
    }

    function dragMove(e) {
      if (!active) return;
      if (e.cancelable) e.preventDefault();   // telefonda sahifa siljib ketmasin

      const H = container.clientHeight;
      let newY = startY + (pointerY(e) - startMouseY);

      if (active === "top") {
        const bottomY = bottomFrac * H - PROFILE_HEIGHT;
        newY = clamp(newY, 0, bottomY - PROFILE_HEIGHT);
        topFrac = newY / H;
      } else {
        const topY = topFrac * H;
        newY = clamp(newY, topY + PROFILE_HEIGHT, H - PROFILE_HEIGHT);
        bottomFrac = (newY + PROFILE_HEIGHT) / H;
      }
      layout();
    }

    function dragEnd() {
      if (!active) return;
      active = null;
      document.body.style.cursor = "";
    }

    const onTopDown    = (e) => dragStart(e, "top");
    const onBottomDown = (e) => dragStart(e, "bottom");

    // Klaviatura bilan ham boshqarish (Tab bilan ushlagichga o'tib, strelkalar bilan)
    const STEP = 0.05;
    function onKeyDown(e, which) {
      const keys = ["ArrowUp", "ArrowDown", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();

      const H = container.clientHeight;
      const minGap = (PROFILE_HEIGHT * 2) / H;
      const delta = e.key === "ArrowUp" ? -STEP : e.key === "ArrowDown" ? STEP : 0;

      if (which === "top") {
        const target = e.key === "Home" ? 0 : e.key === "End" ? bottomFrac - minGap : topFrac + delta;
        topFrac = clamp(target, 0, bottomFrac - minGap);
      } else {
        const target = e.key === "End" ? 1 : e.key === "Home" ? topFrac + minGap : bottomFrac + delta;
        bottomFrac = clamp(target, topFrac + minGap, 1);
      }
      layout();
    }
    const onTopKey    = (e) => onKeyDown(e, "top");
    const onBottomKey = (e) => onKeyDown(e, "bottom");
    topEl.addEventListener("keydown", onTopKey);
    bottomEl.addEventListener("keydown", onBottomKey);

    topEl.addEventListener("mousedown", onTopDown);
    topEl.addEventListener("touchstart", onTopDown, { passive: false });
    bottomEl.addEventListener("mousedown", onBottomDown);
    bottomEl.addEventListener("touchstart", onBottomDown, { passive: false });

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("touchmove", dragMove, { passive: false });
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("touchend", dragEnd);
    document.addEventListener("touchcancel", dragEnd);

    // Mato rangi almashganda qayta chizish uchun
    repaintRef.current = layout;

    // O'lcham o'zgarsa qayta hisoblaymiz (birinchi chizilishda ham shu ishlaydi)
    const ro = new ResizeObserver(layout);
    ro.observe(container);
    layout();

    return () => {
      repaintRef.current = null;
      ro.disconnect();
      topEl.removeEventListener("keydown", onTopKey);
      bottomEl.removeEventListener("keydown", onBottomKey);
      topEl.removeEventListener("mousedown", onTopDown);
      topEl.removeEventListener("touchstart", onTopDown);
      bottomEl.removeEventListener("mousedown", onBottomDown);
      bottomEl.removeEventListener("touchstart", onBottomDown);
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("touchmove", dragMove);
      document.removeEventListener("mouseup", dragEnd);
      document.removeEventListener("touchend", dragEnd);
      document.removeEventListener("touchcancel", dragEnd);
      document.body.style.cursor = "";
    };
  }, []);

  // Mato tanlanganda burmalar rangi darhol yangilanadi
  useEffect(() => {
    fabricRef.current = hexToHsl(fabric.hex);
    if (repaintRef.current) repaintRef.current();
  }, [fabric.hex]);

  const starPath =
    "M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 Z";

  const colorVars = {
    "--pw-profile": profileColor.profile,
    "--pw-profile-border": profileColor.border,
    "--pw-profile-handle": profileColor.handle,
    "--pw-profile-shine": profileColor.shine,
    "--pw-frame": frameColor.frame,
    "--pw-frame-shine": frameColor.frameShine,
    "--pw-cord": cordColor.profile,
  };

  return (
    <div>
    <div className="plisse-window" style={colorVars}>
      {/* Deraza ortidagi manzara */}
      <div className="view-outside">
        <div className="sky">
          <div className="sun" />
          <div className="cloud cloud-1" />
          <div className="cloud cloud-2" />
          <div className="cloud cloud-3" />
        </div>

        <div className="mountains" />

        <div className="ground">
          <div className="road"><div className="road-line" /></div>
        </div>

        <div className="logo-container">
          <svg className="bordo-star" viewBox="-4 -4 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d={starPath} stroke="#cc0000" strokeWidth="4" strokeLinejoin="round" />
            <path d={starPath} stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          </svg>
          <p className="logo-text">COMBO STAR</p>
          <p className="logo-tagline">{t("plisse.tagline")}</p>
        </div>
      </div>

      {/* Jalyuzi: ikkala profilni tortish mumkin */}
      <div className="plisse-container" ref={containerRef}>
        <div className="profile top-profile" ref={topRef} role="slider" tabIndex={0}
             aria-label={t("plisse.top_handle")}
             aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
          <div className="handle" />
        </div>

        <div className="blinds" ref={blindsRef}>
          {Array.from({ length: FOLDS }, (_, i) => <div className="fold" key={i} />)}
        </div>

        <div className="profile bottom-profile" ref={bottomRef} role="slider" tabIndex={0}
             aria-label={t("plisse.bottom_handle")}
             aria-valuemin={0} aria-valuemax={100} aria-valuenow={100}>
          <div className="handle" />
        </div>
      </div>
    </div>

    {/* Rang tanlash: profil va rom alohida */}
    <div className="plisse-colors">
      <ColorRow label={t("plisse.color_label")} value={profileId} onChange={setProfileId} t={t} />
      <ColorRow label={t("plisse.frame_label")} value={frameId}   onChange={setFrameId}   t={t} />

      {/* Mato (lenta) — namunalar kitobidagi raqamlar bilan */}
      <div className="fabrics">
        <span className="fabrics-label text-gray-500 text-sm">
          {t("plisse.fabric_label")}: <b className="text-gray-700">{fabric.code} · {fabricName}</b>
        </span>
        <div className="fabric-grid">
          {FABRICS.map((f) => (
            <button
              key={f.code}
              type="button"
              className="fabric"
              onClick={() => setFabricCode(f.code)}
              aria-pressed={f.code === fabricCode}
              aria-label={`${f.code} — ${lang === "ru" ? f.nameRu : f.name}`}
              title={`${f.code} — ${lang === "ru" ? f.nameRu : f.name}`}
            >
              <span className="chip" style={{ backgroundColor: f.hex }} />
              <span className="code">{f.code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}
