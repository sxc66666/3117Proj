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
  database: "food_ordering_system",
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

    
    // 获取上传的文件路径，如果文件不存在，使用 null 或者默认头像路径
    const profile_image = req.file ? req.file.path : null;  // 如果没有文件上传，则为 null

    // 插入用户信息到数据库
    await pool.query(
      "INSERT INTO users (login_id, password, nick_name, email, type, profile_image) VALUES ($1, $2, $3, $4, $5, $6)",
      [login_id, password, nick_name, email, type, profile_image]
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

  console.log("Received login request:", req.body);

  try {
    console.log("Querying database for login_id:", login_id);
    const result = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);

    console.log("Database query result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = result.rows[0];

    console.log("User found in database:", user);

    // ✅ 直接比对明文密码（仅限测试环境）
    if (password !== user.password) {
      console.log("❌ Password is invalid");
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful for user:", user.login_id);

    // 获取 `restaurant_id`
    const restaurantResult = await pool.query("SELECT id FROM restaurants WHERE owner_id = $1", [user.id]);
    const restaurant_id = restaurantResult.rows.length > 0 ? restaurantResult.rows[0].id : null;

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        login_id: user.login_id,
        nick_name: user.nick_name,
        email: user.email,
        type: user.type,
        profile_image: user.profile_image,
        restaurant_id: restaurant_id,  // ✅ 返回 `restaurant_id`
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
});



module.exports = router;
