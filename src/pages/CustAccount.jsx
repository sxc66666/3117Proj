import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustAccount = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // 处理 profile_image 路径
      if (parsedUser.profile_image && parsedUser.profile_image.startsWith("F:\\")) {
        const filename = parsedUser.profile_image.split("\\").pop(); // 获取文件名
        parsedUser.profile_image = `http://localhost:5000/uploads/${filename}`;
      }

      setUser(parsedUser);
      setFormData({ ...parsedUser, password: "" }); // 不加载密码
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    const updatedUser = { ...user, ...formData };

    if (!formData.password) {
      delete updatedUser.password; // 不更新密码时，不发送 password 字段
    }

    try {
      const response = await fetch("http://localhost:5000/api/cust/update-Custuser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const result = await response.json();
        alert("User information updated successfully!");
        setUser(result.user); // 更新本地状态
        localStorage.setItem("user", JSON.stringify(result.user)); // 更新 localStorage
        setEditMode(false);
      } else {
        alert("Update failed, please try again!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Network error, update failed！");
    }
  };

  if (!user) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <button onClick={() => navigate("/")} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md">Back</button>
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
              type="text"
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
          <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-md">Save</button>
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
          <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-yellow-500 text-white rounded-md">Edit</button>
        </div>
      )}
    </div>
  );
};

export default CustAccount;
