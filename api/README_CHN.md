# 后端API文档

## 一、项目概述

该项目是一个外卖应用的后端系统，实现了用户认证、餐厅管理、菜单管理、订单处理等核心功能。系统采用Node.js + Express框架开发，集成了多种安全措施，包括用户认证、授权、CSRF保护、请求频率限制、XSS防护等。

## 二、项目结构

### 1. 目录结构

```
api/
├── app.js                 // 应用程序主入口文件
├── package.json           // 项目依赖配置
├── bin/                   // 运行脚本目录
│   └── www                // 服务器启动文件
├── db/                    // 数据库相关文件
│   ├── db.js              // 数据库连接配置
│   └── initDb.js          // 数据库初始化脚本
├── middleware/            // 中间件目录
│   ├── authorize.js       // 角色授权中间件
│   ├── authToken.js       // JWT验证中间件
│   ├── rateLimit.js       // 请求频率限制中间件
│   └── validate.js        // 请求验证和XSS防护中间件
├── public/                // 静态资源目录
│   └── stylesheets/
│       └── style.css
├── routes/                // 路由文件目录
│   ├── auth.js            // 认证相关路由
│   ├── CustAccountBack.js // 顾客账户相关路由
│   ├── logout.js          // 登出相关路由
│   ├── orders.js          // 订单相关路由
│   ├── profileImage.js    // 头像上传相关路由
│   ├── restaurantFood.js  // 餐厅和食品相关路由
│   ├── user.js            // 用户信息相关路由
│   ├── VendAccountBack.js // 商家账户相关路由
│   ├── vendorRoutes.js    // 商家其他路由
│   └── verifyCaptcha.js   // 验证码验证路由
├── uploads/               // 上传文件保存目录
└── validators/            // 验证器目录
    ├── accountSchema.js   // 账户相关验证模式
    ├── authSchema.js      // 认证相关验证模式
    ├── captchaSchema.js   // 验证码相关验证模式
    ├── menuSchema.js      // 菜单相关验证模式
    ├── orderSchema.js     // 订单相关验证模式
    └── restaurantSchema.js// 餐厅相关验证模式
```

### 2. 技术栈

- **后端框架**: Express.js
- **数据库**: PostgreSQL
- **认证**: JWT (JSON Web Tokens)
- **密码加密**: bcryptjs
- **安全组件**: 
  - helmet (HTTP头部安全)
  - csurf (CSRF防护)
  - xss (XSS防护)
  - express-rate-limit (请求频率限制)
  - express-validator (请求数据验证)
- **验证码**: hCaptcha

## 三、API功能设计

### 1. 用户认证与授权

#### 1.1 注册API

- **路由**: POST /api/auth/register
- **功能**: 用户注册（消费者/餐厅）
- **安全措施**: 
  - 输入验证(express-validator)
  - 密码强度校验
  - 密码哈希加密(bcryptjs)
  - XSS防护
- **参数验证**:
  - login_id: 用户登录ID
  - password: 密码（必须包含大小写字母、数字、特殊字符）
  - nick_name: 用户昵称
  - email: 邮箱
  - type: 用户类型（consumer/restaurant）

#### 1.2 登录API

- **路由**: POST /api/auth/login
- **功能**: 用户登录，返回JWT令牌
- **安全措施**: 
  - 输入验证
  - 密码比对(bcrypt.compare)
  - httpOnly Cookie
  - XSS防护
- **参数验证**:
  - login_id: 用户登录ID
  - password: 密码

#### 1.3 登出API

- **路由**: POST /api/logout
- **功能**: 用户登出
- **安全措施**: 
  - 需要JWT验证
  - 清除认证Cookie

### 2. 用户管理

#### 2.1 用户个人资料管理

- **路由**: GET/PUT /api/user
- **功能**: 获取/更新用户信息
- **安全措施**: 
  - 需要JWT验证
  - 输入验证
  - XSS防护

#### 2.2 头像上传

- **路由**: POST /api/profile_image
- **功能**: 上传用户头像
- **安全措施**: 
  - 需要JWT验证
  - 文件类型验证
  - 文件大小限制

### 3. 餐厅与菜单管理

#### 3.1 餐厅信息管理

