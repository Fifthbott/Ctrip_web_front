import { UserRole } from '../types';

// API endpoints
const API_BASE_URL = 'http://101.43.95.173/api';

// 定义登录参数接口
export interface LoginParams {
  username: string;
  password: string;
}

// 定义用户信息接口
export interface UserInfo {
  user_id: number;
  username: string;
  nickname: string;
  avatar: string;
  role: UserRole;
}

// 定义登录响应接口
export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: UserInfo;
    token: string;
  }
}

// 定义用户信息响应接口
export interface UserResponse {
  status: string;
  message: string;
  data: {
    user: UserInfo & {
      created_at: string;
    }
  }
}

// 本地存储键名
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  // 用户登录
  login: async (params: LoginParams): Promise<LoginResponse> => {
    console.log('Login attempt with params:', { username: params.username }); // 不记录密码

    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      throw new Error(errorData.message || '登录失败');
    }

    const data = await response.json();
    console.log('Login response:', {
      status: data.status,
      message: data.message,
      hasToken: !!data.data?.token,
      hasUser: !!data.data?.user
    });
    
    // 保存token和用户信息到本地存储
    if (data.status === 'success' && data.data.token) {
      // 确保存储的是完整的 token 字符串
      const token = data.data.token;
      console.log('Saving token to localStorage:', token);
      
      try {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));
        
        // 验证token是否成功保存
        const savedToken = localStorage.getItem(TOKEN_KEY);
        console.log('Verified saved token:', savedToken);
        
        if (!savedToken) {
          throw new Error('Token was not saved successfully');
        }
      } catch (error) {
        console.error('Error saving token:', error);
        throw new Error('保存登录信息失败');
      }
    } else {
      console.error('Invalid login response:', data);
      throw new Error('登录响应中未包含有效的 token');
    }
    
    return data;
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<UserResponse> => {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      throw new Error('未登录');
    }
    
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('获取用户信息失败');
    }

    return response.json();
  },

  // 退出登录
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login';
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  // 获取存储的token
  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Retrieved token:', token); // 调试日志
    return token;
  },

  // 获取存储的用户信息
  getStoredUser: (): UserInfo | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    
    try {
      return JSON.parse(userJson);
    } catch (error) {
      console.error('解析用户信息失败', error);
      return null;
    }
  },

  // 检查当前用户是否是管理员
  isAdmin: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === UserRole.ADMIN;
  },

  // 检查当前用户是否是审核员
  isAuditor: (): boolean => {
    const user = authService.getStoredUser();
    return user?.role === UserRole.ADMIN || user?.role === UserRole.AUDITOR;
  },

  // 添加请求的认证头
  getAuthHeaders: (): HeadersInit => {
    const token = authService.getToken();
    if (!token) {
      console.warn('No token found in localStorage'); // 调试日志
      return {};
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    console.log('Auth headers:', headers); // 调试日志
    return headers;
  }
}; 