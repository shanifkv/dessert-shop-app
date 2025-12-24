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
            }}
          >
            <div>
              <strong>Order:</strong> {o.id}
            </div>
            <div>
              <strong>Status:</strong> {o.status}
            </div>
            <div>
              <strong>Total:</strong> ₹{o.total}
            </div>

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button
                disabled={updatingId === o.id}
                onClick={() => updateOrderStatus(o.id, "preparing")}
              >
                Preparing
              </button>

              <button
                disabled={updatingId === o.id}
                onClick={() =>
                  updateOrderStatus(o.id, "out_for_delivery")
                }
              >
                Out for Delivery
              </button>

              <button
                disabled={updatingId === o.id}
                onClick={() => updateOrderStatus(o.id, "completed")}
              >
                Completed
              </button>
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
