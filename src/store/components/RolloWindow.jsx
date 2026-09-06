// RolloWindow — oddiy rollo (rulon parda).
// Manba: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/ (rollo.html + rollo-style.css + rollo.js)
//
// Mantiq ASL `rollo.js` dagidek: zanjir tortiladi -> `.rollo-container` balandligi
// o'zgaradi, zanjir munchoqlarining foni siljiydi. Mato YAXLIT (sploshnoy) —
// zebradagi kabi ikkinchi qavat siljishi yo'q, faqat uzunlik o'zgaradi.
//
// React uchun o'zgargani: DOMContentLoaded o'rniga useEffect + ref lar,
// listener'lar unmount'da tozalanadi. Qo'shimcha: mato rangi va klaviatura.
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import WindowScene from "./WindowScene";
import "./RolloWindow.css";

// Asl rollo.js dagi chegaralar
const MIN_HEIGHT = 60;    // eng tepa holat
const MAX_HEIGHT = 560;   // eng past holat

// Mato ranglari.
// DIQQAT: VAQTINCHALIK namunalar — egasi rollo matolarining haqiqiy raqam va
// ranglarini yuborgach shu ro'yxat almashtiriladi (plisse dagi kabi).
const FABRICS = [
  { code: "01", hex: "#f1f2f6", name: "Och kulrang", nameRu: "Светло-серый" },
  { code: "02", hex: "#e8e4da", name: "Sut rang",    nameRu: "Молочный" },
  { code: "03", hex: "#c9bda6", name: "Bej",         nameRu: "Бежевый" },
  { code: "04", hex: "#2c3e50", name: "To'q kulrang", nameRu: "Тёмно-серый" },
];

export default function RolloWindow() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "uz";

  const [fabricCode, setFabricCode] = useState(FABRICS[0].code);
  const fabric = FABRICS.find((f) => f.code === fabricCode) || FABRICS[0];
  const fabricName = lang === "ru" ? fabric.nameRu : fabric.name;

  const containerRef  = useRef(null);
  const chainRef      = useRef(null);
  const chainLeftRef  = useRef(null);
  const chainRightRef = useRef(null);

  useEffect(() => {
    const container  = containerRef.current;
    const chain      = chainRef.current;
    const chainLeft  = chainLeftRef.current;
    const chainRight = chainRightRef.current;
    if (!container || !chain) return;

    let isDragging = false;
    let startY = 0;
    let startHeight = 0;

    const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

    function apply(newHeight) {
      container.style.height = `${newHeight}px`;

      // Zanjirning o'zini siljitmasdan munchoqlarining fonini siljitamiz
      if (chainRight) chainRight.style.backgroundPositionY = `${newHeight * 2}px`;
      if (chainLeft)  chainLeft.style.backgroundPositionY  = `${-newHeight * 2}px`;

      chain.setAttribute(
        "aria-valuenow",
        Math.round(((newHeight - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100)
      );
    }

    function onStart(e) {
      isDragging = true;
      startY = pointerY(e);
      startHeight = container.offsetHeight;
      document.body.style.cursor = "grabbing";
    }

    function onMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();   // telefonda sahifa surilmasin

      let newHeight = startHeight + (pointerY(e) - startY);
      if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
      if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
      apply(newHeight);
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      document.body.style.cursor = "";
    }

    function onKeyDown(e) {
      const keys = ["ArrowUp", "ArrowDown", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();

      let h = container.offsetHeight;
      if (e.key === "Home")      h = MIN_HEIGHT;
      else if (e.key === "End")  h = MAX_HEIGHT;
      else h += e.key === "ArrowUp" ? -25 : 25;
      apply(Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT));
    }

    chain.addEventListener("mousedown", onStart);
    chain.addEventListener("touchstart", onStart, { passive: false });
    chain.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMove, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);

    apply(container.offsetHeight);

    return () => {
      chain.removeEventListener("mousedown", onStart);
      chain.removeEventListener("touchstart", onStart);
      chain.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div>
      <div className="rollo-window" style={{ "--rw-fabric": fabric.hex }}>
        <div className="window-frame">

          {/* Deraza ortidagi manzara (umumiy komponent) */}
          <div className="view-outside"><WindowScene /></div>

          {/* ROLLO JALYUZI QISMI */}
          <div className="rollo-container" ref={containerRef}>
            <div className="rollo-top-cassette" />
            <div className="rollo-fabric">
              <div className="bottom-weight" />
            </div>
          </div>

          {/* Yon tomondagi zanjir */}
          <div
            className="chain-container"
            ref={chainRef}
            role="slider"
            tabIndex={0}
            aria-label={t("rollo.chain")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={18}
          >
            <div className="chain-left" ref={chainLeftRef} />
            <div className="chain-right" ref={chainRightRef} />
            <div className="chain-bottom-loop" />
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs text-center mt-4 px-2 leading-relaxed">
        {t("rollo.hint")}
      </p>

      {/* Mato rangi */}
      <div className="win-colors">
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
