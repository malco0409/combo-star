// src/components/Modal.jsx
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  // ESC tugmasi bilan yopish
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  // Scroll bloklash
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal box */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg
                   max-h-[90vh] overflow-y-auto z-10
                   animate-[modalIn_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-gray-900 font-bold text-xl">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200
                       flex items-center justify-center transition-colors duration-200"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}