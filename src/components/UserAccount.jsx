// 图片逻辑还需debug

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/axiosInstance";

const API_URL = process.env.REACT_APP_API_URL; // read from .env file
if (!API_URL) {
  throw new Error('REACT_APP_API_URL is not defined in .env file');
}

const UserAccount = ({ userType = "cust", apiEndpoint, fields = [] }) => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      if (parsedUser.profile_image?.startsWith("F:\\")) {
        const filename = parsedUser.profile_image.split("\\").pop();
        parsedUser.profile_image = `${API_URL}/uploads/${filename}`;
      }

      const initialFormData = { ...parsedUser, password: "" };
      fields.forEach(field => {
        if (!(field in initialFormData)) initialFormData[field] = "";
      });

      setUser(parsedUser);
      setFormData(initialFormData);
    }
  }, [fields]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...formData };
    if (!formData.password) delete updatedUser.password;
  
    try {
      const response = await axiosInstance.put(apiEndpoint, updatedUser);
  
      alert("User information updated successfully!");
      const result = response.data;
      setUser(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));
      setEditMode(false);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Update failed, please try again!");
    }
  };

  if (!user) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl w-full p-6 bg-white shadow-md rounded-lg">
        <button onClick={() => navigate("/")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Back
        </button>

        {editMode ? (
          <div className="space-y-4">
            <label className="block">
              Nick Name:
              <input
                type="text"
                name="nick_name"
                value={formData.nick_name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            <label className="block">
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            <label className="block">
              Password:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </label>

            {fields.includes("description") && (
              <label className="block">
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </label>
            )}

            <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md">
              Save
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700">Login ID: {user.login_id}</p>
            <p className="text-gray-700">Nick Name: {user.nick_name}</p>
            <p className="text-gray-700">Email: {user.email}</p>
            <p className="text-gray-700">Type: {user.type}</p>
            <img
              src={user.profile_image || "/default-avatar.png"}
              alt="Profile"
              onError={(e) => { e.target.src = "/default-avatar.png"; }}
              className="w-36 h-36 rounded-full mx-auto"
            />
            {fields.includes("description") && (
              <p className="text-gray-600 whitespace-pre-line">{user.description}</p>
            )}
            <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">
              Edit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
