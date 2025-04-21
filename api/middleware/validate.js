// middlewares/validate.js
const { validationResult } = require('express-validator');
const xss = require('xss');

/**
 * 通用 validate + XSS 清洗中间件
 * @param {Array} validations - 由 express-validator 提供的校验器数组
 * @returns Express 中间件函数
 */
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

    // ✅ 在校验通过后，统一清洗所有 req.body 中的 string 字段
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }

    next();
  };
};

module.exports = validate;
