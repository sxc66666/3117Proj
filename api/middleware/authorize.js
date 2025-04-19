/**
 * 角色限制中间件
 * @param {Array<string>} allowedRoles 允许访问的角色，如 ['consumer', 'restaurant']
 */
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
  
module.exports = authorize;