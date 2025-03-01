import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import CustRestaurants from "./pages/CustRestaurants";
import CustMenu from "./pages/CustMenu";
import CustCheckout from "./pages/CustCheckout";
import MainVendor from "./pages/MainVendor";

import Login from "./pages/Login";
import Logout from "./pages/Logout";  // 引入 Logout 页面
import CustComplete from "./pages/CustComplete";
import Orders from "./pages/Orders";
import VendMenu from "./pages/VendMenu";


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Auth" element={<Auth />} />
        <Route path="/cust/restaurants" element={<CustRestaurants />} />
        <Route path="/cust/restaurants/:restaurantId" element={<CustMenu />} />
        <Route path="/cust/checkout" element={<CustCheckout />} />

        {/* 登出页面 */}
        <Route path="/logout" element={<Logout />} />
        <Route path="/cust/complete" element={<CustComplete />} />
        <Route path="/vend/menu" element={<VendMenu />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default App;
