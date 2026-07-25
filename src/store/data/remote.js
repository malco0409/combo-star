// src/store/data/remote.js
// Firestore bilan bog'liq YAGONA joy — kesh (cache) + jonli yangilanish (realtime).
// Baza tuzilishi:
//   products/{productId}          -> mahsulot override obyekti {price,name,desc,image,hidden,featured}
//   productCollections/{productId}-> {type, title, items:[...]} (rasmlar dataURL sifatida ichida)
//
// Storefront va CRM shu kesh orqali o'qiydi (sinxron), yozish esa Firestore ga (asinxron) boradi.
// React komponentlari useSyncExternalStore orqali jonli yangilanadi.
import { useSyncExternalStore } from "react";
import { db } from "../../firebase";
import {
  collection, doc, onSnapshot, setDoc, deleteDoc,
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
