// middlewares/rateLimitMiddleware.js
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const {verify} = require('hcaptcha');
const dotenv = require('dotenv');
dotenv.config();

// hCaptcha secret key
const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET; 

const MAX_REQUESTS = 20; // 每分钟最大请求数

// 配置请求频率限制
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: MAX_REQUESTS, // 每个 IP 最多请求 30 次
  message: { message: 'Too many requests, please verify yourself' },
});

// 用于存储 IP 地址和 hCaptcha 状态
const captchaRequired = {};

const rateLimitMiddleware = async (req, res, next) => {
  // 如果 IP 请求数未超过阈值，则直接放行
  if (req.rateLimit.remaining > 0) {
    return next();
  }

  // 如果请求频率过高，触发 429 错误并要求 hCaptcha 验证
  const ip = req.ip;

  if (!captchaRequired[ip]) {
    captchaRequired[ip] = { attempts: 0, captchaVerified: false };
  }

  // 判断用户是否已经通过 hCaptcha
  if (!captchaRequired[ip].captchaVerified) {
    return res.status(429).json({ message: 'Too many requests, please complete CAPTCHA challenge' });
  }

  // 通过验证码后，放行请求
  next();
};

// 自定义中间件，用于处理 hCaptcha 验证
const verifyCaptcha = async (req, res, next) => {
  const { token } = req.body; // 只需要从前端接收 token
  const ip = req.ip; // 从请求中获取 IP 地址

  console.log('Received token:', token);
  console.log('IP:', ip);

  if (!token) {
    return res.status(400).json({ message: 'Invalid request: missing token' });
  }

  try {
    // 使用 hCaptcha 的 verify 方法验证 token
    verify(HCAPTCHA_SECRET, token) .then((data) => {
      if (data.success === true) {
        // 如果 hCaptcha 验证通过，更新该 IP 的状态
        console.log('Captcha verified successfully');
        captchaRequired[ip] = { captchaVerified: true, attempts: 0 }; // 重置尝试次数
        // 重置该ip的limit
        limiter.resetKey(ip); // 重置该 IP 的请求频率限制
        return res.status(200).json({ message: 'Captcha verified' });
      } else {
        console.log('Captcha verification failed:', response.data['error-codes']);
        return res.status(400).json({ message: 'Invalid captcha' });
      }
    })
    .catch(console.error);
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return res.status(500).json({ message: 'Internal error during captcha verification' });
  }
};

// 公开的 rate-limit 中间件函数
module.exports = {
  rateLimitMiddleware,
  verifyCaptcha,
  limiter,
};
