const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const path = require("path");

// 导入路由
const authRouter = require("./routes/auth");
const vendorRouter = require("./routes/vendorRoutes");
const logoutRouter = require("./routes/logout");
const orderRoutes = require("./routes/orders");
const custAccountRoutes = require("./routes/custAccountBack");
const vendAccountRoutes = require("./routes/vendAccountBack");
const restaurantRoutes = require("./routes/restaurantFood");

// 导入数据库初始化脚本
const { createTable } = require('./db/initDb');

// 创建Express应用
const app = express();

// 配置中间件
const configureMiddleware = () => {
  // 启用cookie解析
  app.use(cookieParser());
  
  // 配置CORS
  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
  }));
  
  // 解析请求体
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // 静态文件服务
  const uploadsPath = path.join(__dirname, 'uploads');
  console.log(`📂 Serving static files from: ${uploadsPath}`);
  app.use('/uploads', express.static(uploadsPath));
};

// 配置路由
const configureRoutes = () => {
  // 认证相关路由
  app.use('/api/auth', authRouter);
  app.use('/api/vendor', vendorRouter);
  app.use('/api/logout', logoutRouter);
  
  // 账户相关路由
  app.use('/api', custAccountRoutes);
  app.use('/api', vendAccountRoutes);
  
  // 订单相关路由
  app.use("/api/orders", orderRoutes);
  
  // 餐厅相关路由
  app.use('/api', restaurantRoutes);
};

// 配置错误处理
const configureErrorHandling = () => {
  // 处理404错误
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });
  
  // 统一错误处理
  app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
  });
};

// 初始化应用
const initializeApp = () => {
  configureMiddleware();
  configureRoutes();
  configureErrorHandling();
};

// 执行初始化
initializeApp();

module.exports = app;
