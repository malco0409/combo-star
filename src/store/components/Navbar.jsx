import React from 'react'
import { IoIosStarHalf } from "react-icons/io";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Cart from "./Cart";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const activeLang = (i18n.language || "uz").toUpperCase();

  // Saqlangan tilni tiklash
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLang = (lang) => {
    const code = lang.toLowerCase();
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
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
    </div>
  )
}

export default Navbar