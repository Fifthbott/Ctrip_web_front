import { TravelDiary, DiaryStatus } from '../types';

// API endpoints
export const API_BASE_URL = 'http://localhost:3001/api';

// 获取认证token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// 获取认证头
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

export interface GetAuditDiariesParams {
  status?: DiaryStatus | 'all';
  search?: string;
  page?: number;
  limit?: number;
}

export interface AuditDiaryResponse {
  status: string;
  message?: string;
  data: {
    travel_log: {
      log_id: number;
      title: string;
      content: string;
      images: string[];
      video?: string;
      status: DiaryStatus;
      like_count: number;
      author: {
        user_id: number;
        nickname: string;
        avatar: string;
      };
      created_at: string;
      updated_at: string;
      reject_reason?: string;
      auditRecords: any[];
    }
  }
}

export interface AuditDiariesListResponse {
  status: string;
  message?: string;
  data: {
    travel_logs: {
      log_id: number;
      title: string;
      content?: string;
      first_image_url: string | null;
      cover_url: string | null;
      status: DiaryStatus;
      like_count: number;
      author: {
        user_id: number;
        nickname: string;
        avatar: string;
      };
      created_at?: string;
      updated_at?: string;
      reject_reason?: string;
      auditRecords: any[];
    }[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  }
}

export const auditService = {
  // 获取所有待审核的游记列表
  getAuditDiaries: async (params: GetAuditDiariesParams): Promise<AuditDiariesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await fetch(`${API_BASE_URL}/audits/travel-logs?${queryParams.toString()}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit diaries');
    }
    return response.json();
  },

  // 获取待审核游记详情
  getAuditDiaryDetail: async (diaryId: string): Promise<AuditDiaryResponse> => {
    const response = await fetch(`${API_BASE_URL}/audits/travel-logs/${diaryId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch audit diary details');
    }
    return response.json();
  },

  // 批准游记
  approveDiary: async (diaryId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/audits/travel-logs/${diaryId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ audit_status: 'approved' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve diary');
    }
    
    return response.json();
  },

  // 拒绝游记
  rejectDiary: async (diaryId: string, reason: string): Promise<any> => {
    if (!reason) {
      throw new Error('Rejection reason is required');
    }
    
    const response = await fetch(`${API_BASE_URL}/audits/travel-logs/${diaryId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        audit_status: 'rejected',
        reason 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to reject diary');
    }
    
    return response.json();
  },

  // 删除游记
  deleteDiary: async (diaryId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/audits/travel-logs/${diaryId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete diary');
    }
    
    return response.json();
  },
}; 