"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getSvc } from "@/lib/data";

type CartItem = { id: string; qty: number };

type CartCtx = {
  cart: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  cartCount: number;
  cartTotal: number;
  toast: string | null;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("skinsoul_v1") || "{}");
      if (saved.cart) setCart(saved.cart);
    } catch {}
  }, []);

  const persist = useCallback((c: CartItem[]) => {
    localStorage.setItem("skinsoul_v1", JSON.stringify({ cart: c }));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const addToCart = (id: string) => {
    setCart((prev) => {
      const item = prev.find((c) => c.id === id);
      const next = item
        ? prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { id, qty: 1 }];
      persist(next);
      return next;
    });
    const s = getSvc(id);
    if (s) showToast(`${s.name} adicionado ao seu ritual`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next);
      return next;
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0);
      persist(next);
      return next;
    });
  };

  const cartCount = cart.reduce((a, c) => a + c.qty, 0);
  const cartTotal = cart.reduce((a, c) => {
    const s = getSvc(c.id);
    return a + (s ? s.price * c.qty : 0);
  }, 0);

  return (
    <Ctx.Provider value={{ cart, addToCart, removeFromCart, changeQty, cartCount, cartTotal, toast }}>
      {children}
      {toast && (
        <div className="toast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12l5 5L20 7" /></svg>
          <span>{toast}</span>
        </div>
      )}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
