// src/store/data/settingsStore.js
// Sayt sozlamalari (masalan "qanday o'lchash" video havolasi) — Firestore da settings/site.
import { useSyncExternalStore } from "react";
import { subscribe, getVersion, getSiteSettings, writeSetting } from "./remote";

export function getSetting(key) {
  return getSiteSettings()[key] || "";
}

export function useSetting(key) {
  useSyncExternalStore(subscribe, getVersion);
  return getSiteSettings()[key] || "";
}

export async function saveSetting(key, value) {
  await writeSetting(key, value);
}

// Video havolasini <iframe>/<video> uchun tayyorlaydi.
// YouTube, Vimeo va to'g'ridan-to'g'ri (.mp4) havolalar qo'llab-quvvatlanadi.
export function parseVideo(url) {
  if (!url) return null;
  const u = url.trim();

  // YouTube
  const yt = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { type: "embed", src: `https://www.youtube.com/embed/${yt[1]}` };

  // Vimeo
  const vm = u.match(/vimeo\.com\/(\d+)/);
  if (vm) return { type: "embed", src: `https://player.vimeo.com/video/${vm[1]}` };

  // To'g'ridan-to'g'ri video fayl
  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(u)) return { type: "file", src: u };

  // Boshqa havolalar — iframe sifatida sinab ko'ramiz
  return { type: "embed", src: u };
}
