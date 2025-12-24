import React from "react";
import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams<{ id?: string }>();

  return (
    <main style={{ padding: 16 }}>
      <h2>Order confirmed</h2>
      <p>
        Thank you — your order <strong>{id ?? "#"}</strong> has been placed successfully.
      </p>
      <p style={{ marginTop: 12 }}>
        You can view order updates in the app. For now, return to the customer page.
      </p>
      <div style={{ marginTop: 16 }}>
        <Link to="/customer">Back to Customer Home</Link>
      </div>
    </main>
  );
}
