import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../components/useAuthStore';
import axiosInstance from "../config/axiosInstance";

const Logout = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    console.log("🔵 handleLogout clicked"); // 确保函数被调用
  
    try {
      console.log("🔵 Sending logout request for user ID:", user.id);
  
      const response = await axiosInstance.post("/api/logout", { id: user.id }, { withCredentials: true });
  
      console.log("🟢 Logout response:", response.data);
    } catch (error) {
      console.error("❌ Failed to update last_login:", error);
    }
  
    // 清除所有认证相关的信息
    // 清除cookie，需要设置相同的domain和path
    document.cookie = "user_id=; path=/; domain=localhost; max-age=-1";
    document.cookie = "auth_token=; path=/; domain=localhost; max-age=-1";
    localStorage.clear();
    sessionStorage.clear();
    clearUser();
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
