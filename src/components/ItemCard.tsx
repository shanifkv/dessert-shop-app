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

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <article className="item-card">
      <div className="item-card-image-container">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="item-card-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderImage(item.name, 400, 240);
            }}
          />
        ) : (
          <img
            src={getPlaceholderImage(item.name, 400, 240)}
            alt={item.name}
            className="item-card-image"
          />
        )}
      </div>

      <div className="item-card-content">
        <h3 className="item-card-title">{item.name}</h3>
        <p style={{ margin: "0 0 12px", fontSize: "0.9rem", color: "#666", lineHeight: 1.4 }}>
          {/* Description placeholder - ideally item has description */}
          Delicious handcrafted delight.
        </p>
        <div className="item-card-price">₹{item.price}</div>

        <button
          className="add-btn"
          onClick={handleAdd}
          disabled={adding}
        >
          {adding ? (
            <>Added</>
          ) : (
            <>
              Add <span style={{ fontSize: '1.2em', lineHeight: 1 }}>+</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
