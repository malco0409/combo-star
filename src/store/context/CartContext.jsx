// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { pollTelegramUpdates } from "../utils/telegramPolling";
import { pushOrdersToCrm } from "../../shared/orderBridge";

const CartContext = createContext();

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

  const addToCart = (item) => {
    setCart((prev) => [...prev, { ...item, cartId: Date.now() }]);
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

  const addOrder = (items, customer) => {
    const orderId = Date.now();
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

  useEffect(() => {
    const interval = setInterval(() => {
      pollTelegramUpdates(updateOrderStatus);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart, updateQty,
      orders, addOrder, deleteOrder,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);