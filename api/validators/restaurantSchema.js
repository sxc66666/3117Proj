const { param } = require('express-validator');

const getFoodsByRestaurantSchema = [
  param('restaurantId')
    .isInt({ gt: 0 }).withMessage('restaurantId 必须为正整数')
];

module.exports = {
  getFoodsByRestaurantSchema
};
