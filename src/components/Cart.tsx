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
      <div className="cart-backdrop" onClick={onClose} />

      {/* Drawer */}
      <aside className="cart-drawer">
        <header className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            <div style={{ fontSize: 13, color: "var(--color-primary)", marginTop: 4 }}>
              {getCount()} items
            </div>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            &times;
          </button>
        </header>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 16 }}>🧾</div>
              <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: 8, color: "var(--color-primary)" }}>
                Your cart is empty
              </div>
              <p>Add delicious desserts from a shop to get started.</p>
              <button
                className="btn-primary"
                style={{ marginTop: 24 }}
                onClick={onClose}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {items.map((it) => (
                <div key={it.itemId} className="cart-item">
                  <img
                    src={it.imageUrl ?? getPlaceholderImage(it.name, 144, 112)}
                    alt={it.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div className="cart-item-name">{it.name}</div>
                      <div className="cart-item-price">₹{(it.price * it.qty).toFixed(2)}</div>
                    </div>

                    <div style={{ color: "#888", fontSize: "0.9rem" }}>
                      ₹{it.price.toFixed(2)} each
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                      <div className="cart-qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(it.itemId, it.qty - 1)}
                          disabled={it.qty <= 1}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{it.qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(it.itemId, it.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button className="cart-remove-btn" onClick={() => removeItem(it.itemId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <footer className="cart-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Delivery Fee</span>
              <span>₹40.00</span>
            </div>
            <div className="cart-total-row">
              <span>Total</span>
              <span>₹{(subtotal + 40).toFixed(2)}</span>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                className="btn-secondary"
                onClick={clearCart}
                style={{ flex: 1, padding: "12px" }}
              >
                Clear
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={() => {
                  onClose?.();
                  window.location.href = "/checkout";
                }}
              >
                Checkout Now
              </button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}
