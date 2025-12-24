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
    <article style={{
      border: "1px solid #ddd",
      borderRadius: 8,
      padding: 12,
      display: "flex",
      gap: 12,
      alignItems: "center",
      marginBottom: 12
    }}>
      {shop.imageUrl ? (
        <img src={shop.imageUrl} alt={shop.name}
          style={{ width: 120, height: 72, objectFit: "cover", borderRadius: 6 }} />
      ) : (
        <img src={getPlaceholderImage(shop.name || "cafe", 240, 140)} alt={shop.name}
          style={{ width: 120, height: 72, objectFit: "cover", borderRadius: 6 }} />
      )}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 6px 0" }}>{shop.name}</h3>
        <p style={{ margin: 0, color: "#555" }}>{shop.address ?? shop.description}</p>
      </div>
      <div>
        <button onClick={() => navigate(`/shop/${shop.id}`)}>Open</button>
      </div>
    </article>
  );
};

export default ShopCard;
