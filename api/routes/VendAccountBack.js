// 用token内userid替换现有读取id逻辑    Done
// 去掉读取前端直接返回id逻辑           Done

const express = require("express");
const pool = require("../db/db"); // 连接到 PostgreSQL
const router = express.Router();
// const bcrypt = require("bcrypt"); // 用于密码加密
const dotenv = require("dotenv");
dotenv.config(); // 加载环境变量

const { updateVendUserSchema } = require('../validators/accountSchema');
const validate = require('../middleware/validate');

// const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

// 更新用户 + 餐厅 API
router.put("/vend/update-Venduser", validate(updateVendUserSchema), async (req, res) => {
  console.log("📥 收到供应商账户更新请求:", req.body);
  const { email, nick_name, type, profile_image, description } = req.body;

  // 已弃用 使用token读取id
  // 检查是否提供了用户 ID
  // if (!id) {
  //   return res.status(400).json({ message: "缺少用户 ID" });
  // }

  // 使用token读取id
  const idFromToken = req.user.id;

  const client = await pool.connect(); // 获取数据库连接

  try {
    await client.query("BEGIN"); // 开始事务

    // 获取当前用户数据
    const userResult = await client.query("SELECT * FROM users WHERE id = $1", [idFromToken]);

    // 如果用户不存在，回滚事务并返回 404
    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "用户不存在" });
    }

    const user = userResult.rows[0];

    // 只更新提供的字段，未提供的保持原值
    const updatedEmail = email || user.email;
    const updatedNickName = nick_name || user.nick_name;
    const updatedType = type || user.type;
    const updatedProfileImage = profile_image || user.profile_image;
    //const updatedPassword = password ? password : user.password; // 如果提供了新密码，则更新

    //const hashedPassword = await bcrypt.hash(updatedPassword, SALT_ROUNDS); // 使用 bcrypt 加密密码

    // 更新 users 表
    const updateUserQuery = `
      UPDATE users 
      SET email = $1, nick_name = $2, type = $3, profile_image = $4, updated_at = NOW() 
      WHERE id = $5 
      RETURNING *;
    `;
    const userValues = [
      updatedEmail,
      updatedNickName,
      updatedType,
      updatedProfileImage,
      //hashedPassword,
      idFromToken,
    ];

    const updatedUser = await client.query(updateUserQuery, userValues);

    // 如果提供了 description，则更新 restaurants 表
    if (description !== undefined) {
      await client.query(
        `UPDATE restaurants SET description = $1 WHERE id = $2`,
        [description, idFromToken]
      );
    }

    await client.query("COMMIT"); // 提交事务

    // 获取更新后的用户信息
    const finalUser = updatedUser.rows[0];

    res.json({ message: "用户和餐厅描述更新成功", user: finalUser });
  } catch (error) {
    await client.query("ROLLBACK"); // 发生错误时回滚
    console.error("更新用户和餐厅描述失败：", error);
    res.status(500).json({ message: "服务器错误" });
  } finally {
    client.release(); // 释放数据库连接
  }
});

module.exports = router;
