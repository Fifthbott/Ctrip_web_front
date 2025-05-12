import { mockLogin, mockGetCurrentUser } from '../mock/authMock';
import { LoginParams, LoginResponse, UserInfo, UserResponse } from './authService';

// 检查是否使用模拟数据
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// 本地存储键名
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const mockAuthService = {
  // 用户登录
  login: async (params: LoginParams): Promise<LoginResponse> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { authService } = await import('./authService');
      return authService.login(params);
    }

    try {
      // 使用模拟数据
      const response = mockLogin(params);
      
      // 保存token和用户信息到本地存储
      localStorage.setItem(TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<UserResponse> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { authService } = await import('./authService');
      return authService.getCurrentUser();
    }

    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      throw new Error('未登录');
    }
    
    try {
      // 使用模拟数据
      return mockGetCurrentUser(token);
    } catch (error) {
      throw error;
    }
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
    return localStorage.getItem(TOKEN_KEY);
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
    const user = mockAuthService.getStoredUser();
    return user?.role === 'admin';
  },

  // 检查当前用户是否是审核员
  isAuditor: (): boolean => {
    const user = mockAuthService.getStoredUser();
    return user?.role === 'admin' || user?.role === 'reviewer';
  },

  // 添加请求的认证头
  getAuthHeaders: (): HeadersInit => {
    const token = mockAuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}; 