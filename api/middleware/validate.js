// middlewares/validate.js
const { validationResult } = require('express-validator');

/**
 * @param {Array} validations - 由 express-validator 提供的校验器数组
 * @returns Express 中间件函数
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // 执行所有 validator
    for (let validation of validations) {
      await validation.run(req);
    }

    // 收集验证结果
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 统一返回错误格式
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  };
};

module.exports = validate;
