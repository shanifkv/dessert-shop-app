import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import CustomerHome from "./pages/CustomerHome";
import ShopPage from "./pages/ShopPage";
import ShopHome from "./pages/ShopHome";
import DeliveryHome from "./pages/DeliveryHome";
import MyOrders from "./pages/MyOrders";

const AppRoutes: React.FC = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<Navigate to="/customer" replace />} />
      <Route path="/customer" element={<CustomerHome />} />
      <Route path="/shop/:shopId" element={<ShopPage />} />
      <Route path="/shop" element={<ShopHome />} />
      <Route path="/delivery" element={<DeliveryHome />} />
      <Route path="/my-orders" element={<MyOrders />} />

    </Routes>
  </>
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);

