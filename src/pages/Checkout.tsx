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
      const fullAddress = {
        name,
        line1,
        line2,
        city,
        phone
      };

      // SINGLE SOURCE OF TRUTH ORDER DOCUMENT
      const order = {
        customerId: null, // TODO: Auth user ID
        shopId: items[0]?.shopId ?? "demo-shop", // Fallback for debugging
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
      <main className="container" style={{ padding: "40px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", marginBottom: "20px" }}>Your Cart is Empty</h2>
        <p style={{ marginBottom: "30px", color: "#666" }}>Looks like you haven't added any treats yet.</p>
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
    <main className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ fontSize: "2.5rem", marginBottom: "30px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
        Checkout
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
        {/* Left Column: Form */}
        <div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Shipping Details</h3>
          <form onSubmit={onPlaceOrder} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: "12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem" }}
                placeholder="Ex. Jane Doe"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ padding: "12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem" }}
                placeholder="Ex. 9876543210"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Address Line 1</label>
              <input
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                style={{ padding: "12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem" }}
                placeholder="Street address, flat number"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>Address Line 2 (Optional)</label>
              <input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                style={{ padding: "12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem" }}
                placeholder="Landmark, etc."
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={{ fontWeight: 600, fontSize: "0.9rem" }}>City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ padding: "12px", borderRadius: "4px", border: "1px solid #ddd", fontSize: "1rem" }}
                placeholder="Ex. Kochi"
              />
            </div>

            {error && (
              <div style={{
                padding: "12px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
                fontSize: "0.9rem"
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ padding: "16px", fontSize: "1.1rem", marginTop: "10px" }}
            >
              {loading ? "Processing Order..." : `Place Order (₹${getTotal().toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div style={{ backgroundColor: "#f9f9f9", padding: "30px", borderRadius: "8px", height: "fit-content" }}>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Order Summary</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {items.map((it) => (
              <li key={it.itemId} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #eee" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{it.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#666" }}>Qty: {it.qty}</div>
                </div>
                <div style={{ fontWeight: 600 }}>₹{(it.price * it.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "2px solid #ddd", display: "flex", justifyContent: "space-between", fontSize: "1.2rem", fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: "var(--color-primary)" }}>₹{getTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
