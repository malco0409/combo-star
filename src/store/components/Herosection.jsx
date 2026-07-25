// Herosection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const slats = Array.from({ length: 10 });

export default function Herosection() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-[720px] flex items-center justify-center overflow-hidden bg-[#6b0000]">
      {/* === Jaluziya taxtachalari (slats) === */}
      <div className="absolute inset-0 flex flex-col">
        {slats.map((_, i) => (
          <div
            key={i}
            className="flex-1 border-b border-black/20"
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(180deg,rgba(130,0,0,.97) 0%,rgba(90,0,0,.95) 49%,rgba(110,0,0,.97) 50%,rgba(140,5,5,.95) 100%)"
                  : "linear-gradient(180deg,rgba(115,0,0,.97) 0%,rgba(80,0,0,.95) 49%,rgba(100,0,0,.97) 50%,rgba(130,3,3,.96) 100%)",
              opacity: visible ? 1 : 0,
              transform: visible ? "rotateX(0deg) scaleY(1)" : "rotateX(80deg) scaleY(0.1)",
              transition: `opacity 0.5s ${i * 0.05}s ease, transform 0.6s ${i * 0.05}s ease`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      {/* === Yengil yorug'lik overlay === */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg,rgba(255,255,255,.04) 0%,transparent 50%,rgba(0,0,0,.22) 100%)",
        }}
      />

      {/* === Ip chiziqlar (dekorativ) === */}
      <div className="absolute top-0 bottom-0 left-[38%] w-[2px] bg-gradient-to-b from-white/10 to-white/5 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-[38%] w-[2px] bg-gradient-to-b from-white/10 to-white/5 pointer-events-none" />

      {/* === Kontent === */}
      <div
        className="relative z-10 text-center px-6 py-20"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.9s 0.5s ease, transform 0.9s 0.5s ease",
        }}
      >
        <h1
          className="text-white font-extrabold leading-tight mb-5 drop-shadow-lg"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3.4rem)",
            whiteSpace: "pre-line",
          }}
        >
          {t("hero.title")}
        </h1>

        <p
          className="text-white/80 leading-relaxed max-w-xl mx-auto mb-9"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "clamp(1rem, 2vw, 1.15rem)",
          }}
        >
          {t("hero.desc")}
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => navigate("/catalog")}
            className="flex items-center gap-2 bg-white text-[#6b0000] font-bold
                       text-base px-8 py-3.5 rounded-lg shadow-xl transition-all
                       duration-250 hover:-translate-y-0.5 hover:shadow-2xl
                       hover:bg-rose-50 cursor-pointer"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("hero.order")} &nbsp;→
          </button>

          <button
            onClick={() => navigate("/measuring")}
            className="bg-transparent text-white font-bold text-base px-8 py-3.5
                       rounded-lg border-2 border-white/75 transition-all duration-250
                       hover:-translate-y-0.5 hover:border-white hover:bg-white/10
                       cursor-pointer"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("hero.measure")}
          </button>
        </div>
      </div>
    </section>
  );
}