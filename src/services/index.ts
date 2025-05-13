import { auditService } from './auditService';
import { authService } from './authService';

// 审核服务
const useAuditService =  auditService;

// 认证服务
const useAuthService =  authService;

export {
  // 审核服务
  auditService,
  useAuditService,
  // 认证服务
  authService,
  useAuthService
}; 