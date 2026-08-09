"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const KEY = "kalakart_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function add(product, quantity = 1) {
    setItems((cur) => {
      const idx = cur.findIndex((i) => i.id === product.id);
      if (idx > -1) {
        const next = [...cur];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
        return next;
      }
      return [
        ...cur,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || "",
          quantity,
        },
      ];
    });
    setOpen(true);
  }

  function setQty(id, quantity) {
    setItems((cur) =>
      cur
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function remove(id) {
    setItems((cur) => cur.filter((i) => i.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const count = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.quantity, 0),
    [items]
  );

  const value = {
    items,
    hydrated,
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
