import React from "react";
import { useShops } from "../hooks/useShops";
import ShopCard from "../components/ShopCard";

const CustomerHome: React.FC = () => {
  const { shops, loading, error } = useShops();

  return (
    <main style={{ padding: 16 }}>
      <h2>Customer Portal</h2>

      {loading && <p>Loading shops…</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {shops.length === 0 && !loading ? (
        <p>No shops found. Add shops in Firestore.</p>
      ) : (
        shops.map((s) => <ShopCard key={s.id} shop={s} />)
      )}
    </main>
  );
};

export default CustomerHome;
