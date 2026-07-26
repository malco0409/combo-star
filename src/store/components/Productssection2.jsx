import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useVisibleProducts } from "../data/productStore";
import { useResolvedImage } from "../data/remote";

function ProductCard({ img, name, desc, titleKey, descKey, price, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 150);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [index]);

  const title = name || t(titleKey);
  const description = desc || t(descKey);
  const resolvedImg = useResolvedImage(img);

  const handleNavigate = () => {
    navigate("/product", {
      state: {
        image: img,
        title,
        description,
        titleKey,
        descKey,
        price,
      },
    });
  };

  return (
    <div
      ref={ref}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-2xl hover:-translate-y-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.65s ${index * 0.15}s ease,
                     transform 0.65s ${index * 0.15}s ease,
                     box-shadow 0.3s ease`,
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <div className="overflow-hidden h-60">
        <img
          src={resolvedImg}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3
          className="font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem" }}
        >
          {title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
          {description}
        </p>

        <div
          className="text-[#780202] font-bold text-2xl mb-4"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {t("products.from")} {price}<sup className="text-sm">{t("products.per_m2")}</sup>
        </div>

        <button
          onClick={handleNavigate}
          className="w-full bg-[#780202] hover:bg-[#8b0000] active:scale-95 text-white font-bold text-sm py-3 rounded-lg transition-all duration-200 tracking-wide cursor-pointer"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {t("products.customize_btn")}
        </button>
      </div>
    </div>
  );
}

export default function ProductsSection2() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Bosh sahifadagi tanlangan kartalar — CRM da "featured" belgilangan mahsulotlar.
  const products = useVisibleProducts().filter((p) => p.featured);

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Sarlavha */}
        <div className="text-center mb-10">
          <h2
            className="text-gray-900 font-bold text-3xl sm:text-4xl mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t("products.section_title")}
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("products.section_desc")}
          </p>
          <div className="flex justify-center mt-5">
            <div className="rounded-full" style={{ width: 48, height: 3, background: "linear-gradient(90deg,#b03030,#e57373)", opacity: 0.4 }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              img={p.image}
              name={p.name}
              desc={p.desc}
              titleKey={p.titleKey}
              descKey={p.descKey}
              price={p.price}
              index={i}
            />
          ))}
        </div>

        {/* Barcha mahsulotlar */}
        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/catalog")}
            className="group flex items-center gap-2 border-2 border-[#780202] text-[#780202]
                       font-bold text-sm px-8 py-3 rounded-lg transition-all duration-200
                       hover:bg-[#780202] hover:text-white active:scale-95 cursor-pointer"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            {t("products.view_all")}
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}