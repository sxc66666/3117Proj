// validators/authSchema.js
const { body } = require('express-validator');

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

  body('nick_name')
    .isString().withMessage('昵称必须是字符串')
    .notEmpty().withMessage('昵称不能为空')
    .trim().escape(),

  body('email')
    .isString().withMessage('应为字符串')
    .notEmpty().withMessage('不能为空')
    .trim().escape(),

  body('type')
    .isIn(['consumer', 'restaurant']).withMessage('用户类型必须为 consumer 或 restaurant'),

  // 头像上传是 optional，但已在 multer 中处理，不需要在这里验证
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

module.exports = {
  registerSchema,
  loginSchema
};
