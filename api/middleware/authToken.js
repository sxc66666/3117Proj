const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
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