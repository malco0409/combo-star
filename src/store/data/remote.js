// src/store/data/remote.js
// Firestore bilan bog'liq YAGONA joy — kesh (cache) + jonli yangilanish (realtime).
// Baza tuzilishi:
//   products/{productId}          -> mahsulot override obyekti {price,name,desc,image,hidden,featured}
//   productCollections/{productId}-> {type, title, items:[...]} (rasmlar dataURL sifatida ichida)
//
// Storefront va CRM shu kesh orqali o'qiydi (sinxron), yozish esa Firestore ga (asinxron) boradi.
// React komponentlari useSyncExternalStore orqali jonli yangilanadi.
import { useSyncExternalStore, useState, useEffect } from "react";
import { db } from "../../firebase";
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, getDoc,
} from "firebase/firestore";

const COL_PRODUCTS = "products";
const COL_COLLECTIONS = "productCollections";
const SETTINGS_DOC = ["settings", "site"];   // sayt sozlamalari (bitta hujjat)

// Kesh
let productOverrides = {};   // { [id]: override }
let collectionsData = {};    // { [id]: {type,title,items} }
let siteSettings = {};       // { measuringVideo, ... }
let productsReady = false;
let collectionsReady = false;

// Obuna (useSyncExternalStore uchun)
let version = 0;
const listeners = new Set();

function emit() {
  version++;
  listeners.forEach((l) => l());
}

let started = false;
export function initRemote() {
  if (started) return;
  started = true;

  onSnapshot(collection(db, COL_PRODUCTS), (snap) => {
    const next = {};
    snap.forEach((d) => { next[d.id] = d.data(); });
    productOverrides = next;
    productsReady = true;
    emit();
  }, (err) => { console.error("products onSnapshot:", err); productsReady = true; emit(); });

  onSnapshot(collection(db, COL_COLLECTIONS), (snap) => {
    const next = {};
    snap.forEach((d) => { next[d.id] = d.data(); });
    collectionsData = next;
    collectionsReady = true;
    emit();
  }, (err) => { console.error("collections onSnapshot:", err); collectionsReady = true; emit(); });

  onSnapshot(doc(db, ...SETTINGS_DOC), (d) => {
    siteSettings = d.exists() ? d.data() : {};
    emit();
  }, (err) => { console.error("settings onSnapshot:", err); });
}

// ── useSyncExternalStore yordamchilari ──
export function subscribe(listener) {
  initRemote();
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getVersion() {
  return version;
}

export function isReady() {
  return productsReady && collectionsReady;
}

// Firestore ma'lumoti yuklanib bo'lganini kuzatuvchi hook.
export function useRemoteReady() {
  useSyncExternalStore(subscribe, getVersion);
  return isReady();
}

// ── Sinxron o'qish (keshdan) ──
export function getProductOverrides() {
  return productOverrides;
}
export function getCollectionData(id) {
  return collectionsData[id] || null;
}

// ── Rasmlar (har biri alohida hujjatда — 1MB chekloviga tushmasligi uchun) ──
// images/{id} = { data: "<dataURL>" }. Boshqa hujjatlar faqat "img:<id>" havolasini saqlaydi.
const IMAGES = "images";
const imageCache = new Map();   // id -> dataURL (qayta yuklamaslik uchun)

function imgId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Rasmni (dataURL) alohida hujjatga saqlaydi, "img:<id>" havolasini qaytaradi.
export async function saveImageData(dataURL) {
  const id = imgId();
  await setDoc(doc(db, IMAGES, id), { data: dataURL });
  imageCache.set(id, dataURL);
  return `img:${id}`;
}

// Havolani haqiqiy rasmga aylantiradi. "img:" bo'lmasa (eski dataURL yoki oddiy URL) — o'zini qaytaradi.
export async function resolveImage(ref) {
  if (!ref || typeof ref !== "string") return "";
  if (!ref.startsWith("img:")) return ref;
  const id = ref.slice(4);
  if (imageCache.has(id)) return imageCache.get(id);
  try {
    const snap = await getDoc(doc(db, IMAGES, id));
    const data = snap.exists() ? (snap.data().data || "") : "";
    imageCache.set(id, data);
    return data;
  } catch {
    return "";
  }
}

// Keshda turgan rasmni sinxron olish (qayta yuklamasdan darhol ko'rsatish uchun).
function cachedImage(ref) {
  if (!ref || !ref.startsWith("img:")) return ref || "";
  return imageCache.get(ref.slice(4)) || "";
}

// Rasm havolasini komponentda ishlatish uchun hook (yuklangach rasmni qaytaradi).
export function useResolvedImage(ref) {
  const key = ref ? String(ref) : "";
  const isRef = key.startsWith("img:");
  const [resolved, setResolved] = useState({ key: "", url: "" });

  useEffect(() => {
    if (!isRef) return;
    let alive = true;
    resolveImage(key).then((u) => { if (alive) setResolved({ key, url: u }); });
    return () => { alive = false; };
  }, [key, isRef]);

  if (!isRef) return key;                                 // oddiy URL / dataURL
  if (resolved.key === key) return resolved.url;          // yuklangan
  return cachedImage(key);                                // keshda bo'lsa darhol, bo'lmasa ""
}

// Bir nechta rasm havolasini birdaniga yechadigan hook (galereyalar uchun).
export function useResolvedImages(refs) {
  const key = Array.isArray(refs) ? refs.join("|") : "";
  const [resolved, setResolved] = useState({ key: "", urls: [] });

  useEffect(() => {
    if (!key) return;
    let alive = true;
    Promise.all(key.split("|").map(resolveImage))
      .then((urls) => { if (alive) setResolved({ key, urls }); });
    return () => { alive = false; };
  }, [key]);

  if (!key) return [];
  if (resolved.key === key) return resolved.urls;
  // Hali yechilmagan: oddiy URL va keshdagi rasmlar darhol, qolgani yuklangach almashadi
  return key.split("|").map(cachedImage);
}

// ── Sozlamalar (settings) ──
export function getSiteSettings() {
  return siteSettings;
}
export async function writeSetting(key, value) {
  await setDoc(doc(db, ...SETTINGS_DOC), { [key]: value }, { merge: true });
}

// ── Asinxron yozish (Firestore ga) ──
export async function writeProductOverride(id, override) {
  await setDoc(doc(db, COL_PRODUCTS, id), override);
}
export async function deleteProductOverride(id) {
  await deleteDoc(doc(db, COL_PRODUCTS, id));
}
export async function writeCollectionDoc(id, col) {
  await setDoc(doc(db, COL_COLLECTIONS, id), col);
}
export async function deleteCollectionDoc(id) {
  await deleteDoc(doc(db, COL_COLLECTIONS, id));
}
