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
      className="shop-card"
      onClick={() => navigate(`/shop/${shop.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="shop-card-image-container">
        {shop.imageUrl ? (
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="shop-card-image"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getPlaceholderImage(shop.name || "dessert", 600, 400);
            }}
          />
        ) : (
          <img
            src={getPlaceholderImage(shop.name || "cafe", 600, 400)}
            alt={shop.name}
            className="shop-card-image"
          />
        )}

        <div className="badge-open">
          OPEN NOW
        </div>
      </div>

      <div className="shop-card-content">
        <h3 className="shop-card-title">
          {shop.name}
        </h3>
        <p className="shop-card-info">
          {shop.address ?? shop.description ?? "Experience the finest handcrafted desserts."}
        </p>

        <div className="shop-card-footer">
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} style={{ color: i <= 4 ? "var(--color-accent)" : "#e0e0e0", fontSize: "0.9rem" }}>★</span>
            ))}
            <span style={{ fontSize: "0.85rem", color: "#999", marginLeft: 6 }}>(4.2)</span>
          </div>

          <button className="shop-visit-btn">
            Visit Boutique <span>→</span>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ShopCard;
