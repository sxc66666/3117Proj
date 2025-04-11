const express = require("express");
const pool = require("../db/db");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// 用户登出并更新 last_login
router.post("/", async (req, res) => {

    console.log("Received request to logout user:", req.body);
    const { id } = req.body;
    console.log("User ID:", id);

  if (!id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    console.log("Updating last login for user:", id);
    const result = await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // 清除认证相关的cookie
    res.clearCookie('auth_token', { domain: process.env.DOMAIN });
    res.clearCookie('user_id', { domain: process.env.DOMAIN });

    console.log("User logged out successfully, last login updated");

    res.json({ message: "User logged out successfully, last login updated" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
