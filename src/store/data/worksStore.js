// src/store/data/worksStore.js
// "Biz haqimizda" sahifasidagi "Bajarilgan ishlar" galereyasi.
// Ro'yxat Firestore da: settings/site → { works: [...] }. Rasmlar esa images/{id}
// hujjatlarida ("img:<id>" havolasi bilan), shuning uchun ro'yxat hujjati kichik qoladi.
// Admin hech narsa kiritmagan bo'lsa — quyidagi standart (namuna) loyihalar ko'rinadi.
import { useSetting, saveSetting } from "./settingsStore";

// Bitta ish (loyiha) uchun rasm chegarasi — texnik emas, sahifa tez ochilishi uchun.
export const MAX_IMAGES_PER_WORK = 30;
// Kartochkalar (ishlar) soni chegarasi.
export const MAX_WORKS = 24;

// Standart namunalar (i18n kalitlari bilan — tilga qarab tarjima qilinadi)
const DEFAULT_WORKS = [1, 2, 3, 4, 5, 6].map((id) => ({
  id: String(id),
  titleKey: `about.projects.${id}.title`,
  descKey: `about.projects.${id}.description`,
  images: DEFAULT_GALLERIES(id),
}));

function DEFAULT_GALLERIES(id) {
  const g = {
    1: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=800&q=80",
      "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?w=800&q=80",
    ],
    2: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    ],
    3: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=800&q=80",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800&q=80",
    ],
    4: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
      "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=800&q=80",
    ],
    5: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    6: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=800&q=80",
      "https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    ],
  };
  return g[id] || [];
}

export function defaultWorks() {
  return DEFAULT_WORKS;
}

function normalize(list) {
  if (!Array.isArray(list)) return null;
  return list.map((w) => ({ ...w, images: Array.isArray(w.images) ? w.images : [] }));
}

// ── Saytda ko'rsatiladigan ro'yxat (admin kiritmagan bo'lsa — standart) ──
export function useWorks() {
  const saved = normalize(useSetting("works"));
  return saved && saved.length ? saved : DEFAULT_WORKS;
}

// ── Admin uchun: faqat saqlangan ro'yxat (standart aralashmaydi) ──
export function useSavedWorks() {
  return normalize(useSetting("works")) || [];
}

export async function saveWorks(list) {
  await saveSetting("works", list);
}

export function newWork() {
  return {
    id: `w-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    titleRu: "",
    desc: "",
    descRu: "",
    images: [],
  };
}

// Tilga qarab sarlavha/tavsif. titleKey — standart namunalar uchun (i18n).
export function workTitle(w, t, lang) {
  if (!w) return "";
  if (w.titleKey && t) return t(w.titleKey);
  return (lang === "ru" && w.titleRu) || w.title || "";
}

export function workDesc(w, t, lang) {
  if (!w) return "";
  if (w.descKey && t) return t(w.descKey);
  return (lang === "ru" && w.descRu) || w.desc || "";
}
