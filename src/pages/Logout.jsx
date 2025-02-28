import React from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate
import useAuthStore from '../store/useAuthSore';  // 引入 zustand store

const Logout = () => {
  const navigate = useNavigate();
  const { clearUser } = useAuthStore();

  // 当用户点击登出按钮时
  const handleLogout = () => {
    // 删除 cookie 和清除 localStorage
    document.cookie = "user_id=; path=/; max-age=-1";  // 删除 cookie
    localStorage.removeItem("user");  // 清除 localStorage

    // 清除 Zustand 中的用户信息
    clearUser();

    // 跳转到登录页
    navigate("/");  // 重定向到登录页
  };

  return (
    <div>
      <h2>You are logged out.</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
