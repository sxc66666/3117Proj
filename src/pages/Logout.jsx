import React from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const API_DOMAIN = process.env.REACT_APP_API_DOMAIN; // read from .env file
if (!API_DOMAIN) {
  throw new Error('REACT_APP_API_DOMAIN is not defined in .env file');
}

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("🔵 handleLogout clicked"); // 确保函数被调用
  
    try {
  
      const response = await axiosInstance.post("/api/logout");
  
      console.log("🟢 Logout response:", response.data);
    } catch (error) {
      console.error("❌ Failed to update last_login:", error);
    }
  
    // 清除所有认证相关的信息
    // 清除cookie，需要设置相同的domain和path
    document.cookie = `user_id=; path=/; domain=${API_DOMAIN}; max-age=-1`;
    document.cookie = `auth_token=; path=/; domain=${API_DOMAIN}; max-age=-1`;
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Are you sure you want to log out?
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Logout;
