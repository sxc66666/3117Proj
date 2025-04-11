// src/utils/axios.js
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:5000',  // 设置基础URL
  withCredentials: true,             // 允许跨域携带cookie
  timeout: 10000,                    // 请求超时时间（可选）
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器（可选）
api.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    console.log('Request being sent:', config);
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器（可选）
api.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response?.status === 401) {
      // token过期或未授权，重定向到登录页
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;