// src/pages/about/About.jsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Img from "../../components/Img";
import { useWorks, workTitle, workDesc } from "../../data/worksStore";

export default function About() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "uz";

  // Ishlar (loyihalar) — admin panelidan boshqariladi
  const projects = useWorks().map((w) => ({
    id: w.id,
    image: w.images[0] || "",
    title: workTitle(w, t, lang),
    description: workDesc(w, t, lang),
    images: w.images,
  }));

  return (
    <div className="bg-white min-h-screen">

      {/* ───── Banner ───── */}
      <section
        className="relative w-full flex items-center h-100 justify-center overflow-hidden
                   py-14 px-6 md:py-20"
        style={{
          background:
            "linear-gradient(135deg, #780202 0%, #a80000 40%, #c0111b 70%, #780202 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'
              width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise'
              baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200'
              height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="absolute inset-0 flex mt-30 pointer-events-none select-none">
          <svg
            width="100%" height="100%"
            viewBox="0 0 1000 200"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <text
              x="50%" y="75%"
              textAnchor="middle"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              fontWeight="900"
              fontFamily="sans-serif"
              fontSize="195"
              letterSpacing="8"
            >
              COMBO STAR
            </text>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-in">
          <div className="mb-5 w-12 h-12 flex items-center justify-center
                          rounded-full border-2 border-white/40">
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>

          <h2 className="text-white font-bold leading-tight mb-4
                         text-3xl sm:text-4xl md:text-5xl tracking-tight">
            {t("about.banner_title")}
          </h2>

          <p className="text-white/80 font-normal leading-relaxed
                        text-base sm:text-lg max-w-xl">
            {t("about.banner_desc")}
          </p>
        </div>
      </section>

      {/* ───── Story ───── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
        <h3 className="text-gray-900 font-bold text-2xl sm:text-3xl mb-6">
          {t("about.story_title")}
        </h3>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          {t("about.story_desc")}
        </p>
      </section>

      {/* ───── Stats ───── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {["s1", "s2", "s3", "s4"].map((s) => (
            <div
              key={s}
              className="rounded-2xl border border-gray-100 bg-gray-50 py-7 px-4 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="text-[#a80000] font-extrabold text-3xl sm:text-4xl mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t(`about.stats.${s}_value`)}
              </div>
              <div className="text-gray-500 text-sm font-medium">{t(`about.stats.${s}_label`)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Projects ───── */}
      <section className="light-surface w-full py-16 px-4 sm:px-6 lg:px-8"
        style={{ background: "linear-gradient(180deg, #f8f8f8 0%, #ffffff 100%)" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-gray-900 font-bold text-2xl sm:text-3xl mb-3">
              {t("about.works_title")}
            </h3>
            <p className="text-gray-500 text-base sm:text-lg">
              {t("about.works_desc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate("/project", { state: project })}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer
                           hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <Img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 sm:h-64 object-cover
                               transition-transform duration-500 group-hover:scale-105"
                    fallback={
                      <div className="w-full h-56 sm:h-64 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                        🖼️
                      </div>
                    }
                  />
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "rgba(120, 2, 2, 0.75)" }}
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24"
                      fill="none" stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round"
                      className="mb-2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    <span className="text-white font-medium text-sm">
                      {t("about.view")}
                    </span>
                    <span className="text-white/70 text-xs mt-1">
                      {project.images.length} {t("about.photos")}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-gray-800 font-semibold text-base
                                 group-hover:text-[#780202] transition-colors duration-300">
                    {project.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}