import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0f1623] text-white px-6 pt-12 pb-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-10 border-b border-white/10">

        {/* ---- Logo va tavsif ---- */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-sm bg-[#9e2020] flex items-center justify-center flex-shrink-0">
              <div className="w-3.5 h-3.5 rounded-[2px] border-2 border-white" />
            </div>
            <span className="font-bold text-lg tracking-wide" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Combo St<span className="text-[#e53935]">★</span>r
            </span>
          </div>
          <p className="text-white/55 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {t("footer.desc")}
          </p>
        </div>

        {/* ---- Tezkor havolalar ---- */}
        <div>
          <h4 className="font-bold text-base mb-5" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {t("footer.quick_links")}
          </h4>
          <ul className="space-y-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <li>
              <Link to="/catalog" className="text-white/55 text-sm hover:text-white transition-colors duration-200">
                {t("nav.products")}
              </Link>
            </li>
            <li>
              <Link to="/measuring" className="text-white/55 text-sm hover:text-white transition-colors duration-200">
                {t("hero.measure")}
              </Link>
            </li>
          </ul>
        </div>

        {/* ---- Aloqa ---- */}
        <div>
          <h4 className="font-bold text-base mb-5" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {t("nav.contact")}
          </h4>
          <ul className="space-y-2 text-white/55 text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
            <li>
              {t("contact.email")}:{" "}
              <a href="mailto:info@combostar.uz" className="hover:text-white transition-colors duration-200">
                info@combostar.uz
              </a>
            </li>
            <li>
              {t("contact.phone")}:{" "}
              <a href="tel:+998900526266" className="hover:text-white transition-colors duration-200">
                +998 90 052 62 66
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ---- Copyright ---- */}
      <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-white/35 text-sm" style={{ fontFamily: "'Nunito', sans-serif" }}>
        <span>© 2026 Combo St<span className="text-[#e53935]">★</span>r. {t("footer.copyright")}</span>
        <Link to="/admin" className="text-white/30 hover:text-white/70 transition-colors duration-200">
          CRM
        </Link>
      </div>
    </footer>
  );
}