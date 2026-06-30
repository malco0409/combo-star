// src/pages/orders/OrdersPage.jsx
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const statusKeys = {
  "Qabul qilindi 📬":  "orders.status.accepted",
  "Tayyorlanmoqda ⏳": "orders.status.pending",
  "Zakaz tayyor! 🎉":  "orders.status.ready",
  "Yetkazilmoqda 🚚":  "orders.status.delivery",
};

const statusColors = {
  "Qabul qilindi 📬":  "bg-purple-100 text-purple-700",
  "Tayyorlanmoqda ⏳": "bg-yellow-100 text-yellow-700",
  "Zakaz tayyor! 🎉":  "bg-green-100 text-green-700",
  "Yetkazilmoqda 🚚":  "bg-blue-100 text-blue-700",
};

export default function OrdersPage() {
  const { orders, deleteOrder } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 min-h-screen mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            {t("back")}
          </button>
        </div>

        <h1 className="text-gray-900 font-bold text-2xl mb-6">
          📦 {t("orders.title")}
        </h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <p className="text-gray-900 font-bold text-xl">{t("orders.empty")}</p>
            <p className="text-gray-500 text-center">{t("orders.empty_desc")}</p>
            <button onClick={() => navigate("/catalog")}
              className="mt-2 bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold py-3 px-8 rounded-2xl transition-colors">
              {t("cart.browse")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {t("orders.order_num")}{String(order.id).slice(-6)}
                    </p>
                    <p className="text-gray-400 text-sm mt-0.5">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {statusKeys[order.status] ? t(statusKeys[order.status]) : order.status}
                    </span>
                    <button onClick={() => { if (window.confirm(t("orders.delete_confirm"))) deleteOrder(order.id); }}
                      className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors duration-200"
                      title={t("orders.delete")}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-4 flex gap-6">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-gray-700 text-sm font-medium">{order.customer?.name || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    <span className="text-gray-700 text-sm font-medium">{order.customer?.phone || "—"}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <img src={item.product.image} alt={item.product.title} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{item.product.title}</p>
                        <p className="text-gray-500 text-xs">
                          {item.width} × {item.height} sm • {item.area} m² • {item.color} • {item.qty} {t("product.piece")}
                        </p>
                      </div>
                      <p className="text-[#a80000] font-bold text-sm flex-shrink-0">
                        {item.symbol}{(parseFloat(item.totalForeign) * item.qty).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                  <span className="font-bold text-gray-900">{t("orders.total")}:</span>
                  <span className="font-bold text-[#a80000] text-lg">
                    {order.items[0]?.symbol}
                    {order.items.reduce((sum, item) => sum + parseFloat(item.totalForeign) * item.qty, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}