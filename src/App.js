import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CustRestaurants from "./pages/CustRestaurants";
import CustMenu from "./pages/CustMenu";
import CustCheckout from "./pages/CustCheckout";
import CustAccount from "./pages/CustAccount";
import VendAccount from "./pages/VendAccount";

import Login from "./pages/Login";
import Logout from "./pages/Logout";  // 引入 Logout 页面
import CustComplete from "./pages/CustComplete";
import Orders from "./pages/Orders";
import VendMenu from "./pages/VendMenu";

import HCaptchaPopup from "./components/HCaptchaPopup"; // 引入 HCaptcha 组件

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCaptchaVerified = () => {
    const previousPath = location.state?.from || "/";
    navigate(previousPath);
  };

  return (
    <div>
      <Routes>
        {/* Account related routes */}
        <Route path="/" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/CustAccount" element={<CustAccount />} />
        <Route path="/VendAccount" element={<VendAccount />} />

        {/* Customer related routes */}
        <Route path="/cust/restaurants" element={<CustRestaurants />} />
        <Route path="/cust/restaurants/:restaurantId" element={<CustMenu />} />
        <Route path="/cust/checkout" element={<CustCheckout />} />
        <Route path="/cust/complete" element={<CustComplete />} />

        {/* Vendor related routes */}
        <Route path="/vend/menu" element={<VendMenu />} />

        {/* Shared routes */}
        <Route path="/orders" element={<Orders />} />

        {/* HCaptcha related routes */}
        <Route
          path="/hcaptcha"
          element={<HCaptchaPopup onVerified={handleCaptchaVerified} />}
        />
      </Routes>
    </div>
  );
};

export default App;