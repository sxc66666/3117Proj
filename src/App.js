import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import CustRestaurants from "./pages/CustRestaurants";
import CustMenu from "./pages/CustMenu";
import CustCheckout from "./pages/CustCheckout";
import MainVendor from "./pages/MainVendor";
import CustComplete from "./pages/CustComplete";
import Orders from "./pages/Orders";
import VendMenu from "./pages/VendMenu";

const Home = () => <h1 className="text-center text-3xl font-bold mt-10">Jump to the dashboard of customer/vendor later.</h1>;

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />

        <Route path="/cust/restaurants" element={<CustRestaurants />} />
        {/* <Route path="/cust/restaurants/:id" element={<CustMenu />} /> */}
        <Route path="/cust/restaurants/*" element={<CustMenu />} />
        <Route path="/cust/checkout" element={<CustCheckout />} />
        <Route path="/cust/complete" element={<CustComplete />} />

        <Route path="/vend" element={<MainVendor />} />
        <Route path="/vend/menu" element={<VendMenu />} />

        
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </div>
  );
};

export default App;
