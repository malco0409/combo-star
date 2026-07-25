// src/pages/project/ProjectDetail.jsx
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProjectDetail() {
  const { state: project } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [lightboxIndex, setLightboxIndex] = useState(null); // null = yopiq

  const images = project?.images || [];

  const openLightbox = (i) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e) => {
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape")     closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIndex, goPrev, goNext]);

  // Body scroll lock when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  // Masonry-style: turli o'lchamlar
  const getSpanClass = (i) => {
    const pattern = [
      "col-span-2 row-span-2", // katta
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-1 row-span-2", // baland
      "col-span-2 row-span-1", // keng
      "col-span-1 row-span-1",
      "col-span-1 row-span-1",
      "col-span-2 row-span-1",
    ];
    return pattern[i % pattern.length];
  };

  // To'g'ridan-to'g'ri /project ga kirilsa (state yo'q) — About sahifasiga qaytaramiz
  if (!project) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🖼️</div>
          <h1 className="text-gray-900 font-bold text-xl mb-4">{t("collection.not_found")}</h1>
          <button
            onClick={() => navigate("/about")}
            className="bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("about.works_title")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mt-20">

      {/* ── Orqaga ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900
                     transition-colors duration-200 text-sm font-medium mb-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("back")}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── Sarlavha ── */}
        <div className="mb-8">
          <h1 className="text-gray-900 font-bold text-3xl mb-2">{project.title}</h1>
          <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* ── Rasmlar grid (masonry-style) ── */}
        {images.length > 0 ? (
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(3, 1fr)",
              gridAutoRows: "200px",
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => openLightbox(i)}
                className={`${getSpanClass(i)} relative overflow-hidden rounded-2xl
                            cursor-pointer group shadow-sm hover:shadow-xl
                            transition-shadow duration-300`}
              >
                <img
                  src={img}
                  alt={`${project.title} - ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500
                             group-hover:scale-105"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30
                                transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                  bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-sm">{t("no_images") || "Rasmlar yo'q"}</p>
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.92)" }}
          onClick={closeLightbox}
        >
          {/* Yopish */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full
                       bg-white/10 hover:bg-white/25 flex items-center justify-center
                       transition-colors duration-200"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Rasm soni */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10
                          bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5">
            <span className="text-white text-sm font-medium">
              {lightboxIndex + 1} / {images.length}
            </span>
          </div>

          {/* Chap strelka */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 sm:left-8 z-10 w-12 h-12 rounded-full
                       bg-white/10 hover:bg-white/25 flex items-center justify-center
                       transition-colors duration-200 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:-translate-x-0.5 transition-transform duration-200">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Asosiy rasm */}
          <div
            className="relative max-w-5xl w-full mx-16 sm:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex]}
              alt={`${project.title} - ${lightboxIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              style={{ userSelect: "none" }}
            />
          </div>

          {/* O'ng strelka */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 sm:right-8 z-10 w-12 h-12 rounded-full
                       bg-white/10 hover:bg-white/25 flex items-center justify-center
                       transition-colors duration-200 group"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform duration-200">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 px-4
                          max-w-lg overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden
                            border-2 transition-all duration-200
                            ${i === lightboxIndex
                              ? "border-[#a80000] opacity-100 scale-110"
                              : "border-transparent opacity-50 hover:opacity-80"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}