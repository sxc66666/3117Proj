import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from '../components/useAuthSore';
import { useNavigate } from 'react-router-dom';
import FormInput from "../components/FormInput";

export default function Auth() {
  // Auth form state
  const [isRegister, setIsRegister] = useState(false); // true = register mode, false = login mode
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("consumer"); // default user type
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  // On mount, check if user already logged in via localStorage or cookie
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const cookieUserId = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*=\s*([^;]*).*$)|^.*$/, "$1");

    if (storedUser || cookieUserId) {
      try {
        const user = storedUser ? JSON.parse(storedUser) : null;

        if (!user?.type) {
          navigate("/");
          return;
        }

        // Redirect based on user type
        if (user.type === "consumer") {
          navigate("/cust/restaurants");
        } else if (user.type === "restaurant") {
          navigate("/vend/menu");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to parse user info:", error);
        navigate("/");
      }
    }
  }, [navigate]);

  // Switch between register and login mode, and reset all fields
  const toggleForm = () => {
    setIsRegister(prev => !prev);
    setLoginId("");
    setPassword("");
    setNickName("");
    setEmail("");
    setProfileImage(null);
    setMessage("");
  };

  // Handle form submission for login or register
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginId || !password) {
      setMessage("Login ID and Password are required.");
      return;
    }

    if (isRegister && !profileImage) {
      setMessage("Profile image is required for registration.");
      return;
    }

    const url = isRegister
      ? "http://localhost:5000/auth/register"
      : "http://localhost:5000/auth/login";

    try {
      let response;

      if (isRegister) {
        // Register: use FormData for file upload
        const formData = new FormData();
        formData.append("login_id", loginId);
        formData.append("password", password);
        formData.append("nick_name", nickName);
        formData.append("email", email);
        formData.append("type", type);
        formData.append("profile_image", profileImage);

        response = await axios.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Login: send JSON body
        const data = {
          login_id: loginId,
          password,
        };

        response = await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
      }

      setMessage(response.data.message);

      // On login success, store user info and redirect
      if (!isRegister) {
        const userData = response.data.user;
        setUser(userData);
        document.cookie = `user_id=${userData.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
        localStorage.setItem("user", JSON.stringify(userData));

        if (userData.type === "consumer") {
          navigate("/cust/restaurants");
        } else if (userData.type === "restaurant") {
          navigate("/vend/menu");
        } else {
          navigate("/");
        }
      } else {
        // After successful registration, switch to login mode
        toggleForm();
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-96 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-xl font-semibold mb-4">
          {isRegister ? "Register" : "Login"}
        </h2>
        {message && <div className="text-center text-red-500 mb-2">{message}</div>}
        <form onSubmit={handleSubmit}>
          <FormInput label="Login ID" type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} required />

          {isRegister && (
            <>
              <FormInput label="Nick Name" type="text" value={nickName} onChange={(e) => setNickName(e.target.value)} required />
              <FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-900">User Type</label>
                <select
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="consumer">Consumer</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-900">Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </>
          )}

          <FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <button className="w-full mt-4 text-indigo-600" onClick={toggleForm}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
}