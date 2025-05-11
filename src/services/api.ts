import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Raw token from localStorage:', token); // 打印原始 token

    if (token) {
      // 确保 Authorization 头的格式正确
      const authHeader = `Bearer ${token}`;
      config.headers.Authorization = authHeader;
      
      // 详细打印请求头信息
      console.log('Request configuration:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        authHeader: authHeader
      });
      
      // 特别检查 Authorization 头
      console.log('Authorization header set to:', config.headers.Authorization);
    } else {
      console.warn('No token found in localStorage for request to:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // 处理特定的错误状态码
      switch (error.response.status) {
        case 401:
          console.error('Authentication error:', error.response.data); // 调试日志
          // 未授权，清除用户信息并重定向到登录页
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        case 404:
          // 资源不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error('发生错误:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export default api; 