// SetkaWindow — suriladigan moskit setka, IKKI REJIMDA:
//   OYNA rejimi  -> pastdagi tutqichni tepaga/pastga tortasiz (vertikal)
//   ESHIK rejimi -> chapdagi tutqichni o'ngdan chapga tortasiz (gorizontal, plisse)
// Manba: /Users/ayub/gemini/uygavazifa/jalyuzi-animatsiyasi/
//        (setka.html + setka-style.css + setka.js)
//
// Mantiq ASL `setka.js` dagidek. React uchun o'zgargani: rejim almashish
// classList o'rniga React holati bilan, DOMContentLoaded o'rniga useEffect + ref,
// listener'lar unmount'da tozalanadi. Qo'shimcha: klaviatura bilan boshqarish.
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import WindowScene from "./WindowScene";
import "./SetkaWindow.css";

export default function SetkaWindow({ initialMode = "window" }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState(initialMode);   // "window" | "door"

  const windowWrapRef = useRef(null);
  const doorWrapRef   = useRef(null);
  const windowFabRef  = useRef(null);
  const doorFabRef    = useRef(null);
  const handleBottomRef = useRef(null);
  const handleSideRef   = useRef(null);

  useEffect(() => {
    const windowWrapper = windowWrapRef.current;
    const doorWrapper   = doorWrapRef.current;
    const windowFabric  = windowFabRef.current;
    const doorFabric    = doorFabRef.current;
    const handleBottom  = handleBottomRef.current;
    const handleSide    = handleSideRef.current;
    if (!windowFabric || !doorFabric) return;

    let isDraggingWindow = false;
    let isDraggingDoor = false;
    let startY = 0, startHeight = 0;
    let startX = 0, startWidth = 0;

    const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
    const pointerY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);
    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

    // Oyna rejimi: setka balandligi
    function applyWindow(h) {
      const minH = 30;                                    // kassetagacha yig'iladi
      const maxH = (windowWrapper?.offsetHeight || 0) - 15;
      windowFabric.style.height = `${clamp(h, minH, maxH)}px`;
    }

    // Eshik rejimi: setka kengligi (o'ngdan chapga)
    function applyDoor(w) {
      const minW = 30;                                    // kasseta yoniga yig'iladi
      const maxW = (doorWrapper?.offsetWidth || 0) - 15;  // to'liq yopiladi
      doorFabric.style.width = `${clamp(w, minW, maxW)}px`;
    }

    function startDragW(e) {
      isDraggingWindow = true;
      startY = pointerY(e);
      startHeight = windowFabric.offsetHeight;
      document.body.style.cursor = "grabbing";
    }

    function startDragD(e) {
      isDraggingDoor = true;
      startX = pointerX(e);
      startWidth = doorFabric.offsetWidth;
      document.body.style.cursor = "grabbing";
    }

    function moveDrag(e) {
      if (isDraggingWindow) {
        if (e.cancelable) e.preventDefault();
        applyWindow(startHeight + (pointerY(e) - startY));
      }
      if (isDraggingDoor) {
        if (e.cancelable) e.preventDefault();
        // O'ngdan chapga tortiladi, shuning uchun (startX - clientX)
        applyDoor(startWidth + (startX - pointerX(e)));
      }
    }

    function endDrag() {
      if (!isDraggingWindow && !isDraggingDoor) return;
      isDraggingWindow = false;
      isDraggingDoor = false;
      document.body.style.cursor = "";
    }

    function keyWindow(e) {
      const keys = ["ArrowUp", "ArrowDown", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const h = windowFabric.offsetHeight;
      if (e.key === "Home")      applyWindow(0);
      else if (e.key === "End")  applyWindow(99999);
      else applyWindow(h + (e.key === "ArrowUp" ? -25 : 25));
    }

    function keyDoor(e) {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      const w = doorFabric.offsetWidth;
      if (e.key === "Home")      applyDoor(0);
      else if (e.key === "End")  applyDoor(99999);
      else applyDoor(w + (e.key === "ArrowLeft" ? 25 : -25));
    }

    handleBottom?.addEventListener("mousedown", startDragW);
    handleBottom?.addEventListener("touchstart", startDragW, { passive: false });
    handleBottom?.addEventListener("keydown", keyWindow);
    handleSide?.addEventListener("mousedown", startDragD);
    handleSide?.addEventListener("touchstart", startDragD, { passive: false });
    handleSide?.addEventListener("keydown", keyDoor);

    window.addEventListener("mousemove", moveDrag, { passive: false });
    window.addEventListener("touchmove", moveDrag, { passive: false });
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchend", endDrag);
    window.addEventListener("touchcancel", endDrag);

    return () => {
      handleBottom?.removeEventListener("mousedown", startDragW);
      handleBottom?.removeEventListener("touchstart", startDragW);
      handleBottom?.removeEventListener("keydown", keyWindow);
      handleSide?.removeEventListener("mousedown", startDragD);
      handleSide?.removeEventListener("touchstart", startDragD);
      handleSide?.removeEventListener("keydown", keyDoor);
      window.removeEventListener("mousemove", moveDrag);
      window.removeEventListener("touchmove", moveDrag);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchend", endDrag);
      window.removeEventListener("touchcancel", endDrag);
      document.body.style.cursor = "";
    };
  }, []);

  const isDoor = mode === "door";

  return (
    <div>
      {/* Rejim tugmalari */}
      <div className="setka-controls">
        <button
          type="button"
          className={isDoor ? "" : "active"}
          onClick={() => setMode("window")}
          aria-pressed={!isDoor}
        >
          {t("setka.mode_window")}
        </button>
        <button
          type="button"
          className={isDoor ? "active" : ""}
          onClick={() => setMode("door")}
          aria-pressed={isDoor}
        >
          {t("setka.mode_door")}
        </button>
      </div>

      <div className={`setka-window${isDoor ? " door-mode" : ""}`}>
        <div className="window-frame">

          {/* Deraza ortidagi manzara (umumiy komponent) */}
          <div className="view-outside"><WindowScene /></div>

          {/* OYNA REJIMI (tepadan pastga) */}
          <div
            className={`net-wrapper window-net${isDoor ? " hidden" : ""}`}
            ref={windowWrapRef}
          >
            <div className="net-cassette-top" />
            <div className="net-fabric window-fabric" ref={windowFabRef}>
              <div
                className="handle-bar handle-bottom"
                ref={handleBottomRef}
                role="slider"
                tabIndex={isDoor ? -1 : 0}
                aria-label={t("setka.handle_window")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={20}
              >
                <div className="handle-grip" />
              </div>
            </div>
          </div>

          {/* ESHIK REJIMI (yondan yonga — plisse setka) */}
          <div
            className={`net-wrapper door-net${isDoor ? "" : " hidden"}`}
            ref={doorWrapRef}
          >
            <div className="net-cassette-side" />
            <div className="net-fabric door-fabric" ref={doorFabRef}>
              <div
                className="handle-bar handle-side"
                ref={handleSideRef}
                role="slider"
                tabIndex={isDoor ? 0 : -1}
                aria-label={t("setka.handle_door")}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={45}
              >
                <div className="handle-grip" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-500 text-xs text-center mt-4 px-2 leading-relaxed">
        {isDoor ? t("setka.hint_door") : t("setka.hint_window")}
      </p>
    </div>
  );
}
