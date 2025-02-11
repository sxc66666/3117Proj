import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginRegister from "./LoginRegister";

const Home = () => <h1 className="text-center text-3xl font-bold mt-10">Hello World!</h1>;

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginRegister />} />
      </Routes>
    </div>
  );
};

export default App;
