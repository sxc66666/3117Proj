import React, { useState } from "react";
import FormInput from "../components/FormInput";

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false); // 切换登录/注册模式
  const [formData, setFormData] = useState({
    login_id: "",
    password: "",
    email: "",
    nick_name: "",
    type: "",
  });
  const [error, setError] = useState(""); // 存储错误信息

  // 切换 登录/注册
  const toggleForm = () => {
    setIsRegister(!isRegister);
    setFormData({ login_id: "", password: "", email: "", nick_name: "", type: "" });
    setError("");
  };

  // 处理表单输入变化
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 处理表单提交（注册/登录）
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isRegister ? "http://localhost:5000/register" : "http://localhost:5000/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include", // 允许后端设置 Cookie（JWT）
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      alert(isRegister ? "Registration successful!" : "Login successful!");
      
      if (!isRegister) {
        localStorage.setItem("user", JSON.stringify(data.user)); // 存储用户信息
        window.location.href = "/dashboard"; // 登录成功后跳转
      } else {
        toggleForm(); // 切换到登录页面
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          {isRegister ? "Create an account" : "Sign in to your account"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div>
                <label className="block text-sm/6 font-medium text-gray-900">Register as:</label>
                <select
                  name="type"
                  required
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 appearance-none"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="" disabled>Choose your role</option>
                  <option value="consumer">Customer</option>
                  <option value="restaurant">Vendor</option>
                </select>
              </div>

              <FormInput
                label={formData.type === "restaurant" ? "Restaurant Name" : "Username"}
                type="text"
                name="nick_name"
                value={formData.nick_name}
                onChange={handleChange}
                required
              />
            </>
          )}

          <FormInput
            label="Login ID"
            type="text"
            name="login_id"
            value={formData.login_id}
            onChange={handleChange}
            required
          />

          <FormInput
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required={isRegister}
          />

          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {isRegister ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          {isRegister ? "Already have an account?" : "Not a member?"}{" "}
          <button
            type="button"
            onClick={toggleForm}
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
