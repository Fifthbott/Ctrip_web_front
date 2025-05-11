import { UserRole } from '../types';
import { LoginParams, LoginResponse, UserResponse } from '../services/authService';

// 模拟管理员用户数据
const mockAdminUsers = [
  {
    user_id: 1001,
    username: 'admin',
    password: 'admin123',  // 注意：实际生产环境中不会这样存储密码
    nickname: '系统管理员',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    role: UserRole.ADMIN,
    created_at: '2023-01-01T00:00:00.000Z',
  },
  {
    user_id: 1002,
    username: 'auditor',
    password: 'audit123',  // 注意：实际生产环境中不会这样存储密码
    nickname: '内容审核员',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    role: UserRole.AUDITOR,
    created_at: '2023-02-15T00:00:00.000Z',
  }
];

// 模拟JWT令牌生成
const generateMockToken = (userId: number): string => {
  // 实际生产环境会使用JWT库生成有效的令牌
  return `mock_token_${userId}_${Date.now()}`;
};

// 模拟登录API
export const mockLogin = (params: LoginParams): LoginResponse => {
  const { username, password } = params;
  
  // 查找匹配的用户
  const user = mockAdminUsers.find(u => 
    u.username === username && u.password === password
  );
  
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  
  // 生成模拟令牌
  const token = generateMockToken(user.user_id);
  
  // 移除密码字段
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    status: 'success',
    message: '登录成功',
    data: {
      user: userWithoutPassword,
      token
    }
  };
};

// 模拟获取当前用户信息API
export const mockGetCurrentUser = (token: string): UserResponse => {
  if (!token) {
    throw new Error('未提供认证令牌');
  }
  
  // 从令牌中提取用户ID（模拟）
  const userId = parseInt(token.split('_')[1]);
  
  // 查找用户
  const user = mockAdminUsers.find(u => u.user_id === userId);
  
  if (!user) {
    throw new Error('无效的认证令牌');
  }
  
  // 移除密码字段
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    status: 'success',
    message: '获取用户信息成功',
    data: {
      user: userWithoutPassword
    }
  };
}; 