// Catalog.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import plisseImg   from "../../assets/plisse.JPG";
import kunTunImg   from "../../assets/combo.jpg";
import vertikalImg from "../../assets/vertikal.jpg";
import DikkeyIMG   from "../../assets/Dikkey.jpg";
import RolloImg    from "../../assets/rollo.jpg";
import DablImg     from "../../assets/Dabl.jpg";
import MasketImg   from "../../assets/Setka.jpg";
import SenaksImg   from "../../assets/Senaks.webp";
import SuriladImg  from "../../assets/Razdvejnnoy.jpg";

const productList = [
  { id: 1, image: plisseImg,   titleKey: "products.plisse_title",   descKey: "products.plisse_desc",   price: "$16" },
  { id: 2, image: kunTunImg,   titleKey: "products.kuntun_title",   descKey: "products.kuntun_desc",   price: "$11" },
  { id: 3, image: vertikalImg, titleKey: "products.vertikal_title", descKey: "products.vertikal_desc", price: "$8"  },
  { id: 4, image: DikkeyIMG,   titleKey: "products.dikkey_title",   descKey: "products.dikkey_desc",   price: "$25" },
  { id: 5, image: RolloImg,    titleKey: "products.rollo_title",    descKey: "products.rollo_desc",    price: "$25" },
  { id: 6, image: DablImg,     titleKey: "products.dablrollo_title", descKey: "products.dablrollo_desc", price: "$30" },
  { id: 7, image: MasketImg,   titleKey: "products.masket_title",   descKey: "products.masket_desc",   price: "$13" },
  { id: 8, image: SenaksImg,   titleKey: "products.senaks_title",   descKey: "products.senaks_desc",   price: "$21" },
  { id: 9, image: SuriladImg,  titleKey: "products.surilad_title",  descKey: "products.surilad_desc",  price: "$45" },
];

export default function Catalog() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productList;
    return productList.filter((p) =>
      t(p.titleKey).toLowerCase().includes(q) ||
      t(p.descKey).toLowerCase().includes(q)
    );
  }, [query, t]);

  const goToProduct = (product) =>
    navigate("/product", {
      state: {
        ...product,
        title: t(product.titleKey),
        description: t(product.descKey),
        titleKey: product.titleKey,
        descKey: product.descKey,
      },
    });

  return (
    <div className="bg-white min-h-screen">

      {/* ───── Banner ───── */}
      <section
        className="relative w-full flex items-center h-100 justify-center overflow-hidden
                   py-14 px-6 md:py-20"
        style={{
          background: "linear-gradient(135deg, #780202 0%, #a80000 40%, #c0111b 70%, #780202 100%)",
          minHeight: "280px",
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

        <div className="absolute inset-0 pointer-events-none select-none">
          <svg width="100%" height="100%" viewBox="0 0 1000 200"
            preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
            <text x="50%" y="75%" textAnchor="middle" fill="none"
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" fontWeight="900"
              fontFamily="sans-serif" fontSize="195" letterSpacing="8">
              COMBO STAR
            </text>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-in">
          <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/40">
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
              <line x1="12" y1="11" x2="12" y2="17" />
            </svg>
          </div>

          <h2 className="text-white font-bold leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl tracking-tight">
            {t("catalog.banner_title")}
          </h2>
          <p className="text-white/80 font-normal leading-relaxed text-base sm:text-lg max-w-xl">
            {t("catalog.banner_desc")}
          </p>
        </div>
      </section>

      {/* ───── Cards ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Qidiruv + natija soni */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("catalog.search_placeholder")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] focus:bg-white transition"
            />
          </div>
          <span className="text-gray-500 text-sm font-medium">
            {filtered.length} {t("catalog.count")}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-gray-900 font-bold text-lg mb-1">{t("catalog.empty")}</h3>
            <p className="text-gray-500 text-sm">{t("catalog.empty_desc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const title = t(product.titleKey);
              const description = t(product.descKey);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-md overflow-hidden flex flex-col
                             hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-56 sm:h-64 object-cover cursor-pointer
                                 group-hover:scale-105 transition-transform duration-500"
                      onClick={() => goToProduct(product)}
                    />
                    <div className="absolute top-4 right-4 bg-[#780202] text-white rounded-xl
                                    px-3 py-2 text-center leading-tight shadow-lg">
                      <span className="block text-xs font-medium">{t("catalog.dan")}</span>
                      <span className="block text-2xl font-bold">{product.price}</span>
                      <span className="block text-xs font-medium">{t("catalog.m2")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-gray-900 font-bold text-xl mb-2 group-hover:text-[#a80000] transition-colors">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{description}</p>

                    <button
                      onClick={() => goToProduct(product)}
                      className="mt-5 w-full bg-[#780202] hover:bg-[#8b0000] active:scale-95 text-white
                                 font-semibold py-3 px-6 rounded-xl transition-all
                                 duration-200 flex items-center justify-center gap-2"
                    >
                      {t("catalog.btn")}
                      <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}