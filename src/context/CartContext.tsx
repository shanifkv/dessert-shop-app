import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "../types";

/**
 * Clean CartContext implementation
 */

type CartState = {
  items: CartItem[];
};

type CartActions = {
  addItem: (ci: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQty: (itemId: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getCount: () => number;
  showCart: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const defaultState: CartState = { items: [] };

const CartContext = createContext<CartState & CartActions>({
  ...defaultState,
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  getTotal: () => 0,
  getCount: () => 0,
  showCart: false,
  openCart: () => {},
  closeCart: () => {},
});

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = "dessertshop_cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (ci: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.itemId === ci.itemId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
      return [...prev, { ...ci, qty }];
    });
  };

  const [showCart, setShowCart] = useState(false);
  const openCart = () => setShowCart(true);
  const closeCart = () => setShowCart(false);

  const removeItem = (itemId: string) =>
    setItems((prev) => prev.filter((p) => p.itemId !== itemId));

  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) return removeItem(itemId);
    setItems((prev) =>
      prev.map((p) => (p.itemId === itemId ? { ...p, qty } : p))
    );
  };

  const clearCart = () => setItems([]);

  const getTotal = () => items.reduce((s, it) => s + it.price * it.qty, 0);

  const getCount = () => items.reduce((s, it) => s + (it.qty || 0), 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQty, clearCart, getTotal, getCount, showCart, openCart, closeCart }),
    [items, showCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
