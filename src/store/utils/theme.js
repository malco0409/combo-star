// theme.js — storefront qorong'i rejimi (dark mode).
// Tanlov localStorage'da (`storeTheme`), class esa <html> da: `dark-mode`.
// CSS index.css dagi "QORONG'I REJIM" blokida.
//
// Sahifa ochilganda class'ni index.html dagi kichik skript qo'yadi (oq lipillash
// bo'lmasligi uchun) — bu yerdagi kod esa keyingi o'zgarishlarni boshqaradi.

const KEY = "storeTheme";
const CLASS = "dark-mode";

// Qorong'ida brauzer paneli ham qora bo'lsin
const THEME_COLOR = { dark: "#0d0d10", light: "#ffffff" };

export function getStoredTheme() {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

// Saqlangan tanlov bo'lmasa — yorug' rejim (standart).
// Tizim sozlamasiga ergashish kerak bo'lsa, shu yerda
// window.matchMedia("(prefers-color-scheme: dark)") ni qaytarish kifoya.
export function getTheme() {
  return getStoredTheme() || "light";
}

export function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle(CLASS, dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[dark ? "dark" : "light"]);
}

export function setTheme(theme) {
  try { localStorage.setItem(KEY, theme); } catch { /* private rejimda ishlamasligi mumkin */ }
  applyTheme(theme);
}

// CRM ga o'tilganda saytning qora mavzusi olib tashlanadi (CRM o'zinikini ishlatadi).
export function clearTheme() {
  document.documentElement.classList.remove(CLASS);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR.light);
}
