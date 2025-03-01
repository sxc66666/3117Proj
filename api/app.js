const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const authRouter = require("./routes/auth");
const vendorRouter = require("./routes/vendorRoutes");  // 🆕 添加商家 API
const app = express();

// 引入数据库初始化脚本
require('./initDb');  // 假设 initDb.js 放在项目根目录下

// ✅ 允许跨域访问（前端 React 连接 API）
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],  // ✅ 允许多个前端地址
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
app.use('/api/vendor', vendorRouter);  // 🆕 绑定商家 API 路由

// ✅ 处理 404 错误
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ 统一错误处理
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// API 路由：获取所有餐厅
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.restaurants');
    console.log("Fetched restaurants:", result.rows); // 打印查询结果到控制台
    res.json(result.rows);    // 返回查询结果
  } catch (err) {
    console.error('Database error:', err);  // 打印错误信息
    res.status(500).send('Error fetching data');
  }
});

// API 路由：获取指定餐厅的食品数据
app.get('/api/foods/:restaurantId', async (req, res) => {
    const { restaurantId } = req.params;  // 获取餐厅 ID
  
    try {
      // 根据餐厅 ID 查询食品数据
      const result = await pool.query('SELECT * FROM public.foods WHERE restaurant_id = $1', [restaurantId]);
      console.log("Fetched foods for restaurant:", result.rows);  // 打印查询结果到控制台
      res.json(result.rows);  // 返回食品数据
    } catch (err) {
      console.error('Database error:', err);  // 打印错误信息
      res.status(500).send('Error fetching food data');
    }
  });

module.exports = app;
