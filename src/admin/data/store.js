// src/data/store.js
// Barcha ma'lumotlar shu yerda saqlanadi — localStorage orqali
// Keyinroq backend (API) ga ulash uchun faqat shu faylni o'zgartirish kifoya

const KEYS = {
  COLS: "crm_collections",
  ORDERS: "crm_orders",
  CLIENTS: "crm_clients",
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

const DEFAULT_COLS = [
  {
    id: "c1",
    name: "0-koleksiaHD-33",
    flag: "🇨🇳",
    type: "RULON",
    len: 300,
    stock: true,
    dims: [
      { w: 164, h: 294, qty: 1 }, { w: 124, h: 55, qty: 1 },
      { w: 163, h: 334, qty: 1 }, { w: 108, h: 870, qty: 1 },
      { w: 157, h: 295, qty: 1 },
      { w: 136, h: 156, qty: 1 }, { w: 128, h: 568, qty: 1 },
      { w: 116, h: 460, qty: 1 }, { w: 114, h: 117, qty: 1 },
      { w: 114, h: 304, qty: 1 },
      { w: 114, h: 576, qty: 1 }, { w: 107, h: 434, qty: 1 },
      { w: 105, h: 785, qty: 1 },
    ],
  },
  {
    id: "c2",
    name: "Combo A2-04",
    flag: "🇺🇿",
    type: "GORIZONT",
    len: 0,
    stock: true,
    dims: [
      { w: 120, h: 160, qty: 2 }, { w: 135, h: 180, qty: 1 },
      { w: 150, h: 200, qty: 3 }, { w: 160, h: 210, qty: 2 },
      { w: 170, h: 230, qty: 1 }, { w: 180, h: 240, qty: 4 },
      { w: 200, h: 250, qty: 2 }, { w: 210, h: 260, qty: 1 },
      { w: 120, h: 220, qty: 2 }, { w: 145, h: 195, qty: 3 },
      { w: 165, h: 215, qty: 1 }, { w: 190, h: 245, qty: 2 },
    ],
  },
];

const DEFAULT_ORDERS = [
  {
    id: "B001", client: "Aziz Karimov", phone: "+998901234567",
    address: "Toshkent, Chilonzor", type: "Gorizontal jalyuzi",
    colId: "c2", width: 180, height: 220, color: "Oq", qty: 3,
    price: 850000, status: "Jarayonda", pay: "Qisman",
    note: "Eshik tomonga", date: "2026-06-10",
  },
  {
    id: "B002", client: "Malika Yusupova", phone: "+998931112233",
    address: "Samarqand sh.", type: "Rulon parda",
    colId: "c1", width: 114, height: 304, color: "Kulrang", qty: 2,
    price: 1200000, status: "Tayyor", pay: "To'langan",
    note: "", date: "2026-06-12",
  },
  {
    id: "B003", client: "Jahon Toshmatov", phone: "+998941002030",
    address: "Namangan", type: "Rulon parda",
    colId: "c1", width: 105, height: 785, color: "Bej", qty: 5,
    price: 620000, status: "Yangi", pay: "Kutilmoqda",
    note: "Ombor joy", date: "2026-06-14",
  },
];

const DEFAULT_CLIENTS = [
  { id: "M001", name: "Aziz Karimov", phone: "+998901234567", address: "Toshkent, Chilonzor", note: "VIP mijoz", date: "2026-05-20" },
  { id: "M002", name: "Malika Yusupova", phone: "+998931112233", address: "Samarqand sh.", note: "", date: "2026-06-01" },
  { id: "M003", name: "Jahon Toshmatov", phone: "+998941002030", address: "Namangan", note: "", date: "2026-06-13" },
];

export function getCollections() {
  return load(KEYS.COLS, DEFAULT_COLS);
}
export function saveCollections(data) {
  save(KEYS.COLS, data);
}

export function getOrders() {
  return load(KEYS.ORDERS, DEFAULT_ORDERS);
}
export function saveOrders(data) {
  save(KEYS.ORDERS, data);
}

export function getClients() {
  return load(KEYS.CLIENTS, DEFAULT_CLIENTS);
}
export function saveClients(data) {
  save(KEYS.CLIENTS, data);
}

export function genId(prefix) {
  return `${prefix}-${Date.now()}`;
}