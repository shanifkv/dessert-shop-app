import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../app/firebase";
import { useAuth } from "../context/AuthContext";
import { Order } from "../types";

const DeliveryHome: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // 🔹 Listen for "ready" or "on_the_way" orders
  // Using a simplified query for now: get all orders and filter client side or just listen to "ready" 
  // Requirement says: Query orders where status == "ready"
  useEffect(() => {
    // Ideally we might want to see orders assigned to us too ("on_the_way" + deliveryId == me)
    // But per strict requirements: "Query orders where status == 'ready'"

    // Let's listen to both 'ready' (to accept) and 'on_the_way' (to deliver if it's mine)
    // Firestore OR queries are cleaner with multiple listeners or client filtering.
    // For simplicity/production-thinking, let's just listen to all active delivery-relevant orders
    // or two separate queries. Let's do a composite or Just "ready" per prompt instructions + "on_the_way" logic.

    // Prompt: "Query orders where status == 'ready'"
    // Also "Delivery agent can... Mark delivered (set status = 'delivered')" -> implies they need to see "on_the_way" orders too.

    const q = query(
      collection(db, "orders"),
      where("status", "in", ["ready", "on_the_way"])
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Order[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));

      // Filter: Show "ready" orders OR "on_the_way" orders assigned to THIS user
      const relevant = list.filter(o =>
        o.status === "ready" || (o.status === "on_the_way" && o.deliveryId === user?.uid)
      );

      setOrders(relevant);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const acceptOrder = async (orderId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "orders", orderId), {
        deliveryId: user.uid,
        status: "on_the_way",
      });
    } catch (err) {
      console.error("Failed to accept order", err);
    }
  };

  const markDelivered = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "delivered",
      });
    } catch (err) {
      console.error("Failed to deliver order", err);
    }
  };

  return (
    <main className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: 24 }}>🚚 Delivery Portal</h2>

      {loading && <p>Loading delivery tasks...</p>}
      {!loading && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, background: "#f9f9f9", borderRadius: 12 }}>
          <p style={{ fontSize: "1.2rem", color: "#718096" }}>No orders ready for delivery.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 16 }}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <strong style={{ fontSize: "1.1rem" }}>Order #{o.id?.slice(0, 6)}</strong>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 20,
                  background: o.status === "ready" ? "#FEFCBF" : "#C6F6D5",
                  color: o.status === "ready" ? "#744210" : "#22543D",
                  fontWeight: 700,
                  fontSize: "0.85rem"
                }}>
                  {o.status === "ready" ? "READY FOR PICKUP" : "ON THE WAY"}
                </span>
              </div>
              <div style={{ color: "#4A5568", marginBottom: 4 }}>
                <strong>Pickup:</strong> {o.shopId}
              </div>
              <div style={{ color: "#4A5568" }}>
                <strong>Deliver to:</strong> {o.address}
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 16, color: "#2D3748" }}>
                ₹{o.total}
              </div>

              {o.status === "ready" && (
                <button
                  onClick={() => acceptOrder(o.id!)}
                  className="btn-primary"
                  style={{ background: "#3182ce" }}
                >
                  Accept Delivery
                </button>
              )}

              {o.status === "on_the_way" && (
                <button
                  onClick={() => markDelivered(o.id!)}
                  className="btn-primary"
                  style={{ background: "#48bb78" }}
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DeliveryHome;
