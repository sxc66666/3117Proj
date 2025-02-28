const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRouter = require("./routes/auth");

const app = express();

// 引入数据库初始化脚本
require('./initDb');  // 假设 initDb.js 放在项目根目录下

// ✅ 允许跨域访问（前端 React 连接 API）
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ 解析 JSON 和 Cookies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ 日志记录
app.use(logger("dev"));

// ✅ 绑定 API 路由
app.use('/auth', authRouter);

// ✅ 处理 404 错误
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ 统一错误处理
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
