import React, { useState } from "react";
import axios from "axios";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);  // 切换注册 / 登录
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

    try {
      const response = await axios.post(url, {
        login_id: loginId,
        password: password,
      });

      setMessage(response.data.message);
      if (!isRegister) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.href = "cust/restaurants";  // 登录后跳转
      } else {
        toggleForm();  // 注册成功后切换到登录
      }
    } catch (error) {
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
      <button onClick={toggleForm}>
        {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  );
}
