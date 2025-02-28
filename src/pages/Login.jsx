import React, { useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Auth() {
  const [isRegister, setIsRegister] = useState(false);  // Toggle between Register/Login
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState(""); // User Nickname
  const [email, setEmail] = useState(""); // User Email
  const [type, setType] = useState("consumer"); // User Type (default is 'consumer')
  const [profileImage, setProfileImage] = useState(null); // Uploaded Profile Image
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("未选择文件"); // Default text for no file selected
  const [fileError, setFileError] = useState(""); // To store error message for file input

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setLoginId("");
    setPassword("");
    setNickName("");
    setEmail("");
    setProfileImage(null);
    setFileName("未选择文件");
    setFileError(""); // Reset file error
    setMessage("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Display the name of the selected file
      setProfileImage(file); // Save the file to state
      setFileError(""); // Reset file error if a file is selected
    } else {
      setFileName("未选择文件"); // Reset to default text if no file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a file is selected when registering
    if (isRegister && !profileImage) {
      setFileError("文件不能为空");
      return;
    }

    const url = isRegister
      ? "http://localhost:9000/auth/register"
      : "http://localhost:9000/auth/login";

    if (!loginId || !password) {
      setMessage("Login ID and Password are required.");
      return;
    }

    const formData = new FormData();
    formData.append("login_id", loginId);
    formData.append("password", password);
    formData.append("nick_name", nickName);
    formData.append("email", email);
    formData.append("type", type);
    if (profileImage) {
      formData.append("profile_image", profileImage);
    }

    try {
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure it's multipart/form-data
        },
      });

      setMessage(response.data.message);
      if (!isRegister) {
        document.cookie = `user_id=${response.data.user.id}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30-day cookie
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data
        window.location.href = "cust/restaurants";  // Redirect on successful login
      } else {
        toggleForm(); // Switch to login after successful registration
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "350px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4">{isRegister ? "Create an Account" : "Sign In"}</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
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
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nick Name"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="consumer">Consumer</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                {fileError && <small className="text-danger">{fileError}</small>} {/* Display file error message */}
                <small className="text-muted">{fileName}</small> {/* Display file name here */}
              </div>
            </>
          )}

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3" style={{ backgroundColor: "#4C6BFE" }}>
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {message && <div className="alert alert-info mt-2">{message}</div>}

        <div className="text-center">
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
      </div>
    </div>
  );
}


// import React, { useState } from "react";
// import axios from "axios";

// export default function Auth() {
//   const [isRegister, setIsRegister] = useState(false);  // 切换注册/登录模式
//   const [loginId, setLoginId] = useState("");
//   const [password, setPassword] = useState("");
//   const [nickName, setNickName] = useState(""); // 用户填写的昵称
//   const [email, setEmail] = useState(""); // 用户填写的邮箱
//   const [type, setType] = useState("consumer"); // 用户类型（默认为 'consumer'）
//   const [profileImage, setProfileImage] = useState(null); // 上传的头像文件
//   const [message, setMessage] = useState("");

//   const toggleForm = () => {
//     setIsRegister(!isRegister);
//     setLoginId("");
//     setPassword("");
//     setNickName("");
//     setEmail("");
//     setProfileImage(null);
//     setMessage("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const url = isRegister
//       ? "http://localhost:9000/auth/register"
//       : "http://localhost:9000/auth/login";

//     // 检查登录时，login_id 和 password 是否为空
//     if (!loginId || !password) {
//       setMessage("Login ID and Password are required.");
//       return;
//     }

//     const data = {
//       login_id: loginId,
//       password: password,
//     };

//     if (isRegister) {
//       // 如果是注册，还需要其他字段
//       data.nick_name = nickName;
//       data.email = email;
//       data.type = type;
//       if (profileImage) {
//         data.profile_image = profileImage; // 不上传文件，而是处理头像图片
//       }
//     }

//     try {
//       const response = await axios.post(url, data, {
//         headers: {
//           "Content-Type": "application/json", // 发送 JSON 数据
//         },
//       });

//       setMessage(response.data.message);
//       if (!isRegister) {
//         // 登录成功后设置 cookie 和 localStorage
//         document.cookie = `user_id=${response.data.user.id}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30天有效期
//         localStorage.setItem("user", JSON.stringify(response.data.user)); // 将用户数据存储在 localStorage 中
//         window.location.href = "cust/restaurants";  // 登录后跳转
//       } else {
//         toggleForm();  // 注册成功后切换到登录
//       }
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Error occurred");
//     }
//   };

//   const handleLogout = () => {
//     document.cookie = "user_id=; path=/; max-age=-1"; // 删除 cookie
//     localStorage.removeItem("user"); // 清除 localStorage
//     window.location.href = "/"; // 重定向到首页或登录页
//   };

//   return (
//     <div>
//       <h2>{isRegister ? "Register" : "Login"}</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Login ID"
//           value={loginId}
//           onChange={(e) => setLoginId(e.target.value)}
//           required
//         />
//         {isRegister && (
//           <>
//             <input
//               type="text"
//               placeholder="Nick Name"
//               value={nickName}
//               onChange={(e) => setNickName(e.target.value)}
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//             <select
//               value={type}
//               onChange={(e) => setType(e.target.value)}
//               required
//             >
//               <option value="consumer">Consumer</option>
//               <option value="restaurant">Restaurant</option>
//             </select>

//             {/* 文件上传框 */}
//             <input
//               type="file"
//               onChange={(e) => setProfileImage(e.target.files[0])} // 设置选择的文件
//             />
//           </>
//         )}
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />
//         <button type="submit">{isRegister ? "Register" : "Login"}</button>
//       </form>

//       {message && <p>{message}</p>}

//       {isRegister ? (
//         <button onClick={toggleForm}>
//           Already have an account? Login
//         </button>
//       ) : (
//         <button onClick={toggleForm}>
//           Don't have an account? Register
//         </button>
//       )}

//       {/* 如果已经登录，显示登出按钮 */}
//       {localStorage.getItem("user") && !isRegister && (
//         <button onClick={handleLogout}>Logout</button>
//       )}
//     </div>
//   );
// }


