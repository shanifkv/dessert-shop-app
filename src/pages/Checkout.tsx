import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../app/firebase";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (items.length === 0) return "Your cart is empty.";
    if (!name.trim()) return "Name is required.";
    if (!line1.trim()) return "Address is required.";
    if (!phone.trim()) return "Phone is required.";
    return null;
  };

  const onPlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const total = getTotal();

      // SINGLE SOURCE OF TRUTH ORDER DOCUMENT
      const order = {
        customerId: null, // TODO: Auth user ID
        shopId: items[0]?.shopId ?? "demo-shop",
        deliveryId: null,
        items: items.map((it) => ({
          itemId: it.itemId,
          name: it.name,
          price: it.price,
          qty: it.qty
        })),
        total,
        status: "placed",
        address: `${name}, ${line1}, ${line2 ? line2 + ', ' : ''}${city} - ${phone}`,
        createdAt: serverTimestamp(),
      };

      const ref = await addDoc(collection(db, "orders"), order);
      clearCart();
      navigate(`/order-success/${ref.id}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: 600 }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "20px", fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
          Your Cart is Empty
        </h2>
        <p style={{ marginBottom: "30px", color: "#666", fontSize: "1.1rem" }}>
          Looks like you haven't added any treats yet.
        </p>
        <button
          className="btn-primary"
          onClick={() => navigate('/customer')}
        >
          Browse Shops
        </button>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "60px 24px" }}>
      <h2 className="page-title">Checkout</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "60px", alignItems: "start" }}>
        {/* Left Column: Form */}
        <div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "24px", fontFamily: "var(--font-serif)", color: "var(--color-text)" }}>
            Shipping Details
          </h3>
          <form onSubmit={onPlaceOrder}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex. Jane Doe"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex. 9876543210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address Line 1</label>
              <input
                className="form-input"
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                placeholder="Street address, flat number"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address Line 2 (Optional)</label>
              <input
                className="form-input"
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                placeholder="Landmark, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex. Kochi"
              />
            </div>

            {error && (
              <div style={{
                padding: "16px",
                backgroundColor: "#fff5f5",
                color: "#e53e3e",
                borderRadius: "8px",
                fontSize: "0.95rem",
                marginBottom: "20px",
                border: "1px solid #fed7d7"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {loading ? "Processing Order..." : `Place Order (₹${getTotal().toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-summary-card">
          <h3 style={{ fontSize: "1.5rem", marginBottom: "24px", fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
            Your Order
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((it) => (
              <li key={it.itemId} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px dashed rgba(0,0,0,0.1)" }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{it.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "var(--color-text-light)" }}>Qty: {it.qty}</div>
                </div>
                <div style={{ fontWeight: 700, color: "var(--color-primary)" }}>₹{(it.price * it.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "2px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-serif)" }}>
            <span>Total</span>
            <span style={{ color: "var(--color-primary)" }}>₹{getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
