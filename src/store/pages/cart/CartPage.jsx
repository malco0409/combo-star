// src/pages/cart/CartPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { sendToTelegram } from "../../utils/telegram";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQty, addOrder } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [sent, setSent]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm]         = useState({ name: "", phone: "" });
  const [errors, setErrors]     = useState({ name: "", phone: "" });

  const totalForeignSum = cart
    .reduce((sum, item) => sum + parseFloat(item.totalForeign) * item.qty, 0)
    .toFixed(2);

  const symbol = cart.length > 0 ? cart[0].symbol : "";

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", phone: "" };
    if (!form.name.trim()) { newErrors.name = t("cart.err_name"); valid = false; }
    if (!form.phone.trim()) { newErrors.phone = t("cart.err_phone"); valid = false; }
    else if (!/^\+?[0-9]{9,13}$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("cart.err_phone_invalid"); valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const orderId = addOrder(cart, form);
      await sendToTelegram(cart, form, orderId);
      setSent(true);
      clearCart();
      setModalOpen(false);
      setTimeout(() => setSent(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-gray-50 min-h-screen mt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-gray-900 font-bold text-2xl">{t("cart.success")}</p>
          <p className="text-gray-500 text-center">{t("cart.success_desc")}</p>
          <button onClick={() => navigate("/orders")}
            className="bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200">
            {t("cart.view_orders")}
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen mt-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 py-20">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <p className="text-gray-900 font-bold text-2xl">{t("cart.empty")}</p>
          <p className="text-gray-500 text-center">{t("cart.empty_desc")}</p>
          <button onClick={() => navigate("/catalog")}
            className="mt-2 bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold py-3 px-8 rounded-2xl transition-colors duration-200">
            {t("cart.browse")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium mb-6">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("cart.continue")}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-gray-900 font-bold text-2xl">{t("cart.title")}</h1>
              <button
                onClick={clearCart}
                className="flex items-center gap-1.5 text-gray-400 hover:text-[#a80000] text-sm font-medium transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                </svg>
                {t("cart.clear")}
              </button>
            </div>

            {cart.map((item) => (
              <div key={item.cartId} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex gap-4 items-center">
                <img src={item.product.image} alt={item.product.title} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-base mb-1">{item.product.title}</p>
                  <p className="text-gray-500 text-sm">{t("product.size_label")}: {item.width} × {item.height} cm</p>
                  <p className="text-gray-500 text-sm">{t("product.area_label")}: {item.area} m²</p>
                  <p className="text-gray-500 text-sm">{t("product.color_label")}: {item.color}</p>
                  <div className="flex items-center gap-2 mt-3 border border-gray-200 rounded-xl overflow-hidden w-fit">
                    <button onClick={() => { if (item.qty > 1) updateQty(item.cartId, item.qty - 1); }}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">−</button>
                    <span className="text-sm font-semibold text-gray-900 px-2">{item.qty}</span>
                    <button onClick={() => updateQty(item.cartId, item.qty + 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <button onClick={() => removeFromCart(item.cartId)}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                  <p className="text-[#a80000] font-bold text-lg">
                    {item.symbol}{(parseFloat(item.totalForeign) * item.qty).toFixed(2)}
                  </p>
                  {item.totalUZS && <p className="text-gray-400 text-xs">{item.totalUZS} so'm</p>}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sticky top-24 flex flex-col gap-4">
              <h2 className="font-bold text-gray-900 text-lg">{t("cart.summary")}</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.products")} ({cart.length}):</span>
                  <span className="font-semibold text-gray-900">{symbol}{totalForeignSum}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("cart.delivery")}:</span>
                  <span className="font-semibold text-green-600">{t("cart.free")}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900 text-base">{t("cart.total")}:</span>
                  <span className="font-bold text-[#a80000] text-lg">{symbol}{totalForeignSum}</span>
                </div>
              </div>
              <button onClick={() => setModalOpen(true)}
                className="w-full bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold py-4 rounded-xl transition-colors duration-200 text-base">
                {t("cart.checkout")}
              </button>
              <div className="flex flex-col gap-2 mt-1">
                {["g1", "g2", "g3"].map((key) => (
                  <div key={key} className="flex items-start gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span className="text-gray-500 text-xs">{t(`cart.guarantees.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center px-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md z-10 p-8"
            style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
            onClick={(e) => e.stopPropagation()}>

            {/* Sarlavha */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900 font-bold text-xl">{t("cart.confirm_title")}</h3>
              <button onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Mahsulotlar soni va narx */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t("cart.products")}:</span>
                <span className="font-semibold">{cart.length} {t("product.piece")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("cart.total")}:</span>
                <span className="font-bold text-[#a80000]">{symbol}{totalForeignSum}</span>
              </div>
            </div>

            {/* Ism */}
            <label className="text-gray-700 text-sm font-medium mb-1 block">{t("cart.name")}</label>
            <input type="text" value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
              placeholder={t("cart.name_placeholder")}
              className={`mb-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 ${errors.name ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-[#a80000]"}`}
            />
            {errors.name ? <p className="text-red-500 text-xs mb-3">{errors.name}</p> : <div className="mb-3" />}

            {/* Telefon */}
            <label className="text-gray-700 text-sm font-medium mb-1 block">{t("cart.phone")}</label>
            <input type="tel" value={form.phone}
              onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
              placeholder={t("cart.phone_placeholder")}
              className={`mb-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 ${errors.phone ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-[#a80000]"}`}
            />
            {errors.phone ? <p className="text-red-500 text-xs mb-3">{errors.phone}</p> : <div className="mb-4" />}

            {/* ✅ Chiroyli info xabar */}
            <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                </svg>
              </div>
              <p className="text-amber-800 text-xs leading-relaxed font-medium">
                {t("cart.order_notice")}
              </p>
            </div>

            {/* Tasdiqlash tugmasi */}
            <button onClick={handleOrder} disabled={loading}
              className={`w-full text-white font-semibold py-4 rounded-2xl transition-colors duration-200 text-base flex items-center justify-center gap-2
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#a80000] hover:bg-[#8b0000]"}`}>
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3" />
                    <path d="M21 12a9 9 0 00-9-9" />
                  </svg>
                  {t("cart.sending")}
                </>
              ) : t("cart.confirm_btn")}
            </button>
          </div>
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.9) translateY(20px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}