const express = require('express');
const { verifyCaptcha } = require('../middleware/rateLimit'); // 引入 rateLimit 中间件

const router = express.Router();

router.post('/verify-captcha', verifyCaptcha);

module.exports = router;