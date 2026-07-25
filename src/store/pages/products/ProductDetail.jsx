import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useCollection, colorLabel } from "../../data/collectionStore";

export default function ProductDetail() {
  const { t } = useTranslation();
  const { state: product } = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [width, setWidth]             = useState("");
  const [height, setHeight]           = useState("");
  const [qty, setQty]                 = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [rate, setRate]               = useState(null);
  const [rateLoading, setRateLoading] = useState(false);

  // titleKey dan mahsulot id sini olamiz (masalan "products.plisse_title" -> "plisse")
  const productId = product?.titleKey
    ? product.titleKey.replace("products.", "").replace(/_title$/, "")
    : null;

  // Kolleksiya/ranglar CRM ("/admin/kolleksiyalar") orqali boshqariladi — Firestore dan jonli.
  const productCollection = useCollection(productId);

  const label = (c) => colorLabel(c, t);

  // Birinchi itemdan colors va image olamiz (catalog da colors yo'q)
  const firstItem = useMemo(() => {
    if (!productCollection) return null;
    if (productCollection.type === "collections") return productCollection.items[0] || null;
    return null;
  }, [productCollection]);

  // product.colors bo'lsa ishlatamiz, bo'lmasa firstItem.colors dan olamiz
  const productColors = useMemo(() => {
    if (product?.colors && product.colors.length > 0) return product.colors;
    if (firstItem && firstItem.colors && firstItem.colors.length > 0) return firstItem.colors;
    return [];
  }, [product?.colors, firstItem]);

  // Asosiy rasm — tanlangan rang rasmi, yo'q bo'lsa product.image
  const selectedColorObj = productColors[selectedColorIndex] || null;
  const color = selectedColorObj ? label(selectedColorObj) : "";
  const displayImage = selectedColorObj?.image || product?.image;

  const displayTitle = product?.titleKey ? t(product.titleKey) : product?.title;
  const displayDesc  = product?.descKey  ? t(product.descKey)  : product?.description;

  const hasSize      = width !== "" && height !== "";
  const rawArea      = hasSize ? (Number(width) * Number(height)) / 10000 : 0;
  // 0.5 m² qadam bilan yuqoriga yaxlitlash:
  // 50x100 = 0.5 m² -> 0.5 m², 50x110 = 0.55 m² -> 1 m²
  const area         = hasSize ? Math.max(Math.ceil(rawArea / 0.5) * 0.5, 0.5).toFixed(2) : "0.00";
  const price        = parseFloat((product?.price || "0").replace(/[^0-9.]/g, ""));
  const symbol       = (product?.price || "").includes("€") ? "€" : "$";
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
    addToCart({ product, width, height, qty, color, area, totalForeign, totalUZS, symbol });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // To'g'ridan-to'g'ri /product ga kirilsa (state yo'q) — katalogga qaytaramiz
  if (!product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🪟</div>
          <h1 className="text-gray-900 font-bold text-xl mb-2">{t("collection.not_found")}</h1>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 bg-[#a80000] hover:bg-[#8b0000] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            {t("catalog.btn")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mt-20 min-h-screen">

      {/* ── Orqaga ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          {t("back")}
        </button>
      </div>

      {/* ── Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Chap ── */}
          <div>
            <img
              src={displayImage}
              alt={displayTitle}
              className="w-full rounded-2xl object-cover shadow-md transition-all duration-300"
              style={{ maxHeight: 460 }}
            />

            <h1 className="text-gray-900 font-bold text-3xl mt-6 mb-3">{displayTitle}</h1>
            <p className="text-gray-500 text-base leading-relaxed mb-4">{displayDesc}</p>
            <p className="text-[#a80000] font-bold text-2xl mb-6">
              {t("from")} {symbol}{price} / m²
            </p>

            {/* Xususiyatlar */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">{t("product.features")}</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: t("product.material_label"), value: t("product.material") },
                  { label: t("product.install_label"),  value: t("product.install")  },
                  { label: t("product.warranty_label"), value: t("product.warranty") },
                  { label: t("product.delivery_label"), value: t("product.delivery") },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="text-gray-900 text-sm font-medium">{item.value}</span>
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
              <button
                onClick={() => navigate("/measuring", { state: { productTitle: product.title } })}
                className="text-amber-700 font-semibold text-sm hover:text-amber-900 transition-colors duration-200"
              >
                {t("product.measure_btn")}
              </button>
            </div>

            {/* Kenglik */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">{t("product.width")}</label>
              <input type="number" value={width} placeholder="120"
                onChange={(e) => { const v = e.target.value; if (v === "") return setWidth(""); if (Number(v) >= 0) setWidth(String(Math.min(Number(v), 300))); }}
                onFocus={(e) => e.target.select()} min={30} max={300}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition bg-gray-50"
              />
              <p className="text-gray-400 text-xs mt-1">{t("product.min_max")}</p>
            </div>

            {/* Balandlik */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">{t("product.height")}</label>
              <input type="number" value={height} placeholder="150"
                onChange={(e) => { const v = e.target.value; if (v === "") return setHeight(""); if (Number(v) >= 0) setHeight(String(Math.min(Number(v), 300))); }}
                onFocus={(e) => e.target.select()} min={30} max={300}
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

            {/* Rang */}
            {productColors.length > 0 && (
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block">{t("product.color")}</label>
                <div className="flex flex-wrap gap-2">
                  {productColors.map((c, i) => (
                    <button
                      key={c.id || c.code || i}
                      onClick={() => setSelectedColorIndex(i)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                        ${selectedColorIndex === i
                          ? "bg-[#a80000] text-white border-[#a80000] shadow-md"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#a80000]"}`}
                    >
                      {label(c)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Narx */}
            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
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
                <span className="font-medium text-gray-900">{color || "—"}</span>
              </div>

              <div className="border-t border-gray-200 pt-2 mt-1 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">{t("product.total")}:</span>
                  <span className="font-bold text-[#a80000] text-lg">
                    {hasSize ? `${symbol}${totalForeign}` : "—"}
                  </span>
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

        {/* ── Kolleksiyalar ── */}
        {productCollection && (
          <div className="mt-10 border-t border-gray-200 pt-10">
            <h2 className="text-gray-900 font-bold text-2xl mb-1">{t("product.collections")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("product.collections_desc")}</p>

            {/* ── colors_only ── */}
            {productCollection.type === "colors_only" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {productCollection.items.map((item) => (
                  <div key={item.id}
                    onClick={() => navigate("/collection", { state: { product, collection: { ...item, colors: productCollection.items.map(i => ({ id: i.id, code: i.code, name: i.name, nameKey: i.nameKey, image: i.image, price: i.price })) }, selectedColorId: item.id } })}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-[#a80000] transition-all duration-300 cursor-pointer group">
                    {item.image ? (
                      <img src={item.image} alt={label(item)} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-[#a80000] transition-colors">
                        {label(item)}
                      </p>
                      <p className="text-[#a80000] font-bold text-sm mt-1">{item.price} / m²</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── collections ── */}
            {productCollection.type === "collections" && (
              <div className="flex flex-col gap-8">
                {productCollection.items.map((col) => (
                  <div key={col.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        {col.image ? <img src={col.image} alt={col.name} className="w-full h-full object-cover" /> : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 text-lg">{col.name}</h3>
                          {col.badge && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badgeColor === "green" ? "bg-green-100 text-green-700" : "bg-red-100 text-[#a80000]"}`}>
                              {col.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[#a80000] font-bold mt-1">{col.price} / m²</p>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-3 font-medium uppercase tracking-wide">{t("product.colors")}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {col.colors.map((c, ci) => (
                        <div key={c.id || c.code || ci}
                          onClick={() => navigate("/collection", { state: { product, collection: col, selectedColor: c.name, selectedColorId: c.id } })}
                          className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-[#a80000] transition-all duration-300 cursor-pointer group">
                          {c.image ? (
                            <img src={c.image} alt={label(c)} className="w-full h-20 object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 flex items-center justify-center">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                              </svg>
                            </div>
                          )}
                          <div className="p-2">
                            <p className="text-xs font-medium text-gray-700 group-hover:text-[#a80000] transition-colors text-center">
                              {label(c)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}