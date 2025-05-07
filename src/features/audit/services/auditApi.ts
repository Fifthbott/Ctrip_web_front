// import { apiClient } from '../../../services/api/client';
// import { AuditListParams, AuditAction, Diary } from '../types';
// import { PaginatedResponse } from '../../../types/common';

// export const auditApi = {
//   // 获取审核列表
//   getList: (params: AuditListParams) => 
//     apiClient.get<PaginatedResponse<Diary[]>>('/audit/list', { params }),

//   // 获取日记详情
//   getDetail: (id: string) => 
//     apiClient.get<Diary>(`/audit/diary/${id}`),

//   // 审核操作
//   audit: (action: AuditAction) => 
//     apiClient.post('/audit/action', action),

//   // 删除日记
//   delete: (id: string) => 
//     apiClient.delete(`/audit/diary/${id}`),
// }; 
export {}
