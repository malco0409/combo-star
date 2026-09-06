// VerticalWindow — vertikal jalyuzi.
// Manba: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/ (vertical.html + vertical-style.css + vertical.js)
//
// Mantiq ASL `vertical.js` dagidek saqlangan:
//   - lentalar (slat) konteyner kengligiga qarab dinamik yaratiladi
//     (eni 60px, 25px ustma-ust tushadi -> samarali qadam 35px);
//     ikki chetdagi ~25% to'q rangda, o'rtasi oq (krem);
//   - O'NG zanjir  -> lentalarni o'rtadan ikki chetga surish (drawRatio 0..1);
//   - CHAP zanjir  -> lentalarni burash (rotateDeg 0..90, `rotateY` 3D);
//   - yig'ilayotganda lentalar avtomatik 90 gradusga buriladi (haqiqiy hayotdagidek).
//
// React uchun o'zgargani: DOMContentLoaded o'rniga useEffect + ref lar,
// listener'lar unmount'da tozalanadi.
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import WindowScene from "./WindowScene";
import "./VerticalWindow.css";

const SLAT_WIDTH = 60;   // qalin va yumshoq burmalar uchun kattaroq o'lcham
const OVERLAP = 25;      // "dikey (tyul) parda" ko'rinishi uchun ko'proq ustma-ust tushadi

