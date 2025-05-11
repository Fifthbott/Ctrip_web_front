import { auditService } from './auditService';
import { mockAuditService } from './mockAuditService';
import { authService } from './authService';
import { mockAuthService } from './mockAuthService';

// 根据环境变量决定使用真实服务还是模拟服务
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';

// 审核服务
const useAuditService = useMockData ? mockAuditService : auditService;

// 认证服务
const useAuthService = useMockData ? mockAuthService : authService;

export {
  // 审核服务
  auditService,
  mockAuditService,
  useAuditService,
  
  // 认证服务
  authService,
  mockAuthService,
  useAuthService
}; 