import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../app/firebase";
import { useAuth } from "../context/AuthContext";

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("customerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);
    });

    return () => unsub();
  }, [user]);

  return (
    <main style={{ padding: 16 }}>
      <h2>My Orders</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((o) => (
        <div key={o.id} style={{ marginBottom: 12 }}>
          <div><strong>Order:</strong> {o.id}</div>
          <div>Status: {o.status}</div>
          <div>Total: ₹{o.total}</div>
        </div>
      ))}
    </main>
  );
};

export default MyOrders;
