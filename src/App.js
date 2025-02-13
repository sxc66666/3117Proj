import React from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import MainCustomer from "./pages/MainCustomer";
import MainVendor from "./pages/MainVendor";

const Home = () => <h1 className="text-center text-3xl font-bold mt-10">Jump to the dashboard of customer/vendor later.</h1>;

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/cust" element={<MainCustomer />} />
        <Route path="/vend" element={<MainVendor />} />
      </Routes>
    </div>
  );
};

export default App;
