import React from 'react'
import { IoIosStarHalf } from "react-icons/io";
import { MdOutlineStarPurple500, MdFileDownload, MdClose } from "react-icons/md";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cart from "./Cart";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { t, i18n } = useTranslation();
  const activeLang = (i18n.language || "uz").toUpperCase();

  // Saqlangan tilni tiklash
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Android/Chrome uchun install promptni ushlab qolish
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const changeLang = (lang) => {
    const code = lang.toLowerCase();
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
  };

  const handleInstallClick = async () => {
    const isInStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isInStandaloneMode) return; // allaqachon o'rnatilgan

    if (deferredPrompt) {
      // Android/Chrome - haqiqiy o'rnatish oynasi
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      // iPhone yoki boshqa holatlar - ko'rsatma modali
      setShowInstallModal(true);
    }
  };

  const links = [
    { to: "/",        label: t("nav.home") },
    { to: "/catalog", label: t("nav.products") },
    { to: "/about",   label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const langs = ["UZ", "RU"];

  return (
    <div className='relative'>
      <div className='fixed top-0 right-0 left-0 z-[99999] flex justify-between px-30 max-md:px-4 h-[80px] items-center bg-white shadow-[0_4px_24px_0_rgba(0,0,0,0.10)] border-b border-gray-100'>

        {/* Logo */}
        <NavLink to="/" className='flex items-center font-bold text-2xl max-sm:text-lg cursor-pointer'>
          <div className='w-10 h-10 max-sm:w-8 max-sm:h-8 bg-red-800 mr-3 rounded-xl shadow-md'>
            <MdOutlineStarPurple500 className='flex items-center m-auto mt-2 max-sm:mt-1.5 text-white' />
          </div>
          Combo St<IoIosStarHalf className='text-red-800' />r
        </NavLink>

        {/* Nav links - desktop */}
        <ul className='flex gap-1 max-md:hidden bg-gray-100 rounded-2xl p-1'>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium cursor-pointer
                 transition-all duration-300 ease-in-out
                 ${isActive
                   ? "bg-red-800 text-white shadow-md scale-[1.04]"
                   : "text-gray-600 hover:bg-white hover:text-red-800 hover:shadow-sm hover:scale-[1.04]"
                 }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </ul>

        <div className='flex gap-3 items-center'>

          {/* Lang - desktop */}
          <div className='flex font-semibold text-sm text-gray-600 gap-1 max-md:hidden bg-gray-100 rounded-2xl p-1'>
            {langs.map((lang) => (
              <button
                key={lang}
                onClick={() => changeLang(lang)}
                className={`px-3 py-1.5 rounded-xl cursor-pointer
                            transition-all duration-300 ease-in-out
                            ${activeLang === lang
                              ? "bg-red-800 text-white shadow-md scale-[1.08]"
                              : "text-gray-600 hover:bg-white hover:text-red-800 hover:shadow-sm hover:scale-[1.08]"
                            }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Install button */}
          <button
            onClick={handleInstallClick}
            title={t("install.tooltip")}
            className='flex items-center justify-center w-10 h-10 max-sm:w-9 max-sm:h-9
                       rounded-xl bg-gray-100 text-red-800 cursor-pointer
                       hover:bg-red-800 hover:text-white transition-all duration-300 ease-in-out'
          >
            <MdFileDownload className='text-xl' />
          </button>

          {/* Cart */}
          <Cart />

          {/* Hamburger - mobile */}
          <button
            className='hidden max-md:flex flex-col gap-[5px] cursor-pointer p-2
                       rounded-xl hover:bg-gray-100 transition-colors duration-200'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-[2px] bg-red-800 rounded
                              transition-all duration-300 ease-in-out
                              ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-red-800 rounded
                              transition-all duration-300 ease-in-out
                              ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
            <span className={`block w-6 h-[2px] bg-red-800 rounded
                              transition-all duration-300 ease-in-out
                              ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-[80px] left-0 right-0 bg-white z-[99998] flex flex-col
                    items-center px-6 py-6 gap-5
                    shadow-[0_8px_24px_0_rgba(0,0,0,0.10)]
                    border-t border-gray-100 md:hidden
                    transition-all duration-300 ease-in-out origin-top
                    ${menuOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
      >
        {/* Mobile links */}
        <ul className='flex flex-col w-full bg-gray-100 rounded-2xl p-1 gap-1'>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `w-full text-center py-2.5 rounded-xl text-sm font-medium
                 transition-all duration-300 ease-in-out cursor-pointer
                 ${isActive
                   ? "bg-red-800 text-white shadow-md"
                   : "text-gray-600 hover:bg-white hover:text-red-800 hover:shadow-sm"
                 }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </ul>

        <div className='w-full h-[1px] bg-gray-100' />

        {/* Mobile lang */}
        <div className='flex font-semibold text-sm text-gray-600 gap-1 bg-gray-100 rounded-2xl p-1'>
          {langs.map((lang) => (
            <button
              key={lang}
              onClick={() => changeLang(lang)}
              className={`px-4 py-1.5 rounded-xl cursor-pointer
                          transition-all duration-300 ease-in-out
                          ${activeLang === lang
                            ? "bg-red-800 text-white shadow-md scale-[1.08]"
                            : "text-gray-600 hover:bg-white hover:text-red-800 hover:shadow-sm hover:scale-[1.08]"
                          }`}
            >
              {lang}
            </button>
          ))}
        </div>

      </div>

      {/* Install instructions modal (iPhone va boshqalar uchun) */}
      {showInstallModal && (
        <div
          className='fixed inset-0 z-[999999] flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0'
          onClick={() => setShowInstallModal(false)}
        >
          <div
            className='bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInstallModal(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-red-800 cursor-pointer'
            >
              <MdClose className='text-xl' />
            </button>

            <div className='flex items-center gap-3 mb-4'>
              <img src="/pwa-192x192.png" alt="Combo Star" className='w-10 h-10 rounded-xl' />
              <h3 className='font-bold text-lg text-gray-800'>{t("install.modal_title")}</h3>
            </div>

            <div className='flex flex-col gap-3 text-sm text-gray-600'>
              <div className='flex gap-3 items-start'>
                <span className='flex items-center justify-center w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex-shrink-0'>1</span>
                <p>{t("install.step1")}</p>
              </div>
              <div className='flex gap-3 items-start'>
                <span className='flex items-center justify-center w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex-shrink-0'>2</span>
                <p>{t("install.step2")}</p>
              </div>
              <div className='flex gap-3 items-start'>
                <span className='flex items-center justify-center w-6 h-6 rounded-full bg-red-800 text-white text-xs font-bold flex-shrink-0'>3</span>
                <p>{t("install.step3")}</p>
              </div>
            </div>

            <p className='mt-4 text-xs text-gray-400'>{t("install.note")}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar