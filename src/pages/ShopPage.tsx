/**
 * src/pages/ShopPage.tsx
 * Query shops/{shopId}/items and render ItemCard for each item.
 */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../app/firebase";
import { Item } from "../types";
import ItemCard from "../components/ItemCard";

const ShopPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shopId) return;

    const itemsRef = collection(db, "shops", shopId, "items");
    const q = query(itemsRef, orderBy("name", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const list: Item[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Item, "id">),
        }));
        setItems(list);
        setLoading(false);
      },
      (err) => {
        console.error("ShopPage onSnapshot error:", err);
        setError("Failed to load items");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [shopId]);

  return (
    <main style={{ padding: 16 }}>
      <h2>Shop Items</h2>
      {!shopId && <p>No shop selected.</p>}
      {loading && <p>Loading items…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length === 0 && !loading ? (
        <p>No items found for this shop. Add items in Firestore under shops/{shopId}/items.</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "24px",
          marginTop: "24px"
        }}>
          {items.map((it, i) => (
            <div key={it.id} className={`animate-slide-up stagger-${(i % 10) + 1}`}>
              <ItemCard item={it} shopId={shopId} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default ShopPage;
