import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

const baseURL = process.env.REACT_APP_API_URL || 'http://101.43.95.173/api/';

const config: AxiosRequestConfig = {
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export const apiClient: AxiosInstance = axios.create(config);

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          localStorage.removeItem('token');
          // 删除自动重定向代码，让路由组件处理
          // window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限执行此操作');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器错误，请稍后重试');
          break;
        default:
          message.error(response.data?.message || '请求失败');
      }
    } else {
      message.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
); 