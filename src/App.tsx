import React from "react";

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 20 }}>
      <h1>Dessert Shop (Starter)</h1>
      <p>Welcome — your React + TypeScript app is set up!</p>
      <nav>
        <a href="/customer">Customer</a> | <a href="/shop">Shop</a> |{" "}
        <a href="/delivery">Delivery</a>
      </nav>
    </div>
  );
};

export default App;
