const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 从 cookie 中获取 token
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: "未授权访问" });
  }

  try {
    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 将解码后的用户信息添加到请求对象中
    next();
  } catch (error) {
    return res.status(403).json({ message: "token无效或已过期" });
  }
};

module.exports = authMiddleware;