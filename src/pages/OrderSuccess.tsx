import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams<{ id?: string }>();

  return (
    <main className="container" style={{ padding: "80px 20px", textAlign: "center", maxWidth: "600px" }}>
      <div style={{
        width: "80px",
        height: "80px",
        backgroundColor: "var(--color-primary)",
        borderRadius: "50%",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "40px",
        margin: "0 auto 30px"
      }}>
        ✓
      </div>

      <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>Order Confirmed!</h2>

      <p style={{ fontSize: "1.2rem", color: "#666", lineHeight: 1.6, marginBottom: "30px" }}>
        Thank you for your order. We've received it and will begin processing it right away.
      </p>

      <div style={{
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "40px"
      }}>
        <span style={{ display: "block", fontSize: "0.9rem", color: "#666", marginBottom: "5px" }}>ORDER ID</span>
        <strong style={{ fontSize: "1.2rem", fontFamily: "monospace", letterSpacing: "1px" }}>{id}</strong>
      </div>

      <Link
        to="/customer"
        className="btn-primary"
        style={{ textDecoration: "none", display: "inline-block" }}
      >
        Continue Shopping
      </Link>
    </main>
  );
}
