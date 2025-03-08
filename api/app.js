const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const pool = require("./db/db");  // ✅ 确保数据库连接
const authRouter = require("./routes/auth");
const vendorRouter = require("./routes/vendorRoutes");
const orderRoutes = require("./routes/orders");  // 确保正确引入并设置路由

const app = express();

// 引入数据库初始化脚本
require('./initDb');  // initDb.js 放在项目根目录下

// ✅ 允许跨域访问
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],  // ✅ 允许多个前端地址
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger("dev"));

// ✅ 绑定 API 路由
app.use('/auth', authRouter);
app.use('/api/vendor', vendorRouter);
app.use("/api/orders", orderRoutes); 

// ✅ 获取所有餐厅（确保这个放在 `/auth` 和 `/vendor` 之后）
app.get('/api/restaurants', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.restaurants');
    console.log("Fetched restaurants:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: "Error fetching restaurants", details: err.message });
  }
});

// ✅ 获取指定餐厅的食品数据
app.get('/api/foods/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM public.foods WHERE restaurant_id = $1', [restaurantId]);
    console.log("Fetched foods for restaurant:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: "Error fetching food data", details: err.message });
  }
});

// ✅ 处理 404 错误（确保这个放在最后）
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// ✅ 统一错误处理
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

module.exports = app;