- **路由**: GET/PUT /api/restaurant
- **功能**: 获取/更新餐厅信息
- **安全措施**: 
  - 需要JWT验证
  - 角色验证(仅餐厅)
  - 输入验证

#### 3.2 菜单管理

- **路由**: GET/POST/PUT/DELETE /api/vendor/menu
- **功能**: 获取/添加/更新/删除菜单项
- **安全措施**: 
  - 需要JWT验证
  - 角色验证(仅餐厅)
  - 输入验证
  - XSS防护

### 4. 订单管理

#### 4.1 创建订单

- **路由**: POST /api/orders
- **功能**: 创建新订单
- **安全措施**: 
  - 需要JWT验证
  - 角色验证(仅消费者)
  - 输入验证
  - XSS防护

#### 4.2 获取订单

- **路由**: GET /api/orders
- **功能**: 获取用户订单列表
- **安全措施**: 
  - 需要JWT验证
  - 基于用户类型过滤订单

#### 4.3 更新订单状态

- **路由**: PUT /api/orders/:id
- **功能**: 更新订单状态
- **安全措施**: 
  - 需要JWT验证
  - 角色验证
  - 状态转换验证

### 5. 验证码验证

- **路由**: POST /api/verify-captcha
- **功能**: 验证hCaptcha响应，用于防止暴力攻击
- **安全措施**: 
  - 验证码验证
  - 请求频率限制重置

## 四、安全中间件详解

### 1. 认证中间件 (authToken.js)

```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 从 cookie 中获取 token
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access, token not found" });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 将解码后的用户信息添加到请求对象中
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
```

**功能说明**:
- 验证每个需要认证的请求
- 从httpOnly Cookie中获取JWT令牌
- 使用密钥验证令牌的有效性
- 将解码后的用户信息添加到请求对象中，供后续中间件和路由处理器使用
- 令牌无效或过期时返回适当的错误响应

### 2. 授权中间件 (authorize.js)

```javascript
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.type;

    if (!userRole) {
      return res.status(401).json({ error: "Unauthorized: Missing user role" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }

    next();
  };
};
```

**功能说明**:
- 基于用户角色(type)实现细粒度的权限控制
- 接受一个角色数组参数，指定允许访问的用户类型
- 验证当前用户是否具有访问特定路由的权限
- 未授权时返回403禁止访问响应

### 3. 请求频率限制中间件 (rateLimit.js)

```javascript
// 配置请求频率限制
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: MAX_REQUESTS, // 20次请求
  message: { message: 'Too many requests, please verify yourself' },
});

// 用于存储 IP 地址和 hCaptcha 状态
const captchaRequired = {};

const rateLimitMiddleware = async (req, res, next) => {
  // 如果 IP 请求数未超过阈值，则直接放行
  if (req.rateLimit.remaining > 0) {
    return next();
  }

  // 如果请求频率过高，触发 429 错误并要求 hCaptcha 验证
  const ip = req.ip;

  if (!captchaRequired[ip]) {
    captchaRequired[ip] = { attempts: 0, captchaVerified: false };
  }

  // 判断用户是否已经通过 hCaptcha
  if (!captchaRequired[ip].captchaVerified) {
    return res.status(429).json({ message: 'Too many requests, please complete CAPTCHA challenge' });
  }

  // 通过验证码后，放行请求
  next();
};
```

**功能说明**:
- 使用express-rate-limit限制单个IP的请求频率
- 防止暴力破解和DoS攻击
- 当请求超过限制时，要求用户完成hCaptcha验证
- 验证通过后，重置该IP的请求限制计数器
- 实现了自适应安全措施，合法用户只需偶尔验证

### 4. 验证和XSS防护中间件 (validate.js)

```javascript
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // 在校验通过后，统一清洗所有 req.body 中的 string 字段
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }

    next();
  };
};
```

**功能说明**:
- 集成express-validator进行输入验证
- 自动对所有字符串输入应用XSS过滤
- 清除可能包含恶意JavaScript代码的输入
- 验证失败时，返回详细的错误信息
- 支持自定义验证规则，如已在authSchema.js中定义

### 5. CSRF保护

在app.js中集成了csurf中间件，用于防御跨站请求伪造攻击：

