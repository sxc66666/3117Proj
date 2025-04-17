import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL // read from .env file
if (!API_URL) {
  throw new Error('REACT_APP_API_URL is not defined in .env file');
}

const axiosInstance = axios.create({
  baseURL: API_URL,  // 设置基础URL
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json' // default header
  }
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // Before sending the request
    console.log('Request being sent:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    // 如果错误是401，则清除cookie（httponly）// 需要https才安全 否则任何人都可假冒401清除cookie
    // To be finished
    // 如果错误是429，则跳转到验证码页面
    if (error.response && error.response.status === 429) {
      console.log('Too many requests, redirecting to captcha page...');
      // Redirect to captcha page “/hcaptcha”
      window.location.href = '/hcaptcha'; // 使用window.location.href进行重定向      
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;