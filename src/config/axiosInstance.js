import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
if (!API_URL) {
  throw new Error('REACT_APP_API_URL is not defined in .env file');
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 关键：确保 cookie 附带
  headers: {
    'Content-Type': 'application/json'
  }
});

let csrfToken = null; // 缓存 token，避免每次都请求

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  async (config) => {
    // 如果 token 没有获取过，就从后端拿一次
    if (!csrfToken) {
      try {
        const res = await axios.get(`${API_URL}/api/csrf-token`, {
          withCredentials: true
        });
        csrfToken = res.data.csrfToken;
        console.log('[CSRF] Token fetched:', csrfToken);
      } catch (error) {
        console.error('[CSRF] Failed to fetch token', error);
        return Promise.reject(error);
      }
    }

    // 添加 CSRF Token 到请求头
    config.headers['X-CSRF-Token'] = csrfToken;

    console.log('Request being sent:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 可选：遇到 403，说明 CSRF token 可能失效，清空重新获取
    if (error.response && error.response.status === 403) {
      console.warn('[CSRF] Token might be invalid, will refetch on next request');
      csrfToken = null;
    }

    // 限流跳转验证码页
    if (error.response && error.response.status === 429) {
      console.log('Too many requests, redirecting to captcha page...');
      window.location.href = '/hcaptcha';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
