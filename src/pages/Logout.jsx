import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../components/useAuthSore';

const Logout = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    console.log("🔵 handleLogout clicked"); // 确保函数被调用



    try {
      console.log("🔵 Sending logout request for user ID:", user.id);

      const response = await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
        credentials: "include",  // ✅ 允许携带 Cookie
      });


      const data = await response.json();
      console.log("🟢 Logout response:", data);

    } catch (error) {
      console.error("❌ Failed to update last_login:", error);
    }

    // 清除本地存储和 cookie
    document.cookie = "user_id=; path=/; max-age=-1";
    localStorage.removeItem("user");
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
