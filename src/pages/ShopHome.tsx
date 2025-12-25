import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../app/firebase";
import AddItemForm from "../components/AddItemForm";
import { useAuth } from "../context/AuthContext";

type OrderRecord = {
  id: string;
  status: string;
  total: number;
};

const SHOP_ID = "demo-shop";

const ShopHome: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { user } = useAuth();
  const currentShopId = user?.role === "shop" ? user.uid : SHOP_ID;

  // 🔹 Listen to orders in real-time
  useEffect(() => {
    setLoading(true);
    setError(null);

    if (!currentShopId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "orders"), where("shopId", "==", currentShopId));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: OrderRecord[] = snap.docs.map((d) => ({
          id: d.id,
          status: d.data().status ?? "placed",
          total: d.data().total ?? 0,
        }));
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentShopId]);

  // 🔹 Update order status
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingId(orderId);
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (err) {
      console.error(err);
      setError("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main style={{ padding: 16 }}>
      <h2>ShopHome — Orders for {currentShopId}</h2>

      {loading && <p>Loading orders…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found for {currentShopId}.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map((o) => (
          <li
            key={o.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 6,
              padding: 12,
              marginBottom: 8,
              background: "#fff"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <strong>Order #{o.id.slice(0, 8)}</strong>
              <span style={{
                padding: "2px 8px",
                borderRadius: 4,
                background: o.status === "ready" ? "#C6F6D5" : "#EBF8FF",
                color: "#2D3748",
                fontWeight: "bold",
                fontSize: "0.85rem",
                textTransform: "capitalize"
              }}>
                {o.status.replace(/_/g, " ")}
              </span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Total:</strong> ₹{o.total}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              {o.status === "placed" && (
                <button
                  className="btn-primary"
                  disabled={updatingId === o.id}
                  onClick={() => updateOrderStatus(o.id, "preparing")}
                  style={{ fontSize: "0.9rem", padding: "8px 16px" }}
                >
                  Start Preparing
                </button>
              )}

              {o.status === "preparing" && (
                <button
                  className="btn-primary"
                  disabled={updatingId === o.id}
                  onClick={() => updateOrderStatus(o.id, "ready")}
                  style={{ fontSize: "0.9rem", padding: "8px 16px", background: "var(--color-pistachio)" }}
                >
                  Mark Ready
                </button>
              )}

              {o.status === "ready" && (
                <div style={{ color: "var(--color-gray-500)", fontStyle: "italic", fontSize: "0.9rem" }}>
                  Waiting for driver...
                </div>
              )}

              {o.status === "on_the_way" && (
                <div style={{ color: "var(--color-gold)", fontWeight: 600, fontSize: "0.9rem" }}>
                  🚀 Out for delivery
                </div>
              )}

              {o.status === "delivered" && (
                <div style={{ color: "var(--color-pistachio)", fontWeight: 600, fontSize: "0.9rem" }}>
                  ✅ Delivered
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <hr style={{ margin: "24px 0" }} />

      {/* 🔹 STEP 3.2 — ADD ITEM FORM */}
      <AddItemForm shopId={currentShopId} />
    </main>
  );
};

export default ShopHome;
