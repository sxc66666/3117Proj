const express = require("express");
const router = express.Router();
const pool = require("../db/db");

router.get("/getUser", async (req, res) => {
    // api返回token里的user object
    if (!req.user) {
      return res.status(401).json({ message: "未授权访问" });
    }
    pool.query("SELECT id,login_id,email,nick_name,type,profile_image,created_at FROM users WHERE id = $1", [req.user.id], (err, result) => {
      if (err) {
        console.error("获取用户信息失败:", err);
        return res.status(500).json({ message: "服务器错误" });
      }
  
      // 如果没有找到该用户，返回 404
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "用户不存在" });
      }
  
      const user = result.rows[0];
  
      // 返回用户信息
      res.json({ message: "获取用户信息成功", user });
    }
    );
  }
  );

module.exports = router;