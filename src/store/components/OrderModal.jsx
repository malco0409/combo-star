// src/components/OrderModal.jsx — Buyurtma formasi
import { useState } from "react";
import Modal from "./Modal";

export default function OrderModal({ isOpen, onClose, product }) {
  const [form, setForm] = useState({ name: "", phone: "", width: "", height: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    console.log("Buyurtma:", { product, ...form });
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", phone: "", width: "", height: "" });
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buyurtma berish">
      {sent ? (
        <div className="flex flex-col items-center py-8 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24"
              fill="none" stroke="#16a34a" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold text-lg">Buyurtma qabul qilindi!</p>
          <p className="text-gray-500 text-sm">Tez orada siz bilan bog'lanamiz</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* Mahsulot */}
          {product && (
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{product.title}</p>
                <p className="text-[#a80000] font-bold">{product.price} / m²</p>
              </div>
            </div>
          )}

          {/* Ism */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1 block">Ismingiz *</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="Ismingizni kiriting"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm
                         text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition
                         placeholder:text-gray-400"
            />
          </div>

          {/* Telefon */}
          <div>
            <label className="text-gray-700 text-sm font-medium mb-1 block">Telefon *</label>
            <input
              type="tel" name="phone" value={form.phone}
              onChange={handleChange} placeholder="+998 90 123-45-67"
              className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm
                         text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition
                         placeholder:text-gray-400"
            />
          </div>

          {/* O'lchamlar */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">Kenglik (sm)</label>
              <input
                type="number" name="width" value={form.width}
                onChange={handleChange} placeholder="120"
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm
                           text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition
                           placeholder:text-gray-400"
              />
            </div>
            <div>
              <label className="text-gray-700 text-sm font-medium mb-1 block">Balandlik (sm)</label>
              <input
                type="number" name="height" value={form.height}
                onChange={handleChange} placeholder="150"
                className="w-full rounded-xl bg-gray-100 px-4 py-3 text-sm
                           text-gray-700 outline-none focus:ring-2 focus:ring-[#a80000] transition
                           placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-2 w-full bg-[#a80000] hover:bg-[#8b0000] text-white
                       font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
          >
            Buyurtma berish
          </button>
        </div>
      )}
    </Modal>
  );
}