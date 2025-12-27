import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../app/firebase";
import AddItemForm from "../components/AddItemForm";
import ShopProfileForm from "../components/ShopProfileForm";
import { useAuth } from "../context/AuthContext";

type OrderRecord = {
  id: string;
  status: string;
  total: number;
};



const ShopHome: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [shopExists, setShopExists] = useState<boolean | null>(null);
  const { user } = useAuth();

  // Use the authenticated user's ID as the shop ID
  const currentShopId = user?.uid;

  // Check if shop profile exists
  useEffect(() => {
    if (currentShopId) {
      getDoc(doc(db, "shops", currentShopId)).then((snap) => {
        setShopExists(snap.exists());
      });
    }
  }, [currentShopId]);

  // 🔹 Listen to orders in real-time
  useEffect(() => {
    setLoading(true);
    setError(null);

    // Wait for auth to initialize or redirect if not a shop
    if (!currentShopId) {
      // If we are still checking auth, we might want to wait, 
      // but for now simple return if no user is found.
      if (user === null) {
        // User is explicitly null (not just undefined/loading)
        setError("You must be logged in to view shop orders.");
        setLoading(false);
      }
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
  }, [currentShopId, user]);

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
    <main className="container" style={{ padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h2 className="page-title" style={{ marginBottom: 0 }}>Shop Dashboard</h2>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={{ color: "var(--color-text-light)" }}>Shop ID: {currentShopId}</div>
          <button
            className="btn-secondary"
            onClick={() => setShowProfile(!showProfile)}
          >
            {showProfile ? "Close Settings" : "Edit Shop Profile"}
          </button>
        </div>
      </div>

      {/* 🔹 SHOP PROFILE SECTION */}
      {currentShopId && (showProfile || (shopExists === false && !loading)) && (
        <section style={{ marginBottom: 48 }}>
          {!shopExists && !loading && (
            <div style={{
              padding: "16px",
              background: "#fff7ed",
              borderLeft: "4px solid #f97316",
              marginBottom: "16px",
              borderRadius: "4px",
              color: "#9a3412"
            }}>
              <strong>Action Required:</strong> Please create your shop profile to be visible to customers.
            </div>
          )}
          <ShopProfileForm
            shopId={currentShopId}
            onProfileSaved={() => {
              setShopExists(true);
              setShowProfile(false);
            }}
          />
        </section>
      )}

      <section style={{ marginBottom: 48 }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "24px", fontFamily: "var(--font-serif)", color: "var(--color-primary)" }}>
          Active Orders
        </h3>

        {loading && <p>Loading orders…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && orders.length === 0 && (
          <div style={{
            padding: 40,
            background: "white",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)"
          }}>
            <p style={{ fontSize: "1.1rem", color: "var(--color-text-light)" }}>No active orders at the moment.</p>
          </div>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {orders.map((o, index) => (
            <div
              key={o.id}
              className={`card animate-slide-up stagger-${(index % 10) + 1}`}
              style={{
                padding: 24,
                display: "flex",
                flexDirection: "column",
                borderTop: `4px solid ${o.status === "ready" ? "#48bb78" :
                  o.status === "preparing" ? "#ecc94b" :
                    o.status === "placed" ? "#4299e1" : "#cbd5e0"
                  }`
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>#{o.id.slice(0, 8)}</span>
                <span style={{
                  padding: "4px 12px",
                  borderRadius: 50,
                  background: o.status === "ready" ? "#f0fff4" : o.status === "preparing" ? "#fffff0" : "#ebf8ff",
                  color: o.status === "ready" ? "#2f855a" : o.status === "preparing" ? "#b7791f" : "#2c5282",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {o.status.replace(/_/g, " ")}
                </span>
              </div>

              <div style={{ marginBottom: 20, flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "var(--color-text-light)" }}>Total Amount</span>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>₹{o.total}</span>
                </div>
                {/* Could list items here if available in order record */}
              </div>

              <div style={{ marginTop: "auto" }}>
                {o.status === "placed" && (
                  <button
                    className="btn-primary"
                    disabled={updatingId === o.id}
                    onClick={() => updateOrderStatus(o.id, "preparing")}
                    style={{ width: "100%", fontSize: "0.95rem" }}
                  >
                    Start Preparing
                  </button>
                )}

                {o.status === "preparing" && (
                  <button
                    className="btn-primary"
                    disabled={updatingId === o.id}
                    onClick={() => updateOrderStatus(o.id, "ready")}
                    style={{ width: "100%", fontSize: "0.95rem", background: "#48bb78" }}
                  >
                    Mark Ready for Pickup
                  </button>
                )}

                {o.status === "ready" && (
                  <div style={{
                    textAlign: "center",
                    padding: "10px",
                    background: "#f7fafc",
                    borderRadius: 8,
                    color: "#718096",
                    fontStyle: "italic",
                    fontSize: "0.9rem"
                  }}>
                    Waiting for delivery partner...
                  </div>
                )}

                {o.status === "on_the_way" && (
                  <div style={{
                    textAlign: "center",
                    color: "#d69e2e",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}>
                    <span>🚀</span> Out for delivery
                  </div>
                )}

                {o.status === "delivered" && (
                  <div style={{
                    textAlign: "center",
                    color: "#38a169",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8
                  }}>
                    <span>✅</span> Delivered
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr style={{ margin: "48px 0", border: 0, borderTop: "1px solid #eee" }} />

      {/* 🔹 STEP 3.2 — ADD ITEM FORM */}
      <section style={{ maxWidth: 600, margin: "0 auto" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "24px", fontFamily: "var(--font-serif)", color: "var(--color-primary)", textAlign: "center" }}>
          Add New Item
        </h3>
        <div className="card" style={{ padding: 32 }}>
          {currentShopId && <AddItemForm shopId={currentShopId} />}
        </div>
      </section>
    </main>
  );
};

export default ShopHome;
