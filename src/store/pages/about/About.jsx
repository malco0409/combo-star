// src/pages/about/About.jsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Har bir loyiha uchun bir nechta rasm
const projectGalleries = {
  1: [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80",
    "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80",
  ],
  2: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
  ],
  3: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
    "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
  ],
  4: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
    "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80",
  ],
  5: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
    "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  ],
  6: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80",
    "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
  ],
};

// Cover rasmlari (kartochkada ko'rinadigan birinchi rasm)
const projectCovers = {
  1: projectGalleries[1][0],
  2: projectGalleries[2][0],
  3: projectGalleries[3][0],
  4: projectGalleries[4][0],
  5: projectGalleries[5][0],
  6: projectGalleries[6][0],
};

export default function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const projects = [1, 2, 3, 4, 5, 6].map((id) => ({
    id,
    image: projectCovers[id],
    title: t(`about.projects.${id}.title`),
    description: t(`about.projects.${id}.description`),
    images: projectGalleries[id],
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
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8"
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
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-56 sm:h-64 object-cover
                               transition-transform duration-500 group-hover:scale-105"
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