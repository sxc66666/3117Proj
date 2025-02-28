const express = require("express");
const bcrypt = require("bcryptjs"); // ✅ 使用 bcryptjs 兼容 Windows
const { Pool } = require("pg");

const router = express.Router();

// 配置 PostgreSQL 连接
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "test_auth",
  password: "20040326", // ✅ 替换为你的 PostgreSQL 密码
  port: 5432,
});

// ✅ 用户注册 API
router.post("/register", async (req, res) => {
  const { login_id, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (login_id, password_hash) VALUES ($1, $2)", [login_id, hashedPassword]);
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
    const result = await pool.query("SELECT * FROM users WHERE login_id = $1", [login_id]);
    if (result.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(400).json({ message: "Invalid password" });

    res.json({ message: "Login successful", user: { id: user.id, login_id: user.login_id } });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ 查询所有用户 API
router.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, login_id FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
