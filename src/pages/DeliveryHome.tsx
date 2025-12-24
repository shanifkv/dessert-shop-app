import React, { useEffect, useState } from "react";
import { listenOrdersByStatus, updateOrder } from "../services/orders";
import { useAuth } from "../context/AuthContext";

const DeliveryHome: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const unsub = listenOrdersByStatus("ready", setOrders);
    return () => unsub();
  }, []);

  const acceptOrder = async (orderId: string) => {
    if (!user) return;
    await updateOrder(orderId, {
      deliveryId: user.uid,
      status: "on_the_way",
    });
  };

  const markDelivered = async (orderId: string) => {
    await updateOrder(orderId, { status: "delivered" });
  };

  return (
    <main style={{ padding: 16 }}>
      <h2>Delivery Portal</h2>

      {orders.length === 0 && <p>No ready orders.</p>}

      {orders.map((o) => (
        <div
          key={o.id}
          style={{ border: "1px solid #ddd", padding: 12, marginBottom: 8 }}
        >
          <div><strong>Order:</strong> {o.id}</div>
          <div><strong>Total:</strong> ₹{o.total}</div>

          {o.status === "ready" && (
            <button onClick={() => acceptOrder(o.id)}>Accept</button>
          )}

          {o.status === "on_the_way" && (
            <button onClick={() => markDelivered(o.id)}>
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </main>
  );
};

export default DeliveryHome;
