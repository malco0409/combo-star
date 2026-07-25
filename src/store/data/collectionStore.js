// src/store/data/collectionStore.js
// Kolleksiya va ranglar (kod + nom + rasm) uchun YAGONA manba.
// Standart qiymatlar collections.js dan, o'zgartirishlar Firestore (productCollections/{id}) da.
// O'qish keshdan (sinxron), yozish Firestore ga (asinxron). Jonli — useSyncExternalStore.
import { useSyncExternalStore } from "react";
import { collections as STATIC_COLLECTIONS } from "./collections";
import {
  subscribe, getVersion, getCollectionData,
  writeCollectionDoc, deleteCollectionDoc,
} from "./remote";

// productStore id → collections.js dagi kolleksiya kaliti.
export const PRODUCT_COLLECTION_KEY = {
  plisse:    "Plisse jaluziyalar",
  kuntun:    "Kun va Tun jaluziyalari",
  vertikal:  "Vertikal jaluziyalar",
  dikkey:    "Dikkey jaluziyalar",
  rollo:     "Rollo jaluziyalari",
  dablrollo: "Dabl Rollo jaluziyalar",
  masket:    "Masketniy setka",
  senaks:    "Senaks",
  surilad:   "Suriladigan setka",
};

function rid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

// collections.js dagi statik ma'lumotdan tahrirlanadigan tuzilma quramiz (har rangga "code" qo'shiladi).
function buildDefault() {
  const out = {};
  for (const [pid, title] of Object.entries(PRODUCT_COLLECTION_KEY)) {
    const col = STATIC_COLLECTIONS[title];
    if (!col) continue;

    if (col.type === "collections") {
      out[pid] = {
        type: "collections",
        title,
        items: col.items.map((it) => ({
          id: it.id,
          name: it.name || "",
          price: it.price || "",
          image: it.image || "",
          badge: it.badge || "",
          badgeColor: it.badgeColor || "",
          colors: (it.colors || []).map((c, i) => ({
            id: `${it.id}-c${i}`,
            code: "",
            name: c.name || "",
            nameKey: c.nameKey || "",
            image: c.image || "",
          })),
        })),
      };
    } else {
      out[pid] = {
        type: "colors_only",
        title,
        items: col.items.map((it) => ({
          id: it.id,
          code: "",
          name: it.name || "",
          nameKey: it.nameKey || "",
          image: it.image || "",
          price: it.price || "",
        })),
      };
    }
  }
  return out;
}

let _defaults = null;
function defaults() {
  if (!_defaults) _defaults = buildDefault();
  return _defaults;
}

// ── Sinxron o'qish (Firestore keshi, bo'lmasa standart) ──
export function getCollection(productId) {
  return getCollectionData(productId) || defaults()[productId] || null;
}

// ── Asinxron yozish ──
export async function saveCollection(productId, col) {
  await writeCollectionDoc(productId, col);
}
export async function resetCollection(productId) {
  // Firestore hujjatini o'chiramiz — getCollection standartga qaytadi.
  await deleteCollectionDoc(productId);
}

// ── React hook ──
export function useCollection(productId) {
  useSyncExternalStore(subscribe, getVersion);
  return getCollection(productId);
}

// ── Yangi bo'sh element/ranglar ──
export function newItem() {
  return { id: rid("item"), name: "", price: "", image: "", badge: "", badgeColor: "", colors: [] };
}
export function newColor() {
  return { id: rid("clr"), code: "", name: "", nameKey: "", image: "" };
}
export function newColorOnly() {
  return { id: rid("clr"), code: "", name: "", nameKey: "", image: "", price: "" };
}

// Rangni matn sifatida: "13 · mokriy asfalt" yoki shunchaki nom. t — ixtiyoriy tarjima funksiyasi.
export function colorLabel(c, t) {
  if (!c) return "";
  const nm = c.name || (c.nameKey && t ? t(c.nameKey) : "");
  return c.code ? `${c.code} · ${nm}`.trim() : nm;
}
