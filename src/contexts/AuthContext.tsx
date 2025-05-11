import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserRole } from '../types';
import { useAuthService } from '../services';
import { LoginParams } from '../services/authService';

interface AuthContextType {
  user: any | null;
  login: (values: LoginParams) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isAuditor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuditor, setIsAuditor] = useState<boolean>(false);

  useEffect(() => {
    // 检查是否已登录
    if (useAuthService.isAuthenticated()) {
      const storedUser = useAuthService.getStoredUser();
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(useAuthService.isAdmin());
      setIsAuditor(useAuthService.isAuditor());
    }
  }, []);

  const login = async (values: LoginParams): Promise<boolean> => {
    try {
      console.log('Attempting login with:', { username: values.username }); // 不记录密码
      
      // 调用登录服务
      const response = await useAuthService.login(values);
      console.log('Login response:', {
        status: response.status,
        hasToken: !!response.data?.token,
        hasUser: !!response.data?.user
      });

      if (response.status === 'success' && response.data.token) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === UserRole.ADMIN);
        setIsAuditor(userData.role === UserRole.ADMIN || userData.role === UserRole.AUDITOR);
        
        // 验证 token 是否正确存储
        const storedToken = localStorage.getItem('token');
        console.log('Stored token:', storedToken);
        
        if (!storedToken) {
          console.error('Token was not stored properly');
          return false;
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('登录失败:', error);
      return false;
    }
  };

  const logout = () => {
    // 调用登出服务
    useAuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsAuditor(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated,
        isAdmin,
        isAuditor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 