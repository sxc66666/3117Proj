const { body } = require('express-validator');

const captchaSchema = [
  body('token')
    .isString().withMessage('token 必须为字符串')
    .notEmpty().withMessage('token 不能为空')
    .trim().escape(),
];

module.exports = {
  captchaSchema
};
