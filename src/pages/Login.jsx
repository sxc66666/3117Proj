import React, { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);  // 切换注册/登录模式
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setLoginId("");
    setPassword("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isRegister
      ? "http://localhost:9000/auth/register"
      : "http://localhost:9000/auth/login";

    const data = {
      login_id: loginId,
      password: password,
    };

    try {
      const response = await axios.post(url, data);

      console.log("Response:", response.data);  // 打印登录响应信息

      setMessage(response.data.message);
      if (!isRegister) {
        // 登录成功时，存储用户信息
        localStorage.setItem("user", JSON.stringify(response.data.user)); // 将用户信息存储在 localStorage 中
        window.location.href = "/cust/restaurants";  // 登录成功后跳转到仪表板
      } else {
        toggleForm();  // 注册成功后切换到登录页面
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message); // 打印错误信息
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div>
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login ID"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      {message && <p>{message}</p>}

      {isRegister ? (
        <button onClick={toggleForm}>
          Already have an account? Login
        </button>
      ) : (
        <button onClick={toggleForm}>
          Don't have an account? Register
        </button>
      )}
    </div>
  );
}