export default function VerticalWindow() {
  const { t } = useTranslation();

  const slatsRef       = useRef(null);
  const rotateChainRef = useRef(null);
  const drawChainRef   = useRef(null);
  const rotateLeftRef  = useRef(null);
  const rotateRightRef = useRef(null);
  const drawLeftRef    = useRef(null);
  const drawRightRef   = useRef(null);

  useEffect(() => {
    const slatsContainer = slatsRef.current;
    if (!slatsContainer) return;

    // Konteyner kengligi (derazani to'liq yopish uchun kerakli joy)
    const containerWidth = slatsContainer.offsetWidth || 340;
    const effectiveWidth = SLAT_WIDTH - OVERLAP;
    const numSlats = Math.ceil(containerWidth / effectiveWidth) + 1;

    // Lentalarni yaratish. Simmetrik: ikki chet to'q, o'rtasi oq.
    const slats = [];
    const blackCount = Math.floor(numSlats * 0.25);
    for (let i = 0; i < numSlats; i++) {
      const slat = document.createElement("div");
      slat.className =
        (i < blackCount || i >= numSlats - blackCount) ? "slat black-fabric" : "slat white-fabric";
      slat.style.width = `${SLAT_WIDTH}px`;
      slat.style.zIndex = numSlats - i;   // o'ngdagilari chapdagining ustiga chiqsin
      slatsContainer.appendChild(slat);
      slats.push(slat);
    }

    // Holat: drawRatio 0 = to'liq yopiq, 1 = to'liq yig'ilgan; rotateDeg 0..90
    let drawRatio = 0;
    let rotateDeg = 0;

    function updateSlats() {
      const spreadSpacing = effectiveWidth;
      const stackedSpacing = 4;           // yig'ilganda qanchalik siqilishi
      const halfCount = numSlats / 2;

      for (let i = 0; i < numSlats; i++) {
        const spreadPos = i * spreadSpacing;

        // O'rtadan ikki chetga ochiladi: chap yarmi chapga, o'ng yarmi o'ngga yig'iladi
        const stackedPos = i < halfCount
          ? i * stackedSpacing
          : containerWidth - (numSlats - i) * stackedSpacing - SLAT_WIDTH;

        const currentPos = spreadPos + (stackedPos - spreadPos) * drawRatio;

        slats[i].style.left = `${currentPos}px`;

        // Yig'ilayotganda lentalar o'zi 90 gradusga buriladi (haqiqiy hayotdagidek)
        let currentRotate = rotateDeg;
        if (drawRatio > 0.1 && rotateDeg < 90) {
          const forcedRotate = Math.max(rotateDeg, drawRatio * 90 * 1.5);
          currentRotate = Math.min(90, forcedRotate);
        }

        slats[i].style.transform = `rotateY(${currentRotate}deg)`;
      }
    }

    // ── Zanjirlarni boshqarish ──
    const cleanups = [];

    function setupChainControl(chain, leftStrand, rightStrand, onDrag, onKey) {
      if (!chain) return;

      let isDragging = false;
      let startY = 0;
      let bgPos = 0;

      const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

      function startDrag(e) {
        isDragging = true;
        startY = pointerY(e);
        document.body.style.cursor = "grabbing";
      }

      function moveDrag(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        const clientY = pointerY(e);
        const deltaY = clientY - startY;
        startY = clientY;                 // uzluksiz nisbiy tortish

        // Munchoqlarni "aylantirish"
        bgPos += deltaY;
        if (rightStrand) rightStrand.style.backgroundPositionY = `${bgPos}px`;
        if (leftStrand)  leftStrand.style.backgroundPositionY  = `${-bgPos}px`;

        onDrag(deltaY);
      }

      function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = "";
      }

      function keyDown(e) {
        const keys = ["ArrowUp", "ArrowDown", "Home", "End"];
        if (!keys.includes(e.key)) return;
        e.preventDefault();
        onKey(e.key);
      }

      chain.addEventListener("mousedown", startDrag);
      chain.addEventListener("touchstart", startDrag, { passive: false });
      chain.addEventListener("keydown", keyDown);
      window.addEventListener("mousemove", moveDrag, { passive: false });
      window.addEventListener("touchmove", moveDrag, { passive: false });
      window.addEventListener("mouseup", endDrag);
      window.addEventListener("touchend", endDrag);
      window.addEventListener("touchcancel", endDrag);

      cleanups.push(() => {
        chain.removeEventListener("mousedown", startDrag);
        chain.removeEventListener("touchstart", startDrag);
        chain.removeEventListener("keydown", keyDown);
        window.removeEventListener("mousemove", moveDrag);
        window.removeEventListener("touchmove", moveDrag);
        window.removeEventListener("mouseup", endDrag);
        window.removeEventListener("touchend", endDrag);
        window.removeEventListener("touchcancel", endDrag);
      });
    }

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // O'ng zanjir — surish / yig'ish (400px tortilganda to'liq ochiladi)
    setupChainControl(
      drawChainRef.current, drawLeftRef.current, drawRightRef.current,
      (deltaY) => {
        drawRatio = clamp(drawRatio + deltaY / 400, 0, 1);
        updateSlats();
      },
      (key) => {
        if (key === "Home")      drawRatio = 0;
        else if (key === "End")  drawRatio = 1;
        else drawRatio = clamp(drawRatio + (key === "ArrowUp" ? -0.12 : 0.12), 0, 1);
        updateSlats();
      }
    );

    // Chap zanjir — burash (0 dan 90 gradusgacha)
    setupChainControl(
      rotateChainRef.current, rotateLeftRef.current, rotateRightRef.current,
      (deltaY) => {
        rotateDeg = clamp(rotateDeg + (deltaY / 150) * 90, 0, 90);
        updateSlats();
      },
      (key) => {
        if (key === "Home")      rotateDeg = 0;
        else if (key === "End")  rotateDeg = 90;
        else rotateDeg = clamp(rotateDeg + (key === "ArrowUp" ? -12 : 12), 0, 90);
        updateSlats();
      }
    );

    // Boshlang'ich holat (o'lchamlar aniq bo'lishi uchun kichik kechikish bilan)
    const timer = setTimeout(updateSlats, 50);
    updateSlats();

    return () => {
      clearTimeout(timer);
      cleanups.forEach((fn) => fn());
      slats.forEach((s) => s.remove());
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div>
      <div className="vertical-window">
        <div className="window-frame">

          {/* Deraza ortidagi manzara (umumiy komponent) */}
          <div className="view-outside"><WindowScene /></div>

          {/* VERTIKAL JALYUZI QISMI */}
          <div className="vertical-container">
            <div className="vertical-top-track" />
            {/* lentalar shu yerga JS orqali qo'shiladi (asl koddagidek) */}
            <div className="slats-container" ref={slatsRef} />
          </div>

          {/* Chap zanjir — burash */}
          <div className="control-panel left-control">
            <div
              className="chain-container"
              ref={rotateChainRef}
              role="slider"
              tabIndex={0}
              aria-label={t("vertical.rotate")}
              aria-valuemin={0}
              aria-valuemax={90}
              aria-valuenow={0}
            >
              <div className="chain-left" ref={rotateLeftRef} />
              <div className="chain-right" ref={rotateRightRef} />
              <div className="chain-bottom-loop" />
            </div>
            <div className="control-label">{t("vertical.rotate_label")}</div>
          </div>

          {/* O'ng zanjir — surish */}
          <div className="control-panel right-control">
            <div
              className="chain-container"
              ref={drawChainRef}
              role="slider"
              tabIndex={0}
              aria-label={t("vertical.draw")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={0}
            >
              <div className="chain-left" ref={drawLeftRef} />
              <div className="chain-right" ref={drawRightRef} />
              <div className="chain-bottom-loop" />
            </div>
            <div className="control-label">{t("vertical.draw_label")}</div>
          </div>
        </div>
      </div>

      {/* Qanday ishlashi */}
      <p className="text-gray-500 text-xs text-center mt-4 px-2 leading-relaxed">
        {t("vertical.hint")}
      </p>
    </div>
  );
}
