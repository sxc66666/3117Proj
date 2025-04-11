const express = require("express");
const bcrypt = require("bcryptjs"); // 使用 bcryptjs 兼容 Windows
const pool = require("../db/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const SALT_ROUNDS = 10;

const router = express.Router();

// 修改上传目录的路径
const uploadsDir = path.join(__dirname, '..', 'uploads');
const baseURL = "http://localhost:5000/uploads/";


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
  const profile_image = req.file ? req.file.path : null;

  try {
    // 检查用户是否已存在
    const userExists = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 使用bcrypt加密密码
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 插入新用户
    const result = await pool.query(
      "INSERT INTO users (login_id, password, nick_name, email, type, profile_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [login_id, hashedPassword, nick_name, email, type, profile_image]
    );

    if (type === "restaurant") {
      await pool.query(
        "INSERT INTO restaurants (name, image, id) VALUES ($1, $2, (SELECT id FROM users WHERE login_id = $3))",
        [nick_name, profile_image, login_id]
      );
    }

    res.json({
      message: "Registration successful",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ message: "Error registering user", error: error.message });
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

    // 使用bcrypt验证密码
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("❌ Password is invalid");
      return res.status(400).json({ message: "Invalid password" });
    }

    console.log("✅ Login successful for user:", user.login_id);

    // 获取 `restaurant_id`
    const restaurantResult = await pool.query("SELECT id FROM restaurants WHERE id = $1", [user.id]);
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
        restaurant_id: restaurant_id,
        description: null,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
});



module.exports = router;
