import { getMockDiaries, getMockDiaryById, mockAuditDiary } from '../mock/diaryMock';
import { AuditDiariesListResponse, AuditDiaryResponse, GetAuditDiariesParams } from './auditService';

// 检查是否使用模拟数据
const useMockData = process.env.REACT_APP_USE_MOCK_DATA === 'true';

export const mockAuditService = {
  // 获取所有待审核的游记列表
  getAuditDiaries: async (params: GetAuditDiariesParams): Promise<AuditDiariesListResponse> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { auditService } = await import('./auditService');
      return auditService.getAuditDiaries(params);
    }

    // 使用模拟数据
    return getMockDiaries(params) as AuditDiariesListResponse;
  },

  // 获取待审核游记详情
  getAuditDiaryDetail: async (diaryId: string): Promise<AuditDiaryResponse> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { auditService } = await import('./auditService');
      return auditService.getAuditDiaryDetail(diaryId);
    }

    // 使用模拟数据
    const diary = getMockDiaryById(diaryId);
    if (!diary) {
      throw new Error('Diary not found');
    }

    // 转换为API返回格式
    const travel_log: any = {
      log_id: parseInt(diary.id),
      title: diary.title,
      content: diary.content,
      images: diary.images,
      video: diary.video,
      status: diary.status,
      like_count: 0,
      author: {
        user_id: parseInt(diary.author.id),
        nickname: diary.author.nickname,
        avatar: diary.author.avatar
      },
      created_at: diary.createdAt,
      updated_at: diary.updatedAt,
      reject_reason: diary.rejectReason,
      auditRecords: []
    };

    return {
      status: 'success',
      message: '获取游记详情成功',
      data: {
        travel_log
      }
    };
  },

  // 批准游记
  approveDiary: async (diaryId: string): Promise<any> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { auditService } = await import('./auditService');
      return auditService.approveDiary(diaryId);
    }

    // 使用模拟数据
    return mockAuditDiary(diaryId, 'approved');
  },

  // 拒绝游记
  rejectDiary: async (diaryId: string, reason: string): Promise<any> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { auditService } = await import('./auditService');
      return auditService.rejectDiary(diaryId, reason);
    }

    // 使用模拟数据
    return mockAuditDiary(diaryId, 'rejected', reason);
  },

  // 删除游记
  deleteDiary: async (diaryId: string): Promise<any> => {
    if (!useMockData) {
      // 如果不使用模拟数据，导入真实服务
      const { auditService } = await import('./auditService');
      return auditService.deleteDiary(diaryId);
    }

    // 使用模拟数据
    const diaryIndex = getMockDiaryById(diaryId);
    if (!diaryIndex) {
      throw new Error('Diary not found');
    }

    return {
      status: 'success',
      message: '游记已删除'
    };
  }
}; 