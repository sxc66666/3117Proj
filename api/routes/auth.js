const express = require("express");
const bcrypt = require("bcryptjs"); // 使用 bcryptjs 兼容 Windows
const { Pool } = require("pg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_auth",
  password: "12345", // 修改为你的 PostgreSQL 密码
  port: 5432,
});

// 设置上传目录的路径
const uploadsDir = path.join(__dirname, 'uploads');

// 确保 uploads 目录存在，如果没有则创建它
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // { recursive: true } 确保可以创建多级目录
}

// 配置 multer 来处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // 使用 `uploads` 目录
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用当前时间戳作为文件名
  },
});

const upload = multer({ storage: storage });

// ✅ 用户注册 API
router.post("/register", upload.single("profile_image"), async (req, res) => {
  const { login_id, password, nick_name, email, type } = req.body;
  const profile_image = req.file ? req.file.path : null; // 获取上传的文件路径

  // 检查是否传递了密码
  if (!password || password === "") {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // 检查必填字段
    if (!login_id || !nick_name || !email || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 检查 login_id 是否已经存在
    const existingUserByLoginId = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);
    if (existingUserByLoginId.rows.length > 0) {
      return res.status(400).json({ message: "Login ID already exists" });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 插入用户信息到数据库
    await pool.query(
      "INSERT INTO users (login_id, password_hash, nick_name, email, type, profile_image) VALUES ($1, $2, $3, $4, $5, $6)",
      [login_id, hashedPassword, nick_name, email, type, profile_image]
    );

    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// ✅ 用户登录 API
router.post("/login", async (req, res) => {
  const { login_id, password } = req.body;

  try {
    // 查询数据库，获取用户信息
    const result = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);

    // 如果用户不存在，返回错误
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 使用 bcrypt.compare 比较密码
    const isValid = await bcrypt.compare(password, user.password_hash); // 这里验证密码

    if (!isValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 登录成功，返回用户信息
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        login_id: user.login_id,
        nick_name: user.nick_name,
        email: user.email,
        type: user.type,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
