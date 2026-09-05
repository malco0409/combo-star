// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { pollTelegramUpdates } from "../utils/telegramPolling";
import { pushOrdersToCrm } from "../../shared/orderBridge";

const CartContext = createContext();

// Oxirgi status — bunga yetgan buyurtmani kuzatishning hojati yo'q
// (telegramPolling.js dagi "finish"/"ready" bilan bir xil bo'lishi shart).
const DONE_STATUS = "Zakaz tayyor! 🎉";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("orders");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // cartId noyob bo'lishi shart — bir soniyada ikkita qo'shilsa Date.now() takrorlanadi
  // va o'chirishda ikkalasi birdan o'chib ketardi.
  const addToCart = (item) => {
    const cartId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setCart((prev) => [...prev, { ...item, cartId }]);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQty = (cartId, qty) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // orderId tashqaridan beriladi: CartPage avval Telegram'ga yuboradi,
  // yuborilgach shu id bilan buyurtmani yozib qo'yadi.
  const addOrder = (items, customer, orderId = Date.now()) => {
    const order = {
      id: orderId,
      date: new Date().toLocaleString("uz-UZ"),
      customer,
      items,
      status: "Qabul qilindi 📬",  // ← birinchi status
    };
    setOrders((prev) => [order, ...prev]);

    // CRM ga ham yozamiz — Admin > Buyurtmalar da ko'rinadi
    try { pushOrdersToCrm(orderId, items, customer); } catch (e) { console.error("CRM bridge:", e); }

    return orderId; // CartPage ga qaytaradi
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        String(order.id) === String(orderId)
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const deleteOrder = (orderId) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  // Telegram'dagi "Boshlash / Tugatish" tugmalarini kuzatish.
  // MUHIM: avval bu har bir tashrifchida (hatto CRM'da ham) 5 soniyada bir marta
  // ishlab turardi — behuda trafik va batareya. Endi faqat mijozning tugallanmagan
  // buyurtmasi bo'lsa so'raymiz va sahifa ko'rinmayotgan bo'lsa to'xtatamiz.
  // Cheklov: getUpdates bitta "iste'molchi" uchun mo'ljallangan — bir vaqtda bir
  // nechta mijoz kuzatsa, yangilanishni faqat bittasi oladi. To'liq yechim: backend/webhook.
  const hasPendingOrders = orders.some((o) => o.status !== DONE_STATUS);

  useEffect(() => {
    if (!hasPendingOrders) return;

    let busy = false;
    const tick = async () => {
      if (busy || document.hidden) return;
      busy = true;
      try { await pollTelegramUpdates(updateOrderStatus); } finally { busy = false; }
    };

    tick();
    const interval = setInterval(tick, 10000);
    return () => clearInterval(interval);
  }, [hasPendingOrders]);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, updateQty,
      orders, addOrder, deleteOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);