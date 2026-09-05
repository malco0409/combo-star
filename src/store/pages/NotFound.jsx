// 404 — mavjud bo'lmagan manzil ochilganda (avval bo'sh sahifa chiqardi).
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen mt-20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🪟</div>
        <h1 className="text-gray-900 font-bold text-3xl mb-2">404</h1>
        <p className="text-gray-900 font-semibold text-lg mb-2">{t("notfound.title")}</p>
        <p className="text-gray-500 text-sm mb-6">{t("notfound.desc")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("notfound.home")}
          </button>
          <button
            onClick={() => navigate("/catalog")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("nav.products")}
          </button>
        </div>
      </div>
    </div>
  );
}
