// Contact.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { sendContactToTelegram } from "../../utils/telegram";

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let valid = true;
    let newErrors = { name: "", email: "" };
    if (!form.name.trim()) {
      newErrors.name = t("contact.err_name");
      valid = false;
    }
    if (!form.email.trim()) {
      newErrors.email = t("contact.err_phone_empty");
      valid = false;
    } else if (!/^\+?[\d\s()-]{7,}$/.test(form.email)) {
      newErrors.email = t("contact.err_phone_invalid");
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await sendContactToTelegram({
        name: form.name,
        email: form.email,
        message: form.message,
      });
      setForm({ name: "", email: "", message: "" });
      setErrors({ name: "", email: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      console.error("Xabar yuborishda xatolik:", e);
    } finally {
      setLoading(false);
    }
  };

  const MAP_SRC =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent("Toshkent, Qushqo'ndi ko'chasi 43") +
    "&z=14&output=embed";

  return (
    <div className="bg-white min-h-screen">

      {/* ───── Banner ───── */}
      <section
        className="relative w-full h-93 flex items-center justify-center overflow-hidden py-14 px-6 md:py-20"
        style={{ background: "linear-gradient(135deg, #7b0000 0%, #a80000 40%, #c0111b 70%, #8b0000 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-in">
          <div className="mb-5 w-12 h-12 flex items-center justify-center rounded-full border-2 border-white/40">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          </div>
          <h2 className="text-white font-bold leading-tight mb-4 text-3xl sm:text-4xl md:text-5xl tracking-tight">
            {t("contact.banner_title")}
          </h2>
          <p className="text-white/80 font-normal leading-relaxed text-base sm:text-lg max-w-xl">
            {t("contact.banner_desc")}
          </p>
        </div>
      </section>

      {/* ───── Contact Section ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Chap: Info kartochkalar ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-bold text-gray-900">{t("contact.address")}</span>
              </div>
              <p className="text-gray-500 text-sm">{t("contact.address_val")}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                <span className="font-bold text-gray-900">{t("contact.phone")}</span>
              </div>
              <p className="text-gray-500 text-sm">+998 90 052-62-66</p>
              <p className="text-gray-500 text-sm">+998 90 052-62-66</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 7l10 7 10-7" />
                </svg>
                <span className="font-bold text-gray-900">{t("contact.email")}</span>
              </div>
              <p className="text-gray-500 text-sm">info@combostar.uz</p>
              <p className="text-gray-500 text-sm">sales@combostar.uz</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="font-bold text-gray-900">{t("contact.hours")}</span>
              </div>
              <p className="text-gray-500 text-sm">{t("contact.hours_val")}</p>
              <p className="text-gray-500 text-sm">{t("contact.closed")}</p>
            </div>
          </div>

          {/* ── O'ng: Forma ── */}
          <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col justify-start">
            <h3 className="text-gray-900 font-bold text-xl mb-6">{t("contact.form_title")}</h3>

            <label className="text-gray-700 text-sm font-medium mb-1">{t("contact.name")}</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange}
              placeholder={t("contact.name_placeholder")}
              className={`mb-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400
                ${errors.name ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-[#a80000]"}`}
            />
            {errors.name
              ? <p className="text-red-500 text-xs mb-3">{errors.name}</p>
              : <div className="mb-3" />}

            <label className="text-gray-700 text-sm font-medium mb-1">{t("contact.phone")}</label>
            <input
              type="tel" name="email" value={form.email} onChange={handleChange}
              placeholder={t("contact.phone_placeholder")}
              className={`mb-1 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400
                ${errors.email ? "ring-2 ring-red-500" : "focus:ring-2 focus:ring-[#a80000]"}`}
            />
            {errors.email
              ? <p className="text-red-500 text-xs mb-3">{errors.email}</p>
              : <div className="mb-3" />}

            <label className="text-gray-700 text-sm font-medium mb-1">
              {t("contact.message")} <span className="text-gray-400 font-normal">{t("contact.optional")}</span>
            </label>
            <textarea
              name="message" value={form.message} onChange={handleChange}
              placeholder={t("contact.message_placeholder")} rows={5}
              className="mb-6 w-full rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none transition resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#a80000]"
            />

            {/* Muvaffaqiyat xabari */}
            {success && (
              <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("contact.success") || "Xabaringiz muvaffaqiyatli yuborildi!"}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#a80000] hover:bg-[#8b0000]"}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.3" />
                    <path d="M21 12a9 9 0 00-9-9" />
                  </svg>
                  {t("contact.sending") || "Yuborilmoqda..."}
                </>
              ) : (
                t("contact.send")
              )}
            </button>
          </div>
        </div>

        {/* ───── Google Maps ───── */}
        <div className="mt-10 rounded-2xl overflow-hidden shadow-md w-full">
          <iframe
            src={MAP_SRC} width="100%" height="400"
            style={{ border: 0 }} allowFullScreen="" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t("contact.banner_title")}
          />
        </div>
      </section>
    </div>
  );
}