import React, { useState, useEffect } from "react";
import axiosInstance from '../config/axiosInstance';
// import useAuthStore from '../components/useAuthStore';
import { useNavigate } from 'react-router-dom';
import FormInput from "../components/FormInput";
// import HCaptcha from '@hcaptcha/react-hcaptcha';

// Password Strength Indicator Component
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
  const strengthText = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][strength - 1] || "Not Entered";
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500"
  ][strength - 1] || "bg-gray-200";

  // Check requirements
  const requirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { text: "Contains number", met: /\d/.test(password) },
    { text: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
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
        Password Strength: {strengthText}
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

  // const { setUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await axiosInstance.get("/api/getUser", { withCredentials: true });
        const userData = response.data.user;

        if (!userData.type) {
          navigate("/");
          return;
        }

        if (userData.type === "consumer") {
          navigate("/cust/restaurants");
        } else if (userData.type === "restaurant") {
          navigate("/vend/menu");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("User not logged in:", error);
      }
    };

    checkUserLoggedIn();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      if (!isRegister) {
        const userData = response.data.user;
        // setUser(userData);

        if (!userData.profile_image) {
          navigate("/upload-avatar");
        } else if (userData.type === "consumer") {
          navigate("/cust/restaurants");
        } else if (userData.type === "restaurant") {
          navigate("/vend/menu");
        } else {
          navigate("/");
        }
      } else {
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

        {/* Password Strength Indicator */}
        {isRegister && isPasswordFocused && (
          <div className="absolute left-[420px] w-64 bg-white p-4 rounded-lg shadow-md h-fit">
            <PasswordStrengthIndicator password={password} />
          </div>
        )}
      </div>
    </div>
  );
}
