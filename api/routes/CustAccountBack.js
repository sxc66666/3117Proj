// 用token内userid替换现有读取id逻辑    Done
// 去掉读取前端直接返回id逻辑           Done
// 增加用户图片返回api                  X

const express = require("express");
const pool = require("../db/db"); // 连接 PostgreSQL 的 db.js
const router = express.Router();
const bcrypt = require("bcrypt"); // 用于密码加密
const dotenv = require("dotenv");
dotenv.config(); // 加载环境变量

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

// 更新用户信息 API
router.put("/cust/update-Custuser", async (req, res) => {
  console.log("📥 收到客户账户更新请求:", req.body);
  const { email, nick_name, type, profile_image, password } = req.body;

  // 已弃用 使用token读取id
  // // 检查是否提供了用户 ID
  // if (!id) {
  //   return res.status(400).json({ message: "缺少用户 ID" });
  // }

  // 使用token读取id
  const idFromToken = req.user.id;

  try {
    // 获取当前用户数据
    const userResult = await pool.query("SELECT * FROM users WHERE id = $1", [idFromToken]);

    // 如果没有找到该用户，返回 404
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "用户不存在" });
    }

    const user = userResult.rows[0];

    // 只更新提供的字段，未提供的保持原值
    const updatedEmail = email || user.email;
    const updatedNickName = nick_name || user.nick_name;
    const updatedType = type || user.type;
    const updatedProfileImage = profile_image || user.profile_image;
    const updatedPassword = password ? password : user.password; // 如果提供了新密码，则更新

    const hashedPassword = await bcrypt.hash(updatedPassword, SALT_ROUNDS); // 使用 bcrypt 加密密码

    // 更新 SQL 语句
    const updateQuery = `
      UPDATE users 
      SET email = $1, nick_name = $2, type = $3, profile_image = $4, password = $5, updated_at = NOW() 
      WHERE id = $6 
      RETURNING *;
    `;

    const values = [
      updatedEmail,
      updatedNickName,
      updatedType,
      updatedProfileImage,
      hashedPassword,
      idFromToken,
    ];

    // 执行更新操作
    const result = await pool.query(updateQuery, values);

    // 返回更新后的用户数据
    res.json({ message: "用户更新成功", user: result.rows[0] });
  } catch (error) {
    console.error("更新用户失败：", error);
    res.status(500).json({ message: "服务器错误" });
  }
});

module.exports = router;
