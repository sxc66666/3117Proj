// validators/menuSchema.js
const { body, param } = require('express-validator');

// 添加菜品验证规则
const addMenuItemSchema = [
  body('name')
    .isString().withMessage('菜品名称必须为字符串')
    .notEmpty().withMessage('菜品名称不能为空'),

  body('description')
    .optional()
    .isString().withMessage('描述必须是字符串'),

  body('price')
    .isFloat({ gt: 0 }).withMessage('价格必须为正数'),

  body('image')
    .optional()
    .isString().withMessage('图片路径必须是字符串')
];

// 更新菜品验证规则（body 中包含 id 字段）
const updateMenuItemSchema = [
  body('id')
    .isInt({ gt: 0 }).withMessage('菜品 ID 必须为正整数'),

  body('name')
    .isString().withMessage('菜品名称必须为字符串')
    .notEmpty().withMessage('菜品名称不能为空'),

  body('description')
    .optional()
    .isString().withMessage('描述必须是字符串'),

  body('price')
    .isFloat({ gt: 0 }).withMessage('价格必须为正数'),

  body('image')
    .optional()
    .isString().withMessage('图片路径必须是字符串')
];

// 删除菜品验证规则（URL 参数中的 id）
const deleteMenuItemSchema = [
  param('id')
    .isInt({ gt: 0 }).withMessage('菜品 ID 必须为正整数')
];

module.exports = {
  addMenuItemSchema,
  updateMenuItemSchema,
  deleteMenuItemSchema
};
