const express = require("express");
const bcrypt = require("bcryptjs"); // 使用 bcryptjs 兼容 Windows
const pool = require("../db/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

// Valdators
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/authSchema');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS); // 使用 parseInt 将字符串转换为整数
if (!SALT_ROUNDS) {
  throw new Error('SALT_ROUNDS is not defined in .env file');
}

const router = express.Router();

// 修改上传目录的路径
const uploadsDir = path.join(__dirname, '..', 'uploads');


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

// 密码强度验证函数
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  if (password.length < minLength) {
    errors.push(`密码长度至少为${minLength}个字符`);
  }
  if (!hasUpperCase) errors.push("需要包含大写字母");
  if (!hasLowerCase) errors.push("需要包含小写字母");
  if (!hasNumbers) errors.push("需要包含数字");
  if (!hasSpecialChar) errors.push("需要包含特殊字符");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ✅ 用户注册 API
router.post("/register", validate(registerSchema) ,async (req, res) => {
  const { login_id, password, nick_name, email, type } = req.body;

  try {
    // 验证密码强度
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: "密码强度不足",
        errors: passwordValidation.errors
      });
    }

    // 检查用户是否已存在
    const userExists = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 使用bcrypt加密密码
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 插入新用户
    const result = await pool.query(
      "INSERT INTO users (login_id, password, nick_name, email, type) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [login_id, hashedPassword, nick_name, email, type]
    );

    if (type === "restaurant") {
      await pool.query(
        "INSERT INTO restaurants (name, image, id) VALUES ($1, null, (SELECT id FROM users WHERE login_id = $2))",
        [nick_name, login_id] // 需要处理新建用户如果是商家类型，但是自己上传头像没加进来image为null的时候从users表读取
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
router.post("/login", validate(loginSchema), async (req, res) => {
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

    // 验证成功后，创建 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        login_id: user.login_id,
        nick_name: user.nick_name,
        email: user.email,
        type: user.type,
        profile_image: user.profile_image,
        restaurant_id: restaurant_id,
        description: null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 使用 httpOnly cookie 设置 token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // 生产环境使用 HTTPS ！！！！以后必须修改这个
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24小时
      domain: process.env.DOMAIN // 设置 cookie 的域名 !!!!!!! 以后必须修改这个
    });
    console.log('Token set:', token);


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
