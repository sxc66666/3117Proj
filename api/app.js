const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const cookieParser = require("cookie-parser");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  throw new Error('FRONTEND_URL is not defined in .env file');
}

// 导入路由
const authRouter = require("./routes/auth");
const vendorRouter = require("./routes/vendorRoutes");
const logoutRouter = require("./routes/logout");
const orderRoutes = require("./routes/orders");
const custAccountRoutes = require("./routes/custAccountBack");
const vendAccountRoutes = require("./routes/vendAccountBack");
const restaurantRoutes = require("./routes/restaurantFood");
const verifyCaptchaRouter = require("./routes/verifyCaptcha");

// 导入中间件
const authToken = require("./middleware/authToken");
const { rateLimitMiddleware, limiter } = require("./middleware/rateLimit");

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
    origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // 解析请求体
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  
  // 静态文件服务
  const uploadsPath = path.join(__dirname, 'uploads');
  console.log(`📂 Serving static files from: ${uploadsPath}`);
  app.use('/uploads', express.static(uploadsPath));

  // 使用helmet保护应用 默认配置
  app.use(helmet());
  // 禁用 XSS 过滤器
  app.use(helmet.xssFilter({ setOnOldIE: true }));
  // 防止点击劫持（Clickjacking）
  app.use(helmet.frameguard({ action: 'deny' }));
  // 防止 MIME 类型嗅探
  app.use(helmet.noSniff());
  // 禁用 HTTP-Powered-By 信息
  app.use(helmet.hidePoweredBy());
  // 禁用 DNS 预取
  app.use(helmet.dnsPrefetchControl({ allow: false }));

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],         // 只允许同源加载资源
        scriptSrc: ["'self'"],  // 允许从指定域加载脚本
        styleSrc: ["'self'"],  // 允许加载同源和内联样式
        objectSrc: ["'none'"],          // 禁止嵌套对象
        connectSrc: ["'self'"],         // 只允许从同源请求
        fontSrc: ["'self'"],            // 只允许加载同源字体
        frameSrc: ["'none'"],           // 禁止嵌套框架
        // upgradeInsecureRequests: [],    // 强制将 HTTP 请求升级为 HTTPS
      },
    })
  );
  

};

// 配置路由
const configureRoutes = () => {
  // 验证码相关路由
  app.use('/api', verifyCaptchaRouter);

  // 应用请求频率限制中间件
  app.use(limiter);

  // 应用自定义的 rateLimitMiddleware
  app.use(rateLimitMiddleware);

  // 认证相关路由
  app.use('/api/auth', authRouter);

  // 认证中间件
  app.use(authToken); // pages below this middleware must be authenticated

  // 登出相关路由
  app.use('/api/logout', logoutRouter); // only legitimate user can ask for clearing cookies to prevent attacks
  
  // 账户相关路由
  app.use('/api', custAccountRoutes);
  app.use('/api', vendAccountRoutes);
  
  // 订单相关路由
  app.use("/api/orders", orderRoutes);
  
  // 餐厅相关路由
  app.use('/api', restaurantRoutes);
  
  // 供应商相关路由
  app.use('/api/vendor', vendorRouter);
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
