import React from "react";
import { useCart } from "../context/CartContext";
import { getPlaceholderImage } from "../utils/images";

type Props = {
  onClose?: () => void;
};

export default function Cart({ onClose }: Props) {
  const { items, removeItem, updateQty, clearCart, getTotal, getCount } = useCart();

  const subtotal = getTotal();

  return (
    <div>
      {/* Backdrop */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50 }} onClick={onClose} />

      {/* Drawer */}
      <aside style={{ position: "fixed", right: 0, top: 0, height: "100%", width: 360, background: "#fff", zIndex: 60, boxShadow: "-6px 0 24px rgba(0,0,0,0.12)", display: "flex", flexDirection: "column" }}>
        <header style={{ padding: 16, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>Your Cart</strong>
            <div style={{ fontSize: 12, color: "#666" }}>{getCount()} items</div>
          </div>
          <div>
            <button onClick={onClose} aria-label="Close cart">Close</button>
          </div>
        </header>

        <div style={{ padding: 12, overflowY: "auto", flex: 1 }}>
          {items.length === 0 ? (
            <div style={{ padding: 32, textAlign: "center", color: "#666" }}>
              <div style={{ fontSize: 48, lineHeight: 1 }}>🧾</div>
              <div style={{ fontWeight: 700, marginTop: 8 }}>Your cart is empty</div>
              <div style={{ marginTop: 6, color: "#888" }}>Add delicious desserts from a shop to get started.</div>
              <div style={{ marginTop: 12 }}>
                <button onClick={onClose || (() => {})}>Continue shopping</button>
              </div>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((it) => (
                <li key={it.itemId} style={{ display: "flex", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f1f1" }}>
                  <img src={it.imageUrl ?? getPlaceholderImage(it.name, 144, 112)} alt={it.name} width={72} height={56} style={{ objectFit: "cover", borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{it.name}</div>
                    <div style={{ color: "#666", fontSize: 13 }}>₹{it.price.toFixed(2)}</div>
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => updateQty(it.itemId, it.qty - 1)} disabled={it.qty <= 1} aria-label="Decrease quantity">-</button>
                      <span style={{ margin: "0 8px" }}>{it.qty}</span>
                      <button onClick={() => updateQty(it.itemId, it.qty + 1)}>+</button>
                      <button style={{ marginLeft: 12 }} onClick={() => removeItem(it.itemId)}>Remove</button>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700 }}>₹{(it.price * it.qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer style={{ padding: 16, borderTop: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ color: "#666" }}>Subtotal</div>
            <div style={{ fontWeight: 800 }}>₹{subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1 }} onClick={() => { /* TODO: go to checkout */ }}>Checkout</button>
            <button style={{ flex: 1 }} onClick={clearCart}>Clear</button>
          </div>
        </footer>
      </aside>
    </div>
  );
}
