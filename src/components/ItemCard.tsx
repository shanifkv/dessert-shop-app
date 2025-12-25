import React, { useState } from "react";
import type { Item } from "../types";
import { useCart } from "../context/CartContext";
import { getPlaceholderImage } from "../utils/images";

type Props = {
  item: Item;
  shopId?: string;
  onAdd?: (id: string) => void;
};

export default function ItemCard({ item, shopId, onAdd }: Props) {
  const { addItem, openCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (adding) return;
    setAdding(true);
    if (onAdd) {
      onAdd(item.id);
      setTimeout(() => setAdding(false), 600);
    } else {
      addItem({ itemId: item.id, name: item.name, price: item.price, shopId });
      openCart();
      setTimeout(() => setAdding(false), 600);
    }
  };
  return (
    <div className="card" style={{ padding: 16, width: 200, display: "flex", flexDirection: "column" }}>
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getPlaceholderImage(item.name, 400, 240);
          }}
          style={{ width: "100%", height: 120, objectFit: "cover", marginBottom: 12, borderRadius: "8px" }}
        />
      ) : (
        <img src={getPlaceholderImage(item.name, 400, 240)} alt={item.name} style={{ width: "100%", height: 120, objectFit: "cover", marginBottom: 12, borderRadius: "8px" }} />
      )}
      <h3 style={{ margin: "0 0 4px", fontSize: "1.1rem" }}>{item.name}</h3>
      <div style={{ color: "var(--color-primary)", fontWeight: 700, marginBottom: "8px" }}>₹{item.price}</div>
      <button
        className="btn-primary"
        style={{ marginTop: "auto", padding: "8px 16px", fontSize: "0.9rem", width: "100%" }}
        onClick={handleAdd}
        disabled={adding}
      >
        {adding ? "Adding…" : "Add"}
      </button>
    </div>
  );
}
