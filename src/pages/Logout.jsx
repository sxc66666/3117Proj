import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../store/useAuthSore';

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();

  const handleLogout = () => {
    document.cookie = "user_id=; path=/; max-age=-1";
    localStorage.removeItem("user");
    clearUser();
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to log out?</h2>
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
