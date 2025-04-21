import React, { useState, useEffect } from "react";
import axiosInstance from '../config/axiosInstance';
import useAuthStore from '../components/useAuthStore';
import { useNavigate } from 'react-router-dom';
import FormInput from "../components/FormInput";
import HCaptcha from '@hcaptcha/react-hcaptcha';

// 密码强度指示器组件
const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  const strengthText = ["非常弱", "弱", "中等", "强", "非常强"][strength - 1] || "未输入";
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500"
  ][strength - 1] || "bg-gray-200";

  // 检查各项要求
  const requirements = [
    { text: "至少8个字符", met: password.length >= 8 },
    { text: "包含大写字母", met: /[A-Z]/.test(password) },
    { text: "包含小写字母", met: /[a-z]/.test(password) },
    { text: "包含数字", met: /\d/.test(password) },
    { text: "包含特殊字符", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  return (
    <div className="mt-2">
      <div className="flex gap-1 h-2">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`flex-1 rounded ${
              level <= strength ? strengthColor : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        密码强度: {strengthText}
      </p>
      <div className="mt-2 space-y-1">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center text-xs">
            <span className={`mr-1 ${req.met ? "text-green-500" : "text-gray-400"}`}>
              {req.met ? "✓" : "○"}
            </span>
            <span className={req.met ? "text-gray-600" : "text-gray-400"}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Auth() {
  // Auth form state
  const [isRegister, setIsRegister] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("consumer");
  // const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

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
    setConfirmPassword("");
    setNickName("");
    setEmail("");
    //setProfileImage(null);
    setMessage("");
    setShowPasswordRequirements(false);
  };

  // Handle form submission for login or register
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginId || !password) {
      setMessage("Login ID and Password are required.");
      return;
    }

    if (isRegister) {
      // if (!profileImage) {
      //   setMessage("Profile image is required for registration.");
      //   return;
      // }
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        return;
      }
    }

    const url = isRegister
      ? "/api/auth/register"
      : "/api/auth/login";

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
        // formData.append("profile_image", profileImage);

        response = await axiosInstance.post(url, formData, {
          headers: { "Content-Type": "application/json" },
        });
      } else {
        // Login: send JSON body
        const data = {
          login_id: loginId,
          password,
        };

        response = await axiosInstance.post(url, data, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        });
      }

      setMessage(response.data.message);

      // On login success, store user info and redirect
      if (!isRegister) {
        const userData = response.data.user;
        setUser(userData);
        document.cookie = `user_id=${userData.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
        localStorage.setItem("user", JSON.stringify(userData));

        if (!userData.profile_image) {
          navigate("/upload-avatar");
        } else if (userData.type === "consumer") {
          navigate("/cust/restaurants");
        } else if (userData.type === "restaurant") {
          navigate("/vend/menu");
        } else {
          navigate("/");
        }
        // if (userData.type === "consumer") {
        //   navigate("/cust/restaurants");
        // } else if (userData.type === "restaurant") {
        //   navigate("/vend/menu");
        // } else {
        //   navigate("/");
        // }
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
      <div className="relative flex items-center">
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
                {/* 
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-900">Profile Image</label>
                  <input
                    type="file"
                    onChange={(e) => setProfileImage(e.target.files[0])}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                 */}
              </>
            )}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isRegister && !showPasswordRequirements) {
                    setShowPasswordRequirements(true);
                  }
                }}
                onFocus={() => {
                  if (isRegister) {
                    setIsPasswordFocused(true);
                  }
                }}
                onBlur={() => {
                  if (isRegister && !password) {
                    setIsPasswordFocused(false);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            {isRegister && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-900">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              {isRegister ? "Register" : "Login"}
            </button>
          </form>
          <button
            onClick={toggleForm}
            className="w-full mt-2 text-blue-500 hover:text-blue-600"
          >
            {isRegister ? "Already have an account? Login" : "Need an account? Register"}
          </button>
        </div>

        {/* 密码强度指示器 */}
        {isRegister && isPasswordFocused && (
          <div className="absolute left-[420px] w-64 bg-white p-4 rounded-lg shadow-md h-fit">
            <PasswordStrengthIndicator password={password} />
          </div>
        )}
      </div>
    </div>
  );
}