const { body } = require('express-validator');

const orderSchema = [
  body('restaurant_id').isInt().withMessage('restaurant_id must be an integer'),
  body('total_price').isFloat({ min: 0 }).withMessage('total_price must be a positive number'),
  body('items').isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.food_id').isInt().withMessage('each food_id must be an integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('quantity must be at least 1')
];

module.exports = orderSchema;
