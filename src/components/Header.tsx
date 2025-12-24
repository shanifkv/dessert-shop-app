/**
 * src/components/Header.tsx
 * Shared header that shows the Nav and a small sign-in helper.
 */
import React from "react";
import Nav from "./Nav";
import Cart from "./Cart";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header: React.FC = () => {
  const { user, signInAs, signOut } = useAuth();
  const { items, showCart, openCart, closeCart, getCount } = useCart();

  return (
    <header style={{ padding: 12, borderBottom: "1px solid #ddd" }}>
      <h1 style={{ margin: 0 }}>Dessert Shop App</h1>
      <Nav />
      <div style={{ marginTop: 8, display: "flex", gap: 12, alignItems: "center" }}>
        <button onClick={() => (showCart ? closeCart() : openCart())} aria-label="Open cart">Cart ({getCount()})</button>
        {user ? (
          <div>
            Signed in as <strong>{user.role}</strong>{" "}
            <button onClick={signOut} style={{ marginLeft: 8 }}>Sign out</button>
          </div>
        ) : (
          <div>
            Quick sign-in:
            <button onClick={() => signInAs("customer")} style={{ marginLeft: 8 }}>Customer</button>
            <button onClick={() => signInAs("shop")} style={{ marginLeft: 8 }}>Shop</button>
            <button onClick={() => signInAs("delivery")} style={{ marginLeft: 8 }}>Delivery</button>
          </div>
        )}
      </div>
      {showCart ? <Cart onClose={closeCart} /> : null}
    </header>
  );
};

export default Header;
