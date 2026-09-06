// ZebraWindow — "Kun va Tun" (zebra / den-noch) jalyuzi.
// Manba: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/ (zebra.html + zebra-style.css + zebra.js)
//
// Mantiq ASL `zebra.js` dagidek saqlangan:
//   zanjir tortiladi -> `.zebra-container` balandligi o'zgaradi, ayni paytda
//   zanjir munchoqlari va OLD qavat matosining `background-position-y` si siljiydi.
//   Old qavat orqa qavatga nisbatan siljigani uchun setka|lenta|setka|lenta
//   almashadi — "kun/tun" effekti shundan hosil bo'ladi.
//
// React uchun o'zgargani: DOMContentLoaded o'rniga useEffect + ref lar,
// listener'lar unmount'da tozalanadi. Qo'shimcha: mato rangini tanlash va
// klaviatura bilan boshqarish.
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import WindowScene from "./WindowScene";
import "./ZebraWindow.css";

// Asl zebra.js dagi chegaralar (deraza 600px, ichki bo'shliq 570px)
const MIN_HEIGHT = 60;    // eng tepa holat
const MAX_HEIGHT = 560;   // eng past holat

// Mato (lenta) ranglari.
// DIQQAT: bular VAQTINCHALIK namunalar — egasi zebra matolarining haqiqiy
// raqam va ranglarini yuborgach shu ro'yxat almashtiriladi (plisse dagi kabi).
const FABRICS = [
  { code: "01", hex: "#2c3e50", name: "To'q kulrang", nameRu: "Тёмно-серый" },
  { code: "02", hex: "#e8e4da", name: "Sut rang",     nameRu: "Молочный" },
  { code: "03", hex: "#c9bda6", name: "Bej",          nameRu: "Бежевый" },
  { code: "04", hex: "#8d8177", name: "Kofe",         nameRu: "Кофейный" },
];

export default function ZebraWindow() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "uz";

  const [fabricCode, setFabricCode] = useState(FABRICS[0].code);
  const fabric = FABRICS.find((f) => f.code === fabricCode) || FABRICS[0];
  const fabricName = lang === "ru" ? fabric.nameRu : fabric.name;

  const containerRef  = useRef(null);
  const chainRef      = useRef(null);
  const chainLeftRef  = useRef(null);
  const chainRightRef = useRef(null);
  const frontRef      = useRef(null);

  useEffect(() => {
    const container  = containerRef.current;
    const chain      = chainRef.current;
    const chainLeft  = chainLeftRef.current;
    const chainRight = chainRightRef.current;
    const frontLayer = frontRef.current;
    if (!container || !chain || !frontLayer) return;

    let isDragging = false;
    let startY = 0;
    let startHeight = 0;

    const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

    function apply(newHeight) {
      // Jalyuzi uzunligi
      container.style.height = `${newHeight}px`;

      // Zanjirning o'zini siljitmasdan, munchoqlarining fonini siljitamiz —
      // bu xuddi zanjir aylanayotgandek uzilmas effekt beradi.
      if (chainRight) chainRight.style.backgroundPositionY = `${newHeight * 2}px`;
      if (chainLeft)  chainLeft.style.backgroundPositionY  = `${-newHeight * 2}px`;

      // DEN NOCH EFFEKTI: old qavat orqa qavatga nisbatan siljiydi
      frontLayer.style.backgroundPositionY = `${newHeight * 2}px`;

      chain.setAttribute(
        "aria-valuenow",
        Math.round(((newHeight - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100)
      );
    }

    function currentHeight() {
      return container.offsetHeight;
    }

    function onStart(e) {
      isDragging = true;
      startY = pointerY(e);
      startHeight = currentHeight();
      document.body.style.cursor = "grabbing";
    }

    function onMove(e) {
      if (!isDragging) return;
      if (e.cancelable) e.preventDefault();   // telefonda sahifa surilib ketmasin

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

    // Klaviatura bilan ham (Tab -> zanjir, strelkalar)
    function onKeyDown(e) {
      const keys = ["ArrowUp", "ArrowDown", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();

      let h = currentHeight();
      if (e.key === "Home")      h = MIN_HEIGHT;
      else if (e.key === "End")  h = MAX_HEIGHT;
      else h += e.key === "ArrowUp" ? -18 : 18;
      apply(Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT));
    }

    chain.addEventListener("mousedown", onStart);
    chain.addEventListener("touchstart", onStart, { passive: false });
    chain.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);
    window.addEventListener("touchcancel", onEnd);

    // Boshlang'ich holatni to'g'rilash (asl kodda ham shunday)
    apply(currentHeight());

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
      <div className="zebra-window" style={{ "--zw-fabric": fabric.hex }}>
        <div className="window-frame">

          {/* Deraza ortidagi manzara (umumiy komponent) */}
          <div className="view-outside"><WindowScene /></div>

          {/* ZEBRA JALYUZI QISMI */}
          <div className="zebra-container" ref={containerRef}>
            <div className="zebra-top-cassette" />
            <div className="zebra-fabric back-layer" />
            <div className="zebra-fabric front-layer" ref={frontRef} />
            <div className="bottom-weight" />
          </div>

          {/* Yon tomondagi zanjir mexanizmi */}
          <div
            className="chain-container"
            ref={chainRef}
            role="slider"
            tabIndex={0}
            aria-label={t("zebra.chain")}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={40}
          >
            <div className="chain-left" ref={chainLeftRef} />
            <div className="chain-right" ref={chainRightRef} />
            <div className="chain-bottom-loop" />
          </div>
        </div>
      </div>

      {/* Qanday ishlashi */}
      <p className="text-gray-500 text-xs text-center mt-4 px-2 leading-relaxed">
        {t("zebra.hint")}
      </p>

      {/* Mato (lenta) rangi */}
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
