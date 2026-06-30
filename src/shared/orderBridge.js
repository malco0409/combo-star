// src/shared/orderBridge.js
// Storefront buyurtmasini CRM "crm_orders" formatiga o'tkazib saqlaydi.
// Shunda saytdan kelgan zakaz Admin > Buyurtmalar sahifasida ko'rinadi.
import { getOrders, saveOrders } from "../admin/data/store";

function uzsToNumber(totalUZS) {
  if (!totalUZS) return 0;
  return parseInt(String(totalUZS).replace(/\D/g, ""), 10) || 0;
}

export function pushOrdersToCrm(orderId, items, customer = {}) {
  const date = new Date().toISOString().slice(0, 10);
  const multi = items.length > 1;

  const crmOrders = items.map((it, idx) => ({
    id: `WEB-${orderId}${multi ? "-" + (idx + 1) : ""}`,
    client: customer.name || "Sayt mijozi",
    phone: customer.phone || "",
    address: "",
    product: it.product?.title || "",
    type: it.product?.title || "",
    colId: "",
    color: it.color || "",
    width: Number(it.width) || 0,
    height: Number(it.height) || 0,
    qty: Number(it.qty) || 1,
    price: uzsToNumber(it.totalUZS),
    status: "Yangi",
    pay: "Kutilmoqda",
    note: `🌐 Saytdan • ${it.area} m² • ${it.symbol}${it.totalForeign}`,
    date,
    source: "web",
  }));

  saveOrders([...crmOrders, ...getOrders()]);
}
