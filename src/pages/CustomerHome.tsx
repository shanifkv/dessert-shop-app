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
        backgroundImage: "url('/images/premium-chocolate-cake.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "140px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        color: "white" // Ensure text is white over the dark image
      }}>
        {/* Dark overlay for readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(74, 26, 44, 0.7), rgba(44, 12, 22, 0.8))",
          zIndex: 1
        }} />

        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <h2 style={{
            fontSize: "4rem",
            marginBottom: "24px",
            color: "#fffcf5", // Warm cream text
            fontWeight: 800,
            textShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}>
            Sweet Cravings?
          </h2>
          <p style={{
            fontSize: "1.35rem",
            maxWidth: "640px",
            margin: "0 auto 40px",
            opacity: 0.95,
            fontWeight: 400,
            color: "#f0e6d2", // Lighter cream for body text
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>
            Discover the finest artisan dessert shops in your area.
            Order fresh, handcrafted treats delivered to your door.
          </p>
          <button
            className="btn-primary"
            style={{
              padding: "18px 48px",
              fontSize: "1.15rem",
              background: "var(--color-primary)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.4)"
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
              {shops.map((shop, i) => (
                <div key={shop.id} className={`animate-slide-up stagger-${(i % 10) + 1}`}>
                  <ShopCard shop={shop} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CustomerHome;
