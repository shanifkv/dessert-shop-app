/**
 * src/components/Header.tsx
 * Premium glassmorphism header with elegant navigation
 */
import React from "react";

import Cart from "./Cart";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, signInAs, signOut } = useAuth();
  const { showCart, openCart, closeCart, getCount } = useCart();

  return (
    <>
      <header style={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        boxShadow: "var(--shadow-sm)",
        padding: "16px 0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 style={{
              margin: 0,
              fontSize: "1.75rem",
              color: "var(--color-primary)",
              fontFamily: "var(--font-serif)",
              fontWeight: 700,
              letterSpacing: "-0.5px"
            }}>
              Dessert Shop
            </h1>
          </Link>

          {/* Navigation */}
          <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link to="/customer" style={{ textDecoration: "none", color: "var(--color-text)", fontWeight: 500, fontSize: "0.95rem" }}>Customer</Link>
            <Link to="/my-orders" style={{ textDecoration: "none", color: "var(--color-text)", fontWeight: 500, fontSize: "0.95rem" }}>My Orders</Link>
            <Link to="/shop" style={{ textDecoration: "none", color: "var(--color-text)", fontWeight: 500, fontSize: "0.95rem" }}>Shop</Link>
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {/* Cart Button */}
            <button
              onClick={() => showCart ? closeCart() : openCart()}
              className="btn-secondary"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                fontSize: "0.9rem"
              }}
            >
              🛒 Cart
              {getCount() > 0 && (
                <span style={{
                  background: "var(--color-primary)",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "12px"
                }}>
                  {getCount()}
                </span>
              )}
            </button>

            {/* Login Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem" }}>
              Login as:
              {user ? (
                <>
                  <strong style={{ color: "var(--color-primary)" }}>{user.role}</strong>
                  <button onClick={signOut} style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer", color: "#666" }}>(Sign Out)</button>
                </>
              ) : (
                <>
                  <button onClick={() => signInAs("customer")} style={{ background: "#e0e0e0", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Customer</button>
                  <button onClick={() => signInAs("shop")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}>Shop</button>
                  <button onClick={() => signInAs("delivery")} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#666" }}>Delivery</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {showCart && <Cart onClose={closeCart} />}
    </>
  );
};

export default Header;
