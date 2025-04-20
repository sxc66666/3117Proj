const express = require('express');
const { verifyCaptcha } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');
const { captchaSchema } = require('../validators/captchaSchema');

const router = express.Router();

// 添加验证中间件
router.post('/verify-captcha', validate(captchaSchema), verifyCaptcha);

module.exports = router;