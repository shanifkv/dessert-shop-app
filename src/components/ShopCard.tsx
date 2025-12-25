/**
 * src/components/ShopCard.tsx
 * Small card to display a Shop and navigate to its shop page.
 */
import React from "react";
import { Shop } from "../types";
import { useNavigate } from "react-router-dom";
import { getPlaceholderImage } from "../utils/images";

interface ShopCardProps {
  shop: Shop;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop }) => {
  const navigate = useNavigate();

  return (
    <article
      className="card"
      style={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onClick={() => navigate(`/shop/${shop.id}`)}
    >
      <div style={{ height: "200px", overflow: "hidden" }}>
        {shop.imageUrl ? (
          <img
            src={shop.imageUrl}
            alt={shop.name}
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = getPlaceholderImage(shop.name || "dessert", 400, 250);
            }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img src={getPlaceholderImage(shop.name || "cafe", 400, 250)} alt={shop.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
      </div>

      <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "1.25rem", color: "var(--color-primary)" }}>
          {shop.name}
        </h3>
        <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.95rem", flex: 1 }}>
          {shop.address ?? shop.description ?? "Authentic desserts made with love."}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            background: "rgba(0,0,0,0.05)",
            color: "var(--color-text-light)",
            padding: "4px 12px",
            borderRadius: "50px",
            fontSize: "0.85rem",
            fontWeight: 500
          }}>
            Closed • Opens 9am
          </span>
          <button style={{
            background: "none",
            border: "none",
            color: "var(--color-primary)",
            fontWeight: "bold",
            cursor: "pointer",
            padding: 0
          }}>
            Visit Shop →
          </button>
        </div>
      </div>
    </article>
  );
};

export default ShopCard;
