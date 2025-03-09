import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendAccount = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ password: "", description: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      // 处理 profile_image 路径
      if (parsedUser.profile_image && parsedUser.profile_image.startsWith("D:\\")) {
        const filename = parsedUser.profile_image.split("\\").pop(); // 获取文件名
        parsedUser.profile_image = `http://localhost:5000/uploads/${filename}`;
      }

      setUser(parsedUser);
      setFormData({ ...parsedUser, password: "", description: parsedUser.description || "" }); // 加载 description
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
      const response = await fetch("http://localhost:5000/api/Vend/update-Venduser", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const result = await response.json();
        alert("用户信息和描述更新成功！");
        setUser(result.user); // 更新本地状态
        localStorage.setItem("user", JSON.stringify(result.user)); // 更新 localStorage
        setEditMode(false);
      } else {
        alert("更新失败，请重试！");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("网络错误，更新失败！");
    }
  };

  if (!user) {
    return <p>加载中...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>返回</button>
      {editMode ? (
        <div>
          <label>
            Nick Name:
            <input
              type="text"
              name="nick_name"
              value={formData.nick_name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              cols="50"
            />
          </label>
          <button onClick={handleSave}>保存</button>
        </div>
      ) : (
        <div>
          <p>Login ID: {user.login_id}</p>
          <p>Nick Name: {user.nick_name}</p>
          <p>Email: {user.email}</p>
          <p>Type: {user.type}</p>

          <img
            src={user.profile_image || "/default-avatar.png"}
            alt="Profile"
            onError={(e) => { e.target.src = "/default-avatar.png"; }}
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />

          <p> {user.description}</p>

          <button onClick={() => setEditMode(true)}>修改</button>
        </div>
      )}
    </div>
  );
};

export default VendAccount;
