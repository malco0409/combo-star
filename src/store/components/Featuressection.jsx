import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function FeatureCard({ icon, titleKey, descKey, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="group flex flex-col items-center text-center px-6 py-10 rounded-2xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ${index * 0.15}s ease, transform 0.7s ${index * 0.15}s ease, box-shadow 0.3s ease`,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div
        className="mb-6 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
        style={{ width: 72, height: 72, background: "rgba(176,48,48,0.12)", color: "#b03030" }}
      >
        <div className="relative flex items-center justify-center w-full h-full rounded-full">
          <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping"
            style={{ background: "rgba(176,48,48,0.15)", animationDuration: "1s" }}
          />
          {icon}
        </div>
      </div>

      <h3
        className="text-gray-900 font-bold mb-3 transition-colors duration-300 group-hover:text-[#b03030]"
        style={{ fontSize: "1.15rem", fontFamily: "'Playfair Display', serif" }}
      >
        {t(titleKey)}
      </h3>

      <div
        className="mb-4 rounded-full transition-all duration-500 group-hover:w-12"
        style={{
          height: 2,
          width: visible ? 32 : 0,
          background: "#b03030",
          opacity: 0.5,
          transition: `width 0.6s ${index * 0.15 + 0.4}s ease`,
        }}
      />

      <p className="text-gray-500 leading-relaxed" style={{ fontSize: "0.97rem", maxWidth: 280 }}>
        {t(descKey)}
      </p>
    </div>
  );
}

const features = [
  {
    titleKey: "features.custom_title",
    descKey: "features.custom_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 7h18M3 12h18M3 17h18" />
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="8" y1="5" x2="8" y2="19" />
      </svg>
    ),
  },
  {
    titleKey: "features.quality_title",
    descKey: "features.quality_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    titleKey: "features.delivery_title",
    descKey: "features.delivery_desc",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h2
          className="text-gray-900 font-bold text-3xl sm:text-4xl mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t("features.section_title")}
        </h2>
        <p className="text-gray-500" style={{ fontFamily: "'Nunito', sans-serif" }}>
          {t("features.section_desc")}
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} index={i} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <div
          className="rounded-full"
          style={{ width: 48, height: 3, background: "linear-gradient(90deg,#b03030,#e57373)", opacity: 0.35 }}
        />
      </div>
    </section>
  );
}