import { TravelDiary, DiaryStatus } from '../types';

// API endpoints
const API_BASE_URL = '/api';

export interface GetDiariesParams {
  status?: DiaryStatus | 'all';
  searchKeyword?: string;
  searchType?: 'title' | 'author' | 'content' | 'all';
  page?: number;
  pageSize?: number;
}

export interface GetDiariesResponse {
  data: TravelDiary[];
  total: number;
  page: number;
  pageSize: number;
}

export const auditService = {
  // 获取游记列表
  getDiaries: async (params: GetDiariesParams): Promise<GetDiariesResponse> => {
    const queryParams = new URLSearchParams();
    if (params.status && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.searchKeyword) {
      queryParams.append('searchKeyword', params.searchKeyword);
    }
    if (params.searchType) {
      queryParams.append('searchType', params.searchType);
    }
    if (params.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params.pageSize) {
      queryParams.append('pageSize', params.pageSize.toString());
    }

    const response = await fetch(`${API_BASE_URL}/diaries?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch diaries');
    }
    return response.json();
  },

  // 批准游记
  approveDiary: async (diaryId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/diaries/${diaryId}/approve`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to approve diary');
    }
  },

  // 拒绝游记
  rejectDiary: async (diaryId: string, reason: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/diaries/${diaryId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
      throw new Error('Failed to reject diary');
    }
  },

  // 删除游记
  deleteDiary: async (diaryId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/diaries/${diaryId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete diary');
    }
  },
}; 