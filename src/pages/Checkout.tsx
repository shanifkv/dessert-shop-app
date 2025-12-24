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
      const address = `${line1}${line2 ? ", " + line2 : ""}, ${city}`.trim();

      const order = {
        customerId: null,
        shopId: items[0]?.shopId ?? null,
        items: items.map((it) => ({ itemId: it.itemId, name: it.name, price: it.price, qty: it.qty })),
        total,
        status: "placed",
        address: `${name} — ${address} — ${phone}`,
        createdAt: serverTimestamp(),
      } as any;

      const ref = await addDoc(collection(db, "orders"), order);
      clearCart();
      navigate(`/order-success/${ref.id}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 16 }}>
      <h2>Checkout</h2>

      <section style={{ marginBottom: 16 }}>
        <h3>Items</h3>
        {items.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {items.map((it) => (
              <li key={it.itemId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <div>{it.name} × {it.qty}</div>
                <div>₹{(it.price * it.qty).toFixed(2)}</div>
              </li>
            ))}
          </ul>
        )}
        <div style={{ marginTop: 8, fontWeight: 700 }}>Total: ₹{getTotal().toFixed(2)}</div>
      </section>

      <form onSubmit={onPlaceOrder} style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            Name
            <br />
            <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Address line 1
            <br />
            <input value={line1} onChange={(e) => setLine1(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Address line 2
            <br />
            <input value={line2} onChange={(e) => setLine2(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            City
            <br />
            <input value={city} onChange={(e) => setCity(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Phone
            <br />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} style={{ width: "100%" }} />
          </label>
        </div>

        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={loading}>{loading ? "Placing order…" : "Place order"}</button>
        </div>
      </form>
    </main>
  );
}
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../app/firebase";
import type { Order } from "../types";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  async function placeOrder() {
    setError(null);
    if (!name.trim() || !address.trim()) {
      setError("Please enter name and address.");
      return;
    }
    if (items.length === 0) {
      setError("Cart is empty.");
    setLoading(true);
    try {
      const orderData: Omit<Order, "id" | "createdAt"> = {
        customerId: null, // if no auth yet
        shopId: items[0] ? (items[0].id /* placeholder - ideally keep shopId with cart */ as string) : "unknown",
        items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
        total,
        status: "placed",
        address,
      };
      // Write to Firestore (orders collection)
      const ref = await addDoc(collection(db, "orders"), {
        ...orderData,
        createdAt: serverTimestamp(),
      });
      clearCart();
      // Optionally navigate to a success page or order detail
      navigate(`/order-success/${ref.id}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to place order. Try again.");
    } finally {
      setLoading(false);
  }
  return (
    <div>
      <h1>Checkout</h1>
      <h3>Items</h3>
      <ul>
        {items.map((it) => (
          <li key={it.id}>{it.name} — {it.qty} × ₹{it.price}</li>
        ))}
      </ul>
      <div>Total: ₹{total.toFixed(2)}</div>
      <h3>Delivery details</h3>
      <div>
        <label>
          Name (required)
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
      </div>
          Address (required)
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ marginTop: 12 }}>
        <button onClick={placeOrder} disabled={loading}>
          {loading ? "Placing order…" : "Place order"}
        </button>
    </div>
  );
}
// src/pages/Checkout.tsx
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../app/firebase"; // adjust path if necessary
export default function CheckoutPage() {
  const { items, clearCart, getTotal } = useCart();
  const [address, setAddress] = useState({ line1: "", line2: "", city: "", phone: "" });
  const validate = () => {
    if (!address.line1.trim()) return "Address line 1 is required";
    if (!address.phone.trim()) return "Phone is required";
    if (items.length === 0) return "Cart is empty";
    return null;
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      // NOTE: This example assumes cart items all have same shopId
      const shopId = items[0]?.shopId ?? "unknown";
      const order: Order = {
        customerId: null, // TODO: set user ID if using auth
        shopId,
        items,
        total: getTotal(),
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city: address.city || undefined,
          phone: address.phone,
        },
      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, order);
      // success
      // navigate to order confirmation
      navigate(`/order/${docRef.id}`, { replace: true });
      setError("Failed to place order. " + (err?.message ?? ""));
      <h2>Checkout</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Address line 1</label>
          <br />
          <input value={address.line1} onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
        </div>
          <label>Address line 2</label>
          <input value={address.line2} onChange={(e) => setAddress({ ...address, line2: e.target.value })} />
          <label>City</label>
          <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
          <label>Phone</label>
          <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
        <div style={{ marginTop: 12 }}>
          <strong>Total: ₹{getTotal().toFixed(2)}</strong>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "Placing order..." : "Place order"}
          </button>
      </form>
