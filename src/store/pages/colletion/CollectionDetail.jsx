// src/pages/collection/CollectionDetail.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { colorLabel } from "../../data/collectionStore";

export default function CollectionDetail() {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const product    = state?.product;
  const collection = state?.collection;

  const displayTitle = product?.titleKey ? t(product.titleKey) : product?.title;
  const displayDesc  = product?.descKey  ? t(product.descKey)  : product?.description;

  // Tanlangan rang — avval id, keyin nom bo'yicha topamiz (tildan mustaqil)
  const initialColorIndex = (() => {
    const selId = state?.selectedColorId;
    if (selId) {
      const byId = collection?.colors?.findIndex(c => c.id === selId);
      if (byId >= 0) return byId;
    }
    const sel = state?.selectedColor;
    if (!sel) return 0;
    const idx = collection?.colors?.findIndex(c => c.name === sel);
    return idx >= 0 ? idx : 0;
  })();

  const [width, setWidth]             = useState("");
  const [height, setHeight]           = useState("");
  const [qty, setQty]                 = useState(1);
  const [colorIndex, setColorIndex]   = useState(initialColorIndex);
  const [addedToCart, setAddedToCart] = useState(false);
  const [rate, setRate]               = useState(null);
  const [rateLoading, setRateLoading] = useState(false);

  const selectedColorObj = collection?.colors?.[colorIndex] || collection?.colors?.[0];
  const colorDisplayName = colorLabel(selectedColorObj, t, i18n.language);

  // Rang tanlaganda rasm o'zgaradi
  const displayImage = selectedColorObj?.image || collection?.image;

  // colors_only da har rangning o'z narxi bor
  const itemPrice = selectedColorObj?.price || collection?.price || "$0";
  const hasSize      = width !== "" && height !== "";
  const rawArea      = hasSize ? (Number(width) * Number(height)) / 10000 : 0;
  // 0.5 m² qadam bilan yuqoriga yaxlitlash:
  // 50x100 = 0.5 m² -> 0.5 m², 50x110 = 0.55 m² -> 1 m²
  const area         = hasSize ? Math.max(Math.ceil(rawArea / 0.5) * 0.5, 0.5).toFixed(2) : "0.00";
  const price        = parseFloat(itemPrice.replace(/[^0-9.]/g, "") || "0");
  const symbol       = itemPrice.includes("€") ? "€" : "$";
  const totalForeign = hasSize ? (price * Number(area) * qty).toFixed(2) : "0.00";

  const fetchRate = async () => {
    setRateLoading(true);
    try {
      const res  = await fetch("https://cbu.uz/uz/arkhiv-kursov-valyut/json/");
      const data = await res.json();
      const usd  = data.find((c) => c.Ccy === "USD");
      const eur  = data.find((c) => c.Ccy === "EUR");
      const r    = symbol === "€" ? parseFloat(eur.Rate) : parseFloat(usd.Rate);
      setRate(r);
    } catch {
      setRate(null);
    }
    setRateLoading(false);
  };

  // Valyuta kursini mount paytida bir marta olamiz
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { fetchRate(); }, []);

  const totalUZS = hasSize && rate
    ? Math.round(price * Number(area) * qty * rate).toLocaleString("uz-UZ")
    : null;

  const handleAddToCart = () => {
    if (!hasSize) return;
    addToCart({
      product: { ...product, title: `${displayTitle} — ${collection.name}`, price: itemPrice },
      width, height, qty, color: colorDisplayName, area, totalForeign, totalUZS, symbol,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product || !collection) {
    return (
      <div className="mt-20 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t("collection.not_found")}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-20 min-h-screen">

      {/* Orqaga */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("back")}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Chap ── */}
          <div>
            {displayImage ? (
              <img
                src={displayImage}
                alt={collection.name}
                className="w-full rounded-2xl object-cover shadow-md transition-all duration-300"
                style={{ maxHeight: 460 }}
              />
            ) : (
              <div className="w-full rounded-2xl bg-gray-200 flex items-center justify-center shadow-md" style={{ height: 460 }}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}

            <h1 className="text-gray-900 font-bold text-3xl mt-6 mb-1">{displayTitle}</h1>
            <h2 className="text-[#a80000] font-semibold text-xl mb-3">{collection.name} — {colorDisplayName}</h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">{displayDesc}</p>
            <p className="text-[#a80000] font-bold text-2xl mb-6">
              {t("from")} {symbol}{price} / m²
            </p>

            {/* Ranglar */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">{t("product.colors")}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {collection.colors.map((c, idx) => (
                  <div key={c.id || c.code || idx}
                    onClick={() => setColorIndex(idx)}
                    className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200
                      ${colorIndex === idx ? "border-[#a80000] shadow-md" : "border-gray-100 hover:border-[#a80000]"}`}>
                    {c.image ? (
                      <img src={c.image} alt={colorLabel(c, t, i18n.language)} className="w-full h-20 object-cover" />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className={`p-2 text-center text-xs font-medium ${colorIndex === idx ? "text-[#a80000]" : "text-gray-600"}`}>
                      {colorLabel(c, t, i18n.language)}
                      {c.price && c.price !== collection.price && (
                        <span className="block text-[#a80000] font-bold">{c.price}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── O'ng: Sozlash ── */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 h-fit sticky top-24">

            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <h2 className="font-bold text-gray-900 text-lg">{t("product.customize")}</h2>
            </div>
            <p className="text-gray-500 text-sm -mt-3">{t("product.size_hint")}</p>

            {/* Info box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                </svg>
                <span className="text-amber-800 font-semibold text-sm">{t("product.measure_tip")}</span>
              </div>
              <p className="text-amber-700 text-xs leading-relaxed mb-3">{t("product.measure_desc")}</p>
              <button onClick={() => navigate("/measuring", { state: { productTitle: product.title } })}
                className="text-amber-700 font-semibold text-sm hover:text-amber-900 transition-colors duration-200">
                {t("product.measure_btn")}
              </button>
            </div>

            {/* Tanlangan rang */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="text-gray-500 text-sm">{t("collection.selected_color")}:</span>
              <span className="font-semibold text-gray-900 text-sm">{colorDisplayName || "—"}</span>
            </div>

            {/* Kenglik */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">{t("product.width")}</label>
              <input type="number" value={width} placeholder="120"
                onChange={(e) => { const v = e.target.value; if (v === "") return setWidth(""); if (Number(v) >= 0) setWidth(v); }}
                onFocus={(e) => e.target.select()} min={0}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition bg-gray-50"
              />
              <p className="text-gray-400 text-xs mt-1">{t("product.min_max")}</p>
            </div>

            {/* Balandlik */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">{t("product.height")}</label>
              <input type="number" value={height} placeholder="150"
                onChange={(e) => { const v = e.target.value; if (v === "") return setHeight(""); if (Number(v) >= 0) setHeight(v); }}
                onFocus={(e) => e.target.select()} min={0}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition bg-gray-50"
              />
              <p className="text-gray-400 text-xs mt-1">{t("product.min_max")}</p>
            </div>

            {/* Miqdor */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">{t("product.qty")}</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors duration-200">−</button>
                <span className="flex-1 text-center font-semibold text-gray-900 text-lg">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors duration-200">+</button>
              </div>
            </div>

            {/* Narx */}
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("product.collections")}:</span>
                <span className="font-medium text-gray-900">{collection.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("product.size_label")}:</span>
                <span className="font-medium text-gray-900">{width || "—"} × {height || "—"} sm</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("product.area_label")}:</span>
                <span className="font-medium text-gray-900">{hasSize ? `${area} m²` : "—"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("product.qty_label")}:</span>
                <span className="font-medium text-gray-900">{qty} {t("product.piece")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("product.color_label")}:</span>
                <span className="font-medium text-gray-900">{colorDisplayName || "—"}</span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-1 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{t("product.total")}:</span>
                  <span className="font-bold text-[#a80000] text-lg">{hasSize ? `${symbol}${totalForeign}` : "—"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{t("product.uzs")}:</span>
                  {!hasSize ? (
                    <span className="text-gray-400 text-sm">—</span>
                  ) : rateLoading ? (
                    <span className="text-gray-400 text-sm">{t("product.loading")}</span>
                  ) : totalUZS ? (
                    <span className="text-gray-700 font-semibold text-sm">{totalUZS} {t("product.som")}</span>
                  ) : (
                    <button onClick={fetchRate} className="text-[#a80000] text-xs font-medium hover:underline">
                      {t("product.rate_update")}
                    </button>
                  )}
                </div>
                {rate && hasSize && (
                  <p className="text-gray-400 text-xs text-right">
                    1 {symbol === "€" ? "EUR" : "USD"} = {rate.toLocaleString()} {t("product.som")} ({t("cbu_rate")})
                  </p>
                )}
              </div>
            </div>

            {/* Savatga */}
            {addedToCart ? (
              <div className="w-full bg-green-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("product.added")}
              </div>
            ) : (
              <button onClick={handleAddToCart} disabled={!hasSize}
                className={`w-full text-white font-semibold py-4 rounded-2xl transition-colors duration-200 flex items-center justify-center gap-2 text-base
                  ${hasSize ? "bg-[#a80000] hover:bg-[#8b0000] cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}>
                🛒 {t("product.add_cart")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}