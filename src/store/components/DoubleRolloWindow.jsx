// DoubleRolloWindow — dabl rollo (ikkili stor: tyul + qalin blackout).
// Manba: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/
//        (double-rollo.html + double-rollo-style.css + double-rollo.js)
//
// Mantiq ASL `double-rollo.js` dagidek: IKKITA MUSTAQIL zanjir, har biri
// o'z matosining balandligini boshqaradi:
//   CHAP zanjir -> orqa qalin (blackout) mato
//   O'NG zanjir -> old shaffof (tyul) mato
//
// React uchun o'zgargani: DOMContentLoaded o'rniga useEffect + ref lar,
// listener'lar unmount'da tozalanadi. Qo'shimcha: klaviatura bilan boshqarish.
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import WindowScene from "./WindowScene";
import "./DoubleRolloWindow.css";

// Asl double-rollo.js dagi chegaralar
const MIN_HEIGHT = 20;
const MAX_HEIGHT = 540;

export default function DoubleRolloWindow() {
  const { t } = useTranslation();

  const backFabricRef  = useRef(null);
  const frontFabricRef = useRef(null);
  const backChainRef   = useRef(null);
  const frontChainRef  = useRef(null);
  const backLeftRef    = useRef(null);
  const backRightRef   = useRef(null);
  const frontLeftRef   = useRef(null);
  const frontRightRef  = useRef(null);

  useEffect(() => {
    const cleanups = [];

    // Universal zanjir boshqaruvi (asl koddagi setupChainControl)
    function setupChainControl(chain, leftStrand, rightStrand, fabric) {
      if (!chain || !fabric) return;

      let isDragging = false;
      let startY = 0;
      let startHeight = 0;

      const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

      function apply(newHeight) {
        fabric.style.height = `${newHeight}px`;

        // Zanjirning o'zini siljitmasdan munchoqlarini aylantiramiz
        if (rightStrand) rightStrand.style.backgroundPositionY = `${newHeight * 2}px`;
        if (leftStrand)  leftStrand.style.backgroundPositionY  = `${-newHeight * 2}px`;

        chain.setAttribute(
          "aria-valuenow",
          Math.round(((newHeight - MIN_HEIGHT) / (MAX_HEIGHT - MIN_HEIGHT)) * 100)
        );
      }

      function startDrag(e) {
        isDragging = true;
        startY = pointerY(e);
        startHeight = fabric.offsetHeight;
        document.body.style.cursor = "grabbing";
      }

      function moveDrag(e) {
        if (!isDragging) return;
        if (e.cancelable) e.preventDefault();

        let newHeight = startHeight + (pointerY(e) - startY);
        if (newHeight < MIN_HEIGHT) newHeight = MIN_HEIGHT;
        if (newHeight > MAX_HEIGHT) newHeight = MAX_HEIGHT;
        apply(newHeight);
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

        let h = fabric.offsetHeight;
        if (e.key === "Home")      h = MIN_HEIGHT;
        else if (e.key === "End")  h = MAX_HEIGHT;
        else h += e.key === "ArrowUp" ? -25 : 25;
        apply(Math.min(Math.max(h, MIN_HEIGHT), MAX_HEIGHT));
      }

      chain.addEventListener("mousedown", startDrag);
      chain.addEventListener("touchstart", startDrag, { passive: false });
      chain.addEventListener("keydown", keyDown);
      window.addEventListener("mousemove", moveDrag, { passive: false });
      window.addEventListener("touchmove", moveDrag, { passive: false });
      window.addEventListener("mouseup", endDrag);
      window.addEventListener("touchend", endDrag);
      window.addEventListener("touchcancel", endDrag);

      apply(fabric.offsetHeight);

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

    // Chap zanjir — orqa qalin mato (blackout)
    setupChainControl(backChainRef.current, backLeftRef.current, backRightRef.current, backFabricRef.current);
    // O'ng zanjir — old shaffof mato (tyul)
    setupChainControl(frontChainRef.current, frontLeftRef.current, frontRightRef.current, frontFabricRef.current);

    return () => {
      cleanups.forEach((fn) => fn());
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div>
      <div className="drollo-window">
        <div className="window-frame">

          {/* Deraza ortidagi manzara (umumiy komponent) */}
          <div className="view-outside"><WindowScene /></div>

          {/* DOUBLE ROLLO QISMI */}
          <div className="rollo-container">
            {/* Umumiy tepa kassetasi (ikki rolik bitta kassetada) */}
            <div className="rollo-top-cassette" />

            {/* Orqa qavat — qalin blackout mato */}
            <div className="rollo-back-fabric" ref={backFabricRef}>
              <div className="bottom-weight back-weight" />
            </div>

            {/* Oldingi qavat — shaffof tyul */}
            <div className="rollo-front-fabric" ref={frontFabricRef}>
              <div className="bottom-weight front-weight" />
            </div>
          </div>

          {/* Chap zanjir — qalin mato */}
          <div className="control-panel left-control">
            <div
              className="chain-container"
              ref={backChainRef}
              role="slider"
              tabIndex={0}
              aria-label={t("drollo.back")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={15}
            >
              <div className="chain-left" ref={backLeftRef} />
              <div className="chain-right" ref={backRightRef} />
              <div className="chain-bottom-loop" />
            </div>
            <div className="control-label">{t("drollo.back_label")}</div>
          </div>

          {/* O'ng zanjir — tyul */}
          <div className="control-panel right-control">
            <div
              className="chain-container"
              ref={frontChainRef}
              role="slider"
              tabIndex={0}
              aria-label={t("drollo.front")}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={25}
            >
              <div className="chain-left" ref={frontLeftRef} />
              <div className="chain-right" ref={frontRightRef} />
              <div className="chain-bottom-loop" />
            </div>
            <div className="control-label">{t("drollo.front_label")}</div>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs text-center mt-4 px-2 leading-relaxed">
        {t("drollo.hint")}
      </p>
    </div>
  );
}