```javascript
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get('/api/csrf-token', (req, res) => {
  const token = req.csrfToken();

  // 双通道发给前端：cookie + JSON
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,        // 允许前端读取
    sameSite: 'Strict',     // 只允许同站请求
  });

  res.json({ csrfToken: token });
});
```

**功能说明**:
- 使用csurf中间件实现CSRF保护
- 提供专门的API端点获取CSRF令牌
- 双通道提供令牌：cookie和JSON响应
- 前端需要在POST/PUT/DELETE请求中包含此令牌
- sameSite策略限制令牌只能被同站点使用

### 6. HTTP安全头部 (Helmet)

在app.js中配置Helmet中间件，提供多层HTTP头部安全防护：

```javascript
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
      defaultSrc: ["'self'"],        // 只允许同源加载资源
      scriptSrc: ["'self'"],         // 允许从指定域加载脚本
      styleSrc: ["'self'"],          // 允许加载同源和内联样式
      objectSrc: ["'none'"],         // 禁止嵌套对象
      connectSrc: ["'self'"],        // 只允许从同源请求
      fontSrc: ["'self'"],           // 只允许加载同源字体
      frameSrc: ["'none'"],          // 禁止嵌套框架
    },
  })
);
```

**功能说明**:
- 启用多种HTTP安全头部
- 内容安全策略(CSP)限制资源来源
- 防止XSS攻击
- 防止点击劫持(Clickjacking)
- 防止MIME类型嗅探
- 隐藏服务器信息
- 控制DNS预取行为

## 五、数据验证层

### 1. 验证器模式

项目采用集中式验证器模式，将各类API的输入验证规则定义在validators目录下：

**认证验证模式 (authSchema.js)**:
```javascript
// 注册验证规则
const registerSchema = [
  body('login_id')
    .isString().withMessage('login_id 应为字符串')
    .notEmpty().withMessage('login_id 不能为空')
    .trim().escape(),

  body('password')
    .isString().withMessage('密码必须是字符串')
    .notEmpty().withMessage('密码不能为空')
    .trim().escape(),

  // 更多字段验证
];

// 登录验证规则
const loginSchema = [
  body('login_id')
    .isString().withMessage('login_id 必须为字符串')
    .notEmpty().withMessage('login_id 不能为空')
    .trim().escape(),

  body('password')
    .isString().withMessage('password 必须为字符串')
    .notEmpty().withMessage('password 不能为空')
    .trim().escape(),
];
```

**功能说明**:
- 使用express-validator定义输入验证规则
- 分别为不同API定义特定的验证模式
- 集成数据清洗操作(trim, escape)
- 提供友好的错误消息
- 集中管理所有验证规则，便于维护和复用

### 2. 密码强度验证

在auth.js中实现了专门的密码强度验证函数:

```javascript
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  if (password.length < minLength) {
    errors.push(`密码长度至少为${minLength}个字符`);
  }
  if (!hasUpperCase) errors.push("需要包含大写字母");
  if (!hasLowerCase) errors.push("需要包含小写字母");
  if (!hasNumbers) errors.push("需要包含数字");
  if (!hasSpecialChar) errors.push("需要包含特殊字符");
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
```

**功能说明**:
- 验证密码长度(至少8字符)
- 验证密码复杂度(大小写字母、数字、特殊字符)
- 返回详细的错误信息
- 提供结构化的验证结果

## 六、安全策略总结

1. **多层防御策略**:
   - JWT认证 + httpOnly Cookie
   - 基于角色的访问控制
   - CSRF令牌防护
   - 内容安全策略(CSP)
   - 输入验证和XSS过滤

2. **防暴力攻击措施**:
   - 请求频率限制
   - hCaptcha人机验证
   - 自适应安全策略

3. **数据安全**:
   - 密码加密存储(bcrypt)
   - 严格的密码策略
   - 输入验证和清洗
   - 数据库参数化查询

4. **通信安全**:
   - 支持HTTPS (生产环境)
   - 严格的CORS配置
   - Cookie安全策略(httpOnly, sameSite)

5. **安全编码实践**:
   - 集中式验证
   - 统一错误处理
   - 最小权限原则
   - 安全依赖管理

该后端API设计综合考虑了功能性和安全性，通过多层次安全防护，为外卖应用提供了可靠、安全的后端支持。