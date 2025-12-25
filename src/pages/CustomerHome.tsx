/**
 * src/pages/CustomerHome.tsx
 * Premium customer home with cinematic hero section
 */
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../app/firebase";
import ShopCard from "../components/ShopCard";
import type { Shop } from "../types";

const CustomerHome: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const snap = await getDocs(collection(db, "shops"));
        const data: Shop[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Shop));
        setShops(data);
      } catch (err) {
        console.error("Error fetching shops:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        background: "linear-gradient(135deg, #fffcf5 0%, #fae8ed 100%)",
        padding: "100px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(109, 46, 70, 0.03) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontSize: "4rem",
            marginBottom: "24px",
            color: "var(--color-primary)",
            fontWeight: 800,
            textShadow: "2px 2px 0px rgba(255,255,255,0.5)"
          }}>
            Sweet Cravings?
          </h2>
          <p style={{
            fontSize: "1.25rem",
            maxWidth: "600px",
            margin: "0 auto 40px",
            opacity: 0.9,
            fontWeight: 400,
            color: "var(--color-primary-dark)"
          }}>
            Discover the finest artisan dessert shops in your area.
            Order fresh, handcrafted treats delivered to your door.
          </p>
          <button
            className="btn-primary"
            style={{
              padding: "16px 40px",
              fontSize: "1.1rem",
              boxShadow: "0 8px 20px rgba(109, 46, 70, 0.2)"
            }}
            onClick={() => document.getElementById('shops-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Shops
          </button>
        </div>
      </section>

      {/* Featured Shops */}
      <section id="shops-section" style={{ padding: "80px 0", backgroundColor: "var(--color-secondary)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "30px" }}>
            <h3 style={{ fontSize: "2rem", color: "var(--color-primary)" }}>Featured Shops</h3>
            <span style={{ color: "#777" }}>1 locations near you</span>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>Loading shops...</div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "30px"
            }}>
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CustomerHome;
