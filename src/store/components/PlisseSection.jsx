// Bosh sahifadagi interaktiv bo'lim: chapda tortiladigan plisse jalyuzi, o'ngda matn.
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVisibleProducts } from "../data/productStore";
import PlisseWindow from "./PlisseWindow";

export default function PlisseSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const products = useVisibleProducts();

  // "Buyurtma berish" — plisse mahsuloti sahifasiga. Yashirilgan bo'lsa katalogga.
  const goToPlisse = () => {
    const plisse = products.find((p) => p.id === "plisse");
    if (!plisse) return navigate("/catalog");
    navigate("/product", {
      state: {
        ...plisse,
        title: plisse.name || t(plisse.titleKey),
        description: plisse.desc || t(plisse.descKey),
        titleKey: plisse.titleKey,
        descKey: plisse.descKey,
      },
    });
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

        {/* Deraza */}
        <PlisseWindow />

        {/* Matn */}
        <div className="text-center lg:text-left">
          <span className="inline-block bg-red-50 text-[#a80000] text-xs font-semibold
                           px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
            {t("plisse.badge")}
          </span>

          <h2
            className="text-gray-900 font-bold text-3xl sm:text-4xl mb-4 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("plisse.title")}
          </h2>

          <p
            className="text-gray-500 text-base sm:text-lg leading-relaxed mb-6"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("plisse.desc")}
          </p>

          <p className="text-gray-400 text-sm mb-8">{t("plisse.hint")}</p>

          <button
            onClick={goToPlisse}
            className="bg-[#780202] hover:bg-[#8b0000] active:scale-95 text-white font-bold
                       text-sm px-8 py-4 rounded-lg transition-all duration-200 cursor-pointer
                       tracking-wide shadow-lg"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("plisse.btn")}
          </button>
        </div>
      </div>
    </section>
  );
}
