import { DiaryStatus } from '../types';
import { axiosInstance, API_BASE_URL } from '../utils/http';
import axios from 'axios';

export { API_BASE_URL };

// 获取认证token
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

// 获取认证头
const getAuthHeaders = (): Record<string, string> => {
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
      image_urls?: string[];
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

    try {
      const response = await axiosInstance.get(`/audits/travel-logs?${queryParams.toString()}`, {
        headers: getAuthHeaders()
      });
      
      return response as unknown as AuditDiariesListResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unknown error:", error);
      }
      throw new Error('Failed to fetch audit diaries');
    }
  },

  // 获取待审核游记详情
  getAuditDiaryDetail: async (diaryId: string): Promise<AuditDiaryResponse> => {
    try {
      const response = await axiosInstance.get(`/audits/travel-logs/${diaryId}`, {
        headers: getAuthHeaders()
      });
      
      return response as unknown as AuditDiaryResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unknown error:", error);
      }
      throw new Error('Failed to fetch audit diary details');
    }
  },

  // 批准游记
  approveDiary: async (diaryId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post(`/audits/travel-logs/${diaryId}`, 
        { audit_status: 'approved' },
        { headers: getAuthHeaders() }
      );
      
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unknown error:", error);
      }
      throw new Error('Failed to approve diary');
    }
  },

  // 拒绝游记
  rejectDiary: async (diaryId: string, reason: string): Promise<any> => {
    if (!reason) {
      throw new Error('Rejection reason is required');
    }
    
    try {
      const response = await axiosInstance.post(`/audits/travel-logs/${diaryId}`, 
        { audit_status: 'rejected', reason },
        { headers: getAuthHeaders() }
      );
      
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unknown error:", error);
      }
      throw new Error('Failed to reject diary');
    }
  },

  // 删除游记
  deleteDiary: async (diaryId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/audits/travel-logs/${diaryId}`, {
        headers: getAuthHeaders()
      });
      
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error:", error.response.data);
      } else {
        console.error("Unknown error:", error);
      }
      throw new Error('Failed to delete diary');
    }
  },
}; 