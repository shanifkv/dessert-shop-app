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

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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
          <Link to="/" style={{ textDecoration: "none", zIndex: 102 }}>
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

          {/* Desktop Navigation */}
          <div className="hide-on-mobile" style={{ display: "flex", gap: "32px", alignItems: "center" }}>
            <Link to="/customer" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--color-text)" }}>Customer</Link>
            <Link to="/my-orders" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--color-text)" }}>My Orders</Link>
            <Link to="/shop" style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--color-text)" }}>Shop</Link>
          </div>

          <div className="hide-on-mobile" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
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
                  <button onClick={signOut} style={{ background: "none", border: "none", textDecoration: "underline", cursor: "pointer", color: "#666", padding: 0 }}>(Sign Out)</button>
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

          {/* Mobile Menu Toggle */}
          <div className="show-on-mobile" style={{ zIndex: 102 }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-text)" }}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="show-on-mobile" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            background: "white",
            zIndex: 101, // Below logo/toggle but above everything else
            padding: "80px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "1.2rem", fontWeight: 700 }}>
              <Link to="/customer" onClick={() => setMobileMenuOpen(false)}>Customer</Link>
              <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop Dashboard</Link>
            </nav>

            <hr style={{ border: "0", borderTop: "1px solid #eee", width: "100%" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>Your Cart</span>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCart();
                }}
                className="btn-primary"
                style={{ padding: "8px 24px" }}
              >
                View Cart ({getCount()})
              </button>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #eee", width: "100%" }} />

            <div style={{ marginTop: "auto" }}>
              <p style={{ color: "var(--color-text-light)", marginBottom: "12px" }}>Account</p>
              {user ? (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{user.role}</strong>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>Sign Out</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button onClick={() => { signInAs("customer"); setMobileMenuOpen(false); }} className="btn-secondary" style={{ flex: 1 }}>Customer</button>
                  <button onClick={() => { signInAs("shop"); setMobileMenuOpen(false); }} className="btn-secondary" style={{ flex: 1 }}>Shop</button>
                  <button onClick={() => { signInAs("delivery"); setMobileMenuOpen(false); }} className="btn-secondary" style={{ flex: 1 }}>Delivery</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {showCart && <Cart onClose={closeCart} />}
    </>
  );
};

export default Header;
