const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log(`🔍 authMiddleware Original URL: ${req.originalUrl}, Current path: ${req.path}`);
  // // 跳过特定的路由
  // const publicRoutes = [/^\/auth\/register$/, /^\/auth\/login$/, /^\/api\/auth\/register$/, /^\/api\/auth\/login$/];
  // const isPublicRoute = publicRoutes.some(route => route.test(req.path)); // 使用正则表达式匹配公共路由
  // console.log(`🔍 Current path: ${req.path}, Is public route: ${isPublicRoute}`);
  
  // if (isPublicRoute) {
  //   console.log(`🔓 Public route accessed: ${req.path}`);
  //   return next(); // 跳过验证
  // }

  // 从 cookie 中获取 token
  const token = req.cookies.auth_token;

  if (!token) {
    console.log("!! 没有token");
    return res.status(401).json({ message: "Unauthorized access, token not found" });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // if token is invalid, this will throw an error
    req.user = decoded; // 将解码后的用户信息添加到请求对象中
    console.log("🔵 token:", token);
    console.log("🔵 decoded:", decoded);
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;