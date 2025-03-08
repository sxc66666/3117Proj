import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from '../store/useAuthSore';  // 引入 zustand store
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import 'bootstrap/dist/css/bootstrap.min.css'; // 引入 Bootstrap 样式

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);  // 切换注册/登录模式
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState(""); // 用户填写的昵称
  const [email, setEmail] = useState(""); // 用户填写的邮箱
  const [type, setType] = useState("consumer"); // 用户类型（默认为 'consumer'）
  const [profileImage, setProfileImage] = useState(null); // 上传的头像文件
  const [message, setMessage] = useState("");

  // 从 zustand store 中获取和设置认证状态
  const { user, setUser, logout } = useAuthStore();
  const navigate = useNavigate(); // 获取 navigate 函数

  useEffect(() => {
    // 优先从 localStorage 或 cookie 获取用户信息
    const storedUser = localStorage.getItem("user");
    const cookieUserId = document.cookie.replace(
      /(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  
    if (storedUser || cookieUserId) {
      try {
        // 解析存储的用户信息（如果存的是 JSON 格式）
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        if (!user || !user.type) {
          navigate("/"); // 兜底跳转，防止数据异常
          return;
        }
  
        // 根据用户类型跳转到不同的页面
        if (user.type === "consumer") {
          navigate(`/cust/restaurants`);  // 进入消费者页面
        } else if (user.type === "restaurant") {
          navigate(`/vend/menu`); // 进入商家菜单页面
        } else {
          navigate("/"); // 兜底跳转
        }
      } catch (error) {
        console.error("解析用户信息失败:", error);
        navigate("/"); // 解析错误时兜底跳转
      }
    }
  }, [navigate]);
  

  // 切换注册/登录状态
  const toggleForm = () => {
    setIsRegister(!isRegister);
    setLoginId("");
    setPassword("");
    setNickName("");
    setEmail("");
    setProfileImage(null);
    setMessage("");
  };

  // 表单提交
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 登录请求需要验证 loginId 和 password 是否为空
    if (!loginId || !password) {
      setMessage("Login ID and Password are required.");
      return;
    }

    const url = isRegister
      ? "http://localhost:9000/auth/register"
      : "http://localhost:9000/auth/login";

    const data = {
      login_id: loginId,
      password: password,
      nick_name: nickName,
      email: email,
      type: type,
    };

    // 仅在注册时检查头像文件
    if (isRegister && !profileImage) {
      setMessage("Profile image is required for registration.");
      return;
    }

    try {
      let response;

      if (isRegister) {
        // 注册请求使用 FormData 处理文件上传
        const formData = new FormData();
        formData.append("login_id", loginId);
        formData.append("password", password);
        formData.append("nick_name", nickName);
        formData.append("email", email);
        formData.append("type", type);
        if (profileImage) {
          formData.append("profile_image", profileImage);
        }

        // 注册请求
        response = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 仅注册时使用 multipart/form-data
          },
        });
      } else {
        // 登录请求使用 JSON 格式
        response = await axios.post(url, data, {
          headers: {
            "Content-Type": "application/json", // 登录时使用 application/json
          },
        });
      }

      setMessage(response.data.message);


      if (!isRegister) {
        setUser(response.data.user);
      
        // 设置 Cookie 以存储 user_id
        document.cookie = `user_id=${response.data.user.id}; path=/; max-age=${60 * 60 * 24 * 30}`;
        localStorage.setItem("user", JSON.stringify(response.data.user));
      
        // 获取用户类型和 ID
        const userType = response.data.user.type;
        const restaurantId = response.data.user.id; // 假设用户ID是 restaurantId
      
        if (userType === "consumer") {
          navigate(`/cust/restaurants`);  // 进入消费者页面
        } else if (userType === "restaurant") {
          navigate(`/vend/menu`); // 进入商家菜单页面
        } else {
          navigate("/"); // 兜底跳转
        }
      } else {
        toggleForm();
      }
      
      
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  // 退出登录
  const handleLogout = () => {
    logout(); // 调用 zustand store 中的 logout
    document.cookie = "user_id=; path=/; max-age=-1"; // 删除 cookie
    localStorage.removeItem("user"); // 清除 localStorage
    navigate("/"); // 重定向到首页或登录页
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">{isRegister ? "Register" : "Login"}</h2>
        
        {message && <div className="alert alert-info text-center">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />
          </div>

          {isRegister && (
            <>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nick Name"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-3">
                <select
                  className="form-control"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="consumer">Consumer</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setProfileImage(e.target.files[0])}
                />
              </div>
            </>
          )}

          <div className="form-group mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="text-center mt-3">
          {isRegister ? (
            <button className="btn btn-link" onClick={toggleForm}>
              Already have an account? Login
            </button>
          ) : (
            <button className="btn btn-link" onClick={toggleForm}>
              Don't have an account? Register
            </button>
          )}
        </div>

        {user && !isRegister && (
          <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}