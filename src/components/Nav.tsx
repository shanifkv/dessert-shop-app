/**
 * src/components/Nav.tsx
 * Small navigation using react-router Link to avoid full reloads.
 */
import React from "react";
import { Link } from "react-router-dom";

const Nav: React.FC = () => {
  return (
    <nav style={{ marginTop: 8 }}>
      <Link to="/customer" style={{ marginRight: 10 }}>Customer</Link>
      <Link to="/shop" style={{ marginRight: 10 }}>Shop</Link>
      <Link to="/delivery">Delivery</Link>
    </nav>
  );
};

export default Nav;
