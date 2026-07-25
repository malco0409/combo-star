// src/store/data/productStore.js
// Storefront mahsulotlari uchun YAGONA manba.
// Standart qiymatlar shu yerda, admin o'zgartirishlari Firestore (products/{id}) da saqlanadi.
// O'qish keshdan (sinxron), yozish Firestore ga (asinxron). Jonli yangilanish — useSyncExternalStore.
import { useSyncExternalStore } from "react";
import plisseImg   from "../assets/plisse.JPG";
import kunTunImg   from "../assets/combo.jpg";
import vertikalImg from "../assets/vertikal.jpg";
import DikkeyIMG   from "../assets/Dikkey.jpg";
import RolloImg    from "../assets/rollo.jpg";
import DablImg     from "../assets/Dabl.jpg";
import MasketImg   from "../assets/Setka.jpg";
import SenaksImg   from "../assets/Senaks.webp";
import SuriladImg  from "../assets/Razdvejnnoy.jpg";
import {
  subscribe, getVersion, getProductOverrides,
  writeProductOverride, deleteProductOverride,
} from "./remote";

// Standart mahsulotlar — id lar ProductDetail va collectionStore bilan mos.
export const DEFAULT_PRODUCTS = [
  { id: "plisse",    image: plisseImg,   titleKey: "products.plisse_title",    descKey: "products.plisse_desc",    price: "$16", featured: false },
  { id: "kuntun",    image: kunTunImg,   titleKey: "products.kuntun_title",    descKey: "products.kuntun_desc",    price: "$11", featured: false },
  { id: "vertikal",  image: vertikalImg, titleKey: "products.vertikal_title",  descKey: "products.vertikal_desc",  price: "$8",  featured: false },
  { id: "dikkey",    image: DikkeyIMG,   titleKey: "products.dikkey_title",    descKey: "products.dikkey_desc",    price: "$25", featured: true  },
  { id: "rollo",     image: RolloImg,    titleKey: "products.rollo_title",     descKey: "products.rollo_desc",     price: "$25", featured: true  },
  { id: "dablrollo", image: DablImg,     titleKey: "products.dablrollo_title", descKey: "products.dablrollo_desc", price: "$30", featured: true  },
  { id: "masket",    image: MasketImg,   titleKey: "products.masket_title",    descKey: "products.masket_desc",    price: "$13", featured: false },
  { id: "senaks",    image: SenaksImg,   titleKey: "products.senaks_title",    descKey: "products.senaks_desc",    price: "$21", featured: false },
  { id: "surilad",   image: SuriladImg,  titleKey: "products.surilad_title",   descKey: "products.surilad_desc",   price: "$45", featured: false },
];

// Bo'sh bo'lmagan override qiymatlari standart ustidan ustun.
function merge(base, ov = {}) {
  const out = { ...base };
  if (ov.price != null && ov.price !== "") out.price = ov.price;
  if (ov.image) out.image = ov.image;
  if (ov.name != null && ov.name !== "") out.name = ov.name;
  if (ov.desc != null && ov.desc !== "") out.desc = ov.desc;
  if (ov.hidden != null) out.hidden = ov.hidden;
  if (ov.featured != null) out.featured = ov.featured;
  out.hidden = out.hidden ?? false;
  out._override = ov;
  return out;
}

// ── Sinxron o'qish (keshdan) ──
export function getProducts() {
  const ov = getProductOverrides();
  return DEFAULT_PRODUCTS.map((p) => merge(p, ov[p.id]));
}
export function getVisibleProducts() {
  return getProducts().filter((p) => !p.hidden);
}
export function getProduct(id) {
  return getProducts().find((p) => p.id === id) || null;
}

// ── Asinxron yozish (Firestore ga) ──
export async function saveProduct(id, patch) {
  const ov = getProductOverrides();
  const current = ov[id] || {};
  await writeProductOverride(id, { ...current, ...patch });
}
export async function resetProduct(id) {
  await deleteProductOverride(id);
}

// ── React hook lari (jonli yangilanish) ──
export function useProducts() {
  useSyncExternalStore(subscribe, getVersion);
  return getProducts();
}
export function useVisibleProducts() {
  useSyncExternalStore(subscribe, getVersion);
  return getVisibleProducts();
}
