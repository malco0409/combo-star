// src/store/components/Loading.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Loading({ onDone }) {
  const [open, setOpen] = useState(false);
  const [hide, setHide] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const openTimer = setTimeout(() => setOpen(true), 200);
    const hideTimer = setTimeout(() => setHide(true), 1900);
    const doneTimer = setTimeout(() => onDone(), 2300);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slats = Array.from({ length: 18 });

  return (
    <div
      className={`fixed inset-0 z-[999999] flex items-center justify-center
                  transition-opacity duration-500
                  ${hide ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* Jaluzи slatlari */}
      <div className="absolute inset-0 flex flex-col overflow-hidden">
        {slats.map((_, i) => {
          // Pastdan tepaga — oxirgi qator birinchi ochiladi
          const delay = (slats.length - 1 - i) * 35;

          return (
            <div key={i} className="flex-1 flex">
              {/* Chap qism */}
              <div
                className="h-full transition-all ease-in-out"
                style={{
                  width: open ? "0%" : "50%",
                  transitionDuration: "1100ms",
                  transitionDelay: `${delay}ms`,
                  background: `linear-gradient(to right, #6b0000, #a80000)`,
                  boxShadow: open ? "none" : "inset -4px 0 10px rgba(0,0,0,0.4)",
                }}
              />

              {/* O'rta — shaffof */}
              <div className="flex-1 h-full" />

              {/* O'ng qism */}
              <div
                className="h-full transition-all ease-in-out"
                style={{
                  width: open ? "0%" : "50%",
                  transitionDuration: "1100ms",
                  transitionDelay: `${delay}ms`,
                  background: `linear-gradient(to left, #6b0000, #a80000)`,
                  boxShadow: open ? "none" : "inset 4px 0 10px rgba(0,0,0,0.4)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Logo markaz */}
      <div
        className={`relative z-10 flex flex-col items-center gap-4
                    transition-all duration-700
                    ${open ? "opacity-0 scale-90" : "opacity-100 scale-100"}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-red-800 rounded-2xl shadow-2xl flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <span className="text-white font-bold text-3xl tracking-wide">
            Combo St<span className="text-red-300">★</span>r
          </span>
        </div>

        {/* Loading bar */}
        <div className="w-48 h-1 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all ease-linear"
            style={{
              width: open ? "100%" : "0%",
              transitionDuration: "1500ms",
              transitionDelay: "300ms",
            }}
          />
        </div>

        <p className="text-white/70 text-sm tracking-widest uppercase">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}