const { body } = require('express-validator');

// 更新用户信息验证规则
const updateCustUserSchema = [
    body('email')
      .optional()
      .isString().withMessage('email 必须为字符串'),
  
    body('nick_name')
      .optional()
      .isString().withMessage('昵称必须为字符串'),
  
    body('type')
      .optional()
      .isIn(['consumer', 'restaurant']).withMessage('用户类型必须为 consumer 或 restaurant'),
  
    body('profile_image')
      .optional()
      .isString().withMessage('profile_image 必须为字符串'),
  ];

  const updateVendUserSchema = [
    body('email')
      .optional()
      .isString().withMessage('email 必须为字符串'),
  
    body('nick_name')
      .optional()
      .isString().withMessage('昵称必须为字符串'),
  
    body('type')
      .optional()
      .isIn(['consumer', 'restaurant']).withMessage('用户类型必须为 consumer 或 restaurant'),
  
    body('profile_image')
      .optional()
      .isString().withMessage('profile_image 必须为字符串'),
  
    body('description')
      .optional()
      .isString().withMessage('description 必须为字符串'),
  ];

module.exports = {
    updateCustUserSchema,
    updateVendUserSchema,
};