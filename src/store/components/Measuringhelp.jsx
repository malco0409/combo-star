// MeasuringHelp.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MeasuringHelp() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-[#610202] py-16 px-4 sm:py-15">
      <div
        ref={ref}
        className="max-w-2xl mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <h2
          className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-5 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t("measuring_help.title")}
        </h2>

        <p
          className="text-white/85 text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {t("measuring_help.desc")}
        </p>

        <button
          onClick={() => navigate("/measuring")}
          className="bg-white text-[#8B0000] font-semibold text-base sm:text-lg
                     px-10 py-4 rounded-xl transition-all duration-250
                     hover:bg-gray-100 hover:scale-105 active:scale-95
                     cursor-pointer shadow-lg"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {t("measuring_help.btn2")}
        </button>
      </div>
    </section>
  );
}