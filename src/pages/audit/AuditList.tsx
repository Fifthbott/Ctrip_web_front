import React, { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Typography, 
  Input, 
  Card,
  List,
  Select,
  message,
  Modal,
  Space
} from 'antd';
import { 
  SearchOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { DiaryStatus, TravelDiary } from '../../types'; 
import './audit.scss';
import CustomModal from './auditModal';
import { useAuditService } from '../../services';
import type { GetAuditDiariesParams } from '../../services/auditService';
import { API_BASE_URL } from '../../services/auditService';
import DiaryItem from '../../components/diarys/DiaryItem';
import CustomTabs from '../../components/diarys/CustomTabs';

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

// 错误边界组件，避免在渲染过程中出现的错误影响整个应用
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("渲染错误:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h3>出现了渲染错误</h3>
          <p>{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '5px 15px' }}
          >
            尝试恢复
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AuditList: React.FC = () => {
  const { isAdmin, isAuditor } = useAuth();
  const [diaries, setDiaries] = useState<TravelDiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<DiaryStatus | 'all'>('all');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  // 详情模态框状态
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<TravelDiary | null>(null);
  
  // 拒绝理由模态框状态
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectDiaryId, setRejectDiaryId] = useState<string>('');
  const [rejectReason, setRejectReason] = useState('');
  
  // 模态框引用
  const detailModalRef = useRef<HTMLDivElement>(null);

  // 刷新数据的函数
  const fetchDiaries = useCallback(async (params?: GetAuditDiariesParams) => {
    setLoading(true);
    
    // 创建默认参数
    const defaultParams: GetAuditDiariesParams = {
      status: statusFilter !== 'all' ? statusFilter : undefined,
      search: searchText || undefined,
      page: pagination.current,
      limit: pagination.pageSize
    };
    
    // 合并参数
    const queryParams = { ...defaultParams, ...params };
    
    try {
      console.log('开始获取游记列表, 参数:', queryParams);
      const response = await useAuditService.getAuditDiaries(queryParams);
      console.log('获取游记列表成功, 返回数据:', response);
      
      if (response.status === 'success') {
        // 更新分页信息
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.total
        });
        
        // 处理日记数据
        const mappedDiaries = response.data.travel_logs.map((log) => {
          // 处理封面图片逻辑
          let coverImage = '';
          if (log.cover_url) {
            coverImage = `${API_BASE_URL}/download/${log.cover_url}`;
          } else if (log.first_image_url) {
            coverImage = `${API_BASE_URL}/download/${log.first_image_url}`;
          } else if (log.image_urls && log.image_urls.length > 0) {
            // 如果没有cover_url但有image_urls，使用第一张图片作为封面
            const firstImage = log.image_urls[0];
            coverImage = firstImage.startsWith('http') 
              ? firstImage 
              : `${API_BASE_URL}/download/${firstImage}`;
          }
          
          // 处理作者头像
          let avatarUrl = 'default_avatar.jpg';
          if (log.author.avatar) {
            // 检查是否已经是完整的URL
            if (log.author.avatar.startsWith('http://') || log.author.avatar.startsWith('https://')) {
              avatarUrl = log.author.avatar;
            } else {
              // 删除/uploads/前缀，并构建完整的下载URL
              const avatarPath = log.author.avatar.replace(/^\/uploads\//, '');
              avatarUrl = `${API_BASE_URL}/download/${avatarPath}`;
            }
          }
          
          // 检查content字段是否存在
          console.log(`游记ID ${log.log_id} content字段:`, log.content);
          
          const mappedDiary = {
            id: log.log_id.toString(),
            title: log.title || '无标题',
            content: log.content || '', // 直接使用服务器返回的内容，不设置默认值
            images: coverImage ? [coverImage] : [],
            author: {
              id: log.author.user_id.toString(),
              username: '',
              nickname: log.author.nickname || '未知用户',
              avatar: avatarUrl
            },
            status: log.status as DiaryStatus,
            createdAt: log.created_at || '',
            updatedAt: log.updated_at || '',
            rejectReason: log.reject_reason || ''
          };
          console.log('映射后的游记数据:', mappedDiary);
          return mappedDiary;
        });
        
        // 查看映射后的游记数据
        console.log('映射后的游记数据:', mappedDiaries);
        
        setDiaries(mappedDiaries);
      } else {
        message.error('获取游记列表失败');
      }
    } catch (error) {
      console.error('获取游记列表错误:', error);
      message.error('获取游记列表失败');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchText, pagination.current, pagination.pageSize]);

  // 初始加载数据
  useEffect(() => {
    fetchDiaries();
  }, [fetchDiaries]);

  // 审核操作相关函数
  const handleApproveDiary = useCallback(async (diary: TravelDiary) => {
    try {
      const response = await useAuditService.approveDiary(diary.id);
      if (response.status === 'success') {
        message.success(response.message || '游记已批准');
        fetchDiaries();
      } else {
        message.error(response.message || '批准游记失败');
      }
    } catch (error) {
      console.error('批准游记失败:', error);
      message.error('批准游记失败');
    }
  }, [fetchDiaries]);

  const showRejectModal = useCallback((diary: TravelDiary) => {
    setRejectDiaryId(diary.id);
    setRejectModalVisible(true);
  }, []);

  const handleRejectConfirm = useCallback(async () => {
    if (!rejectReason.trim()) {
      message.warning('请输入拒绝理由');
      return;
    }

    try {
      const response = await useAuditService.rejectDiary(rejectDiaryId, rejectReason);
      if (response.status === 'success') {
        message.success(response.message || '游记已拒绝');
        setRejectModalVisible(false);
        setRejectReason('');
        fetchDiaries();
      } else {
        message.error(response.message || '拒绝游记失败');
      }
    } catch (error) {
      console.error('拒绝游记失败:', error);
      message.error('拒绝游记失败');
    }
  }, [rejectDiaryId, rejectReason, fetchDiaries]);

  const handleDeleteDiary = useCallback(async (diary: TravelDiary) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 "${diary.title}" 吗？此操作不可逆。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await useAuditService.deleteDiary(diary.id);
          if (response.status === 'success') {
            message.success(response.message || '游记已删除');
            fetchDiaries();
          } else {
            message.error(response.message || '删除游记失败');
          }
        } catch (error) {
          console.error('删除游记失败:', error);
          message.error('删除游记失败');
        }
      }
    });
  }, [fetchDiaries]);

  // 权限检查函数
  const hasPermission = useCallback((action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete') {
      return isAdmin;
    }
    return isAdmin || isAuditor;
  }, [isAdmin, isAuditor]);

  // 搜索和筛选处理
  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
    fetchDiaries({ search: value, page: 1 });
  }, [fetchDiaries]);
  
  // 添加搜索类型改变处理函数
  const handleSearchTypeChange = useCallback((value: string) => {
    setSearchType(value);
    // 如果已有搜索文本，使用新的搜索类型重新搜索
    if (searchText) {
      setPagination(prev => ({ ...prev, current: 1 }));
      fetchDiaries({ search: searchText, page: 1 });
    }
  }, [fetchDiaries, searchText]);

  const handleStatusChange = useCallback((value: DiaryStatus | 'all') => {
    setStatusFilter(value);
    setPagination(prev => ({ ...prev, current: 1 })); // 重置到第一页
    fetchDiaries({ status: value, page: 1 });
  }, [fetchDiaries]);

  const handlePageChange = useCallback((page: number, pageSize?: number) => {
    setPagination(prev => ({ 
      ...prev, 
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
    fetchDiaries({ page, limit: pageSize || pagination.pageSize });
  }, [fetchDiaries, pagination.pageSize]);

  // 详情查看处理
  const showDetails = useCallback((diary: TravelDiary) => {
    // 处理封面图片和可能的其他图片URLs
    const processImages = () => {
      // 如果已经是完整的URL数组，直接返回
      if (diary.images.length > 0 && diary.images[0].startsWith('http')) {
        return diary.images;
      }
      
      // 否则，将每个图片路径转换为下载URL
      return diary.images.map(img => {
        if (img.startsWith('http://') || img.startsWith('https://')) {
          return img;
        } else {
          return `${API_BASE_URL}/download/${img}`;
        }
      });
    };
    
    // 处理作者头像
    const processAvatar = () => {
      const avatar = diary.author.avatar;
      if (!avatar || avatar === 'default_avatar.jpg') {
        return avatar;
      }
      
      if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
        return avatar;
      } else {
        // 删除/uploads/前缀
        const avatarPath = avatar.replace(/^\/uploads\//, '');
        return `${API_BASE_URL}/download/${avatarPath}`;
      }
    };
    
    // 创建初始详情对象
    const initialDiary = {
      ...diary,
      images: processImages(),
      author: {
        ...diary.author,
        avatar: processAvatar()
      }
    };
    
    // 先显示模态框和当前数据
    setSelectedDiary(initialDiary);
    setDetailVisible(true);
    
    // 无论如何尝试获取完整内容
    // 显示加载状态
    const loadingMessage = message.loading('获取完整内容...', 0);
    
    // 尝试获取完整游记内容
    useAuditService.getAuditDiaryDetail(diary.id)
      .then(response => {
        if (response.status === 'success') {
          console.log('API返回的数据:', response.data.travel_log);
          
          // 使用类型断言处理API响应
          const apiResponse = response.data.travel_log as any;
          
          // 从auditRecords中获取拒绝原因
          let rejectReason = '';
          if (apiResponse.auditRecords && apiResponse.auditRecords.length > 0) {
            // 按时间倒序排序，找到最新的拒绝记录
            const rejectRecord = apiResponse.auditRecords
              .filter((record: any) => record.audit_status === 'rejected')
              .sort((a: any, b: any) => new Date(b.audit_time).getTime() - new Date(a.audit_time).getTime())[0];
            
            if (rejectRecord) {
              rejectReason = rejectRecord.reason || '';
              console.log('找到拒绝原因:', rejectReason);
            }
          }
          
          // 处理图片URLs
          let images = initialDiary.images;
          
          // 获取图片数组
          if (apiResponse.image_urls && apiResponse.image_urls.length > 0) {
            images = apiResponse.image_urls.map((img: string) => {
              if (img.startsWith('http://') || img.startsWith('https://')) {
                return img;
              } else {
                return `${API_BASE_URL}/download/${img}`;
              }
            });
          } else if (apiResponse.images && apiResponse.images.length > 0) {
            images = apiResponse.images.map((img: string) => {
              if (img.startsWith('http://') || img.startsWith('https://')) {
                return img;
              } else {
                return `${API_BASE_URL}/download/${img}`;
              }
            });
          }
          
          // 处理视频URL
          let videoUrl = null;
          if (apiResponse.video_url) {
            videoUrl = apiResponse.video_url.startsWith('http') 
              ? apiResponse.video_url 
              : `${API_BASE_URL}/download/${apiResponse.video_url}`;
          }
          
          // 处理封面图片URL（优先使用cover_url作为视频封面）
          let coverImageUrl = null;
          if (apiResponse.cover_url) {
            coverImageUrl = apiResponse.cover_url.startsWith('http') 
              ? apiResponse.cover_url 
              : `${API_BASE_URL}/download/${apiResponse.cover_url}`;
          } else if (apiResponse.thumbnail_url) {
            coverImageUrl = apiResponse.thumbnail_url.startsWith('http') 
              ? apiResponse.thumbnail_url 
              : `${API_BASE_URL}/download/${apiResponse.thumbnail_url}`;
          } else if (images.length > 0) {
            coverImageUrl = images[0];
          }
          
          // 更新游记内容
          const updatedDiary = {
            ...initialDiary,
            content: apiResponse.content || '暂无内容',
            rejectReason: rejectReason,
            images: images,
            video: videoUrl,
            coverImage: coverImageUrl
          };
          
          console.log('更新后的游记对象:', updatedDiary);
          setSelectedDiary(updatedDiary);
        }
      })
      .catch(error => {
        console.error('获取游记详情失败:', error);
      })
      .finally(() => {
        loadingMessage();
      });
    
    // 预加载图片
    const preloadImages = async () => {
      if (initialDiary.images.length > 0) {
        try {
          // 使用超时Promise避免图片加载时间过长
          const timeout = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
          
          // 创建预加载函数
          const preloadImage = (src: string) => {
            return new Promise<void>((resolve) => {
              const img = document.createElement('img');
              img.onload = () => resolve();
              img.onerror = () => resolve(); // 即使加载失败也继续
              img.src = src;
            });
          };
          
          // 等待所有图片加载完成或超时
          await Promise.race([
            Promise.all(initialDiary.images.map(src => preloadImage(src))),
            timeout(2000) // 最多等待2秒
          ]);
        } catch (err) {
          console.warn('图片预加载失败', err);
        }
      }
    };
    
    // 执行预加载
    preloadImages();
  }, []);

  // 获取状态标签
  const getStatusStamp = useCallback((status: DiaryStatus) => {
    switch (status) {
      case DiaryStatus.APPROVED:
        return (
          <div className="status-stamp approved">
            <span className="status-label">已通过</span>
          </div>
        );
      case DiaryStatus.REJECTED:
        return (
          <div className="status-stamp rejected">
            <span className="status-label">已拒绝</span>
          </div>
        );
      case DiaryStatus.PENDING:
        return (
          <div className="status-stamp pending">
            <span className="status-label">待审核</span>
          </div>
        );
      default:
        return null;
    }
  }, []);

  // Status filter options - 移动到组件内部
  const statusOptions = useMemo(() => [
    { value: 'all', label: '全部' },
    { value: DiaryStatus.PENDING, label: '待审核' },
    { value: DiaryStatus.APPROVED, label: '已通过' },
    { value: DiaryStatus.REJECTED, label: '未通过' }
  ], []);

  // 使用 useMemo 创建 Tabs 的 items 配置
  const tabItems = useMemo(() => (
    statusOptions.map((option) => ({
      key: option.value,
      label: option.label,
    }))
  ), [statusOptions]);

  const tabsComponent = useMemo(() => (
    <CustomTabs 
      activeKey={statusFilter} 
      onChange={(key: string) => handleStatusChange(key as DiaryStatus | 'all')} 
      items={tabItems}
    />
  ), [statusFilter, handleStatusChange, tabItems]);

  // 创建列表项渲染器
  const renderItem = useCallback((item: TravelDiary) => {
    return (
      <DiaryItem 
        key={item.id}
        item={item}
        showDetails={showDetails}
        hasPermission={hasPermission}
        onApprove={handleApproveDiary}
        onReject={showRejectModal}
        onDelete={handleDeleteDiary}
        getStatusStamp={getStatusStamp}
      />
    );
  }, [showDetails, hasPermission, handleApproveDiary, showRejectModal, handleDeleteDiary, getStatusStamp]);

  // 在返回前记录
  useEffect(() => {
    console.log('[渲染] AuditList - 渲染完成', { diaries, pagination, loading });
  }, [diaries, pagination, loading]);

  // 处理自定义模态框的函数
  const handleModalApprove = (diary: TravelDiary | null) => {
    if (diary) {
      handleApproveDiary(diary);
    }
  };

  const handleModalReject = (diary: TravelDiary | null) => {
    if (diary) {
      // 如果游记对象包含拒绝理由，直接使用它进行拒绝操作
      if (diary.rejectReason) {
        useAuditService.rejectDiary(diary.id, diary.rejectReason)
          .then(response => {
            if (response.status === 'success') {
              message.success(response.message || '游记已拒绝');
              fetchDiaries();
              setDetailVisible(false); // 关闭详情模态框
            } else {
              message.error(response.message || '拒绝游记失败');
            }
          })
          .catch(error => {
            console.error('拒绝游记失败:', error);
            message.error('拒绝游记失败');
          });
      } else {
        // 否则显示拒绝理由对话框
        showRejectModal(diary);
      }
    }
  };

  const handleModalDelete = (diary: TravelDiary | null) => {
    if (diary) {
      handleDeleteDiary(diary);
    }
  };

  // 添加搜索类型选项
  const searchTypeOptions = useMemo(() => [
    { value: 'all', label: '全部字段' },
    { value: 'title', label: '标题' },
    { value: 'content', label: '内容' },
    { value: 'author', label: '作者' }
  ], []);

  return (
    <div className="audit-page">
      <ErrorBoundary>
        <Card className="audit-header-card">
          <div className="audit-header">
            <div className="title-section">
              <Title level={3}>旅游日记审核管理</Title>
              <Paragraph>
                对用户提交的旅游日记进行审核管理，维护平台内容质量
              </Paragraph>
            </div>
            
            <div className="action-section">
              <div className="audit-list-toolbar">
                <div className="search-area">
                  <Space size="middle">
                    <Select
                      defaultValue="all"
                      value={searchType}
                      style={{ width: 120 }}
                      onChange={handleSearchTypeChange}
                    >
                      {searchTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                    <Search
                      placeholder="搜索游记"
                      onSearch={handleSearch}
                      className="search-input"
                      enterButton={
                        <span>
                          <SearchOutlined /> 搜索
                        </span>
                      }
                    />
                  </Space>
                </div>
              </div>
            </div>
          </div>
          
          <div className="custom-tabs-wrapper">
            {tabsComponent}
          </div>
        </Card>

        <Card 
          className="diary-list-card"
          loading={loading}
        >
          <List
            className="diary-list"
            dataSource={diaries}
            renderItem={renderItem}
            rowKey="id"
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              onChange: handlePageChange,
            }}
          />
          
          <CustomModal
            modalRef={detailModalRef as React.RefObject<HTMLDivElement>}
            visible={detailVisible}
            selectedDiary={selectedDiary}
            hasPermission={hasPermission}
            handleApprove={handleModalApprove}
            handleReject={handleModalReject}
            handleDelete={handleModalDelete}
            getStatusStamp={getStatusStamp}
            closeModal={() => setDetailVisible(false)}
          />
          
          <Modal
            title="拒绝理由"
            open={rejectModalVisible}
            onOk={handleRejectConfirm}
            onCancel={() => {
              setRejectModalVisible(false);
              setRejectReason('');
            }}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入拒绝理由"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Modal>
        </Card>
      </ErrorBoundary>
    </div>
  );
}

export default AuditList; 