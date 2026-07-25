import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

export default function Cart() {
  const { cart, orders } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      {/* Zakazni kuzatish */}
      {orders.length > 0 && (
        <button
          onClick={() => navigate("/orders")}
          className="relative flex items-center gap-1.5 text-sm font-semibold
                     text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2
                     rounded-xl transition-colors duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
          <span className="max-sm:hidden">{t("orders.title")}</span>
          <span className="w-5 h-5 bg-[#a80000] text-white text-xs rounded-full
                          flex items-center justify-center font-bold">
            {orders.length}
          </span>
        </button>
      )}

      {/* Savat */}
      <button
        onClick={() => navigate("/cart")}
        className="relative flex items-center text-xl text-red-800 bg-red-50
                   p-2.5 rounded-xl shadow-sm hover:bg-red-100 hover:scale-110
                   transition-all duration-300 ease-in-out cursor-pointer"
      >
        <svg width="22" height="22" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#a80000] text-white
                           text-xs rounded-full flex items-center justify-center font-bold">
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
}