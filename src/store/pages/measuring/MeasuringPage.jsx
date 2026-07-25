// src/pages/measuring/MeasuringPage.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSetting, parseVideo } from "../../data/settingsStore";

export default function MeasuringPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const productTitle = state?.productTitle || null;
  const video = parseVideo(useSetting("measuringVideo"));   // admin qo'shgan video (CRM Sozlamalar)

  const steps = [
    {
      num: 1,
      titleKey: "measuring.step1_title",
      descKey:  "measuring.step1_desc",
      tipKey:   null,
    },
    {
      num: 2,
      titleKey: "measuring.step2_title",
      descKey:  "measuring.step2_desc",
      tipKey:   "measuring.step2_tip",
    },
    {
      num: 3,
      titleKey: "measuring.step3_title",
      descKey:  "measuring.step3_desc",
      tipKey:   "measuring.step3_tip",
    },
    {
      num: 4,
      titleKey: "measuring.step4_title",
      descKey:  "measuring.step4_desc",
      tipKey:   null,
    },
    {
      num: 5,
      titleKey: "measuring.step5_title",
      descKey:  "measuring.step5_desc",
      tipKey:   null,
    },
  ];

  const noteKeys = [
    "measuring.note1",
    "measuring.note2",
    "measuring.note3",
    "measuring.note4",
  ];

  return (
    <div className="bg-white min-h-screen mt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Orqaga */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium mb-8">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("back")}
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h18M3 12h18M3 17h18" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </div>
          <h1 className="text-gray-900 font-bold text-3xl sm:text-4xl mb-3">{t("measuring.title")}</h1>
          {productTitle && (
            <span className="bg-red-50 text-[#a80000] text-sm font-medium px-4 py-1.5 rounded-full mb-3">
              {productTitle}
            </span>
          )}
          <p className="text-gray-500 text-base sm:text-lg max-w-xl">{t("measuring.desc")}</p>
        </div>

        {/* Video */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t("measuring.video_title")}</h2>
          {video ? (
            <div className="w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: "16 / 9" }}>
              {video.type === "file" ? (
                <video src={video.src} controls className="w-full h-full" />
              ) : (
                <iframe
                  src={video.src}
                  title={t("measuring.video_title")}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          ) : (
            <>
              <div className="w-full h-48 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="#9ca3af" stroke="none" />
                </svg>
                <p className="text-gray-400 text-sm">{t("measuring.video_coming")}</p>
              </div>
              <p className="text-[#a80000] text-sm mt-3">{t("measuring.video_desc")}</p>
            </>
          )}
        </div>

        {/* Qadamlar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-5">{t("measuring.steps_title")}</h2>
          <div className="flex flex-col gap-6">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <div className="w-9 h-9 min-w-[36px] rounded-full bg-red-100 flex items-center justify-center text-[#a80000] font-bold text-sm flex-shrink-0">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{t(step.titleKey)}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{t(step.descKey)}</p>
                  {step.tipKey && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
                        <line x1="12" y1="11" x2="12" y2="17" />
                      </svg>
                      <span className="text-[#a80000] text-xs font-medium">
                        {t("measuring.tip_label")}: {t(step.tipKey)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Muhim eslatmalar */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
              <line x1="12" y1="11" x2="12" y2="17" />
            </svg>
            <h2 className="font-semibold text-amber-800">{t("measuring.notes_title")}</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {noteKeys.map((key, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-700 text-sm">
                <span className="mt-1">•</span>
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-gray-900 font-bold text-2xl mb-3">{t("measuring.cta_title")}</h2>
          <p className="text-gray-500 text-base mb-6">{t("measuring.cta_desc")}</p>
          <button onClick={() => navigate("/catalog")}
            className="bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold py-4 px-10 rounded-2xl transition-colors duration-200">
            {t("measuring.cta_btn")}
          </button>
        </div>

      </div>
    </div>
  );
}