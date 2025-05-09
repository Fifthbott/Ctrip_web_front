import React, { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Typography, 
  Input, 
  Card,
  Image,
  Avatar,
  Row,
  Col,
  List,
  Space,
  Select,
  message,
} from 'antd';
import { 
  DownOutlined,
  EyeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { DiaryStatus, TravelDiary, UserRole } from '../../types';
import './audit.scss';
import CustomModal from '../audit/auditModal';
import { auditService, GetDiariesParams } from '../../services/auditService';
import {mockDiaries} from '../../mock/diaryMock';

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

// 预定义不同断点的Col属性，用固定值替代动态计算
const colPropsMap = {
  image: {
    xs: { span: 24 },
    sm: { span: 8 },
    md: { span: 6 },
    className: "diary-image-col"
  },
  content: {
    xs: { span: 24 },
    sm: { span: 16 },
    md: { span: 12 },
    className: "diary-content-col"
  },
  actions: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 6 },
    className: "diary-actions-col"
  }
};

// 创建一个稳定的行组件
const StableRow = memo(({ children, ...props }: React.ComponentProps<typeof Row>) => (
  <Row {...props}>{children}</Row>
));

// 创建一个稳定的列组件
const StableCol = memo(({ children, ...props }: React.ComponentProps<typeof Col>) => (
  <Col {...props}>{children}</Col>
));

// 创建一个稳定的 DiaryItem 组件，避免使用过多的 Ant Design 动态功能
const DiaryItem = memo(({ 
  item, 
  showDetails, 
  hasPermission, 
  getStatusStamp 
}: { 
  item: TravelDiary; 
  showDetails: (diary: TravelDiary) => void;
  hasPermission: (action: 'approve' | 'reject' | 'delete') => boolean;
  getStatusStamp: (status: DiaryStatus) => React.ReactNode;
}) => {
  console.log('[渲染] DiaryItem组件 - ID:', item.id, '状态:', item.status);
  
  // 使用 useRef 存储下拉框状态，避免重新渲染
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 使用 useCallback 缓存事件处理函数
  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 使用 useCallback 缓存操作函数
  const handleViewDetails = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    showDetails(item);
    setIsDropdownOpen(false);
  }, [item, showDetails]);

  const handleApprove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('批准游记', item.id);
    setIsDropdownOpen(false);
  }, [item.id]);

  const handleReject = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('拒绝游记', item.id);
    setIsDropdownOpen(false);
  }, [item.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('删除游记', item.id);
    setIsDropdownOpen(false);
  }, [item.id]);

  // 使用 useMemo 缓存下拉菜单内容
  const dropdownContent = useMemo(() => (
    <div 
      className={`custom-dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}
      onClick={e => e.stopPropagation()}
    >
      <div className="dropdown-item" onClick={handleViewDetails}>
        <EyeOutlined /> 查看详情
      </div>
      
      {item.status === DiaryStatus.PENDING && hasPermission('approve') && (
        <div className="dropdown-item" onClick={handleApprove}>
          <CheckCircleOutlined /> 批准
        </div>
      )}
      
      {item.status === DiaryStatus.PENDING && hasPermission('reject') && (
        <div className="dropdown-item" onClick={handleReject}>
          <CloseCircleOutlined /> 拒绝
        </div>
      )}
      
      {hasPermission('delete') && (
        <div className="dropdown-item" onClick={handleDelete}>
          <DeleteOutlined /> 删除
        </div>
      )}
    </div>
  ), [isDropdownOpen, item.status, hasPermission, handleViewDetails, handleApprove, handleReject, handleDelete]);

  // 使用 useMemo 缓存行内容
  const rowContent = useMemo(() => {
    const imageColProps = colPropsMap.image;
    const contentColProps = colPropsMap.content;
    const actionsColProps = colPropsMap.actions;
    const rowProps = { gutter: [16, 16] as [number, number], className: "diary-row" };

    return (
      <StableRow {...rowProps}>
        <StableCol {...imageColProps}>
          {item.images.length > 0 ? (
            <div className="image-container">
              <Image 
                src={item.images[0]} 
                alt={item.title}
                className="diary-cover-image"
                preview={false}
              />
            </div>
          ) : (
            <div className="diary-no-image">
              暂无图片
            </div>
          )}
        </StableCol>
        <StableCol {...contentColProps}>
          <div className="custom-dropdown" ref={dropdownRef}>
            <div className="diary-title" onClick={toggleDropdown}>
              <Title level={5}>
                {item.title}
                <DownOutlined className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
              </Title>
            </div>
            {dropdownContent}
          </div>
          <div className="diary-brief">
            <div className="diary-author">
              <Avatar size="small" src={item.author.avatar} />
              <span>{item.author.nickname}</span>
            </div>
            <div className="diary-excerpt">
              {item.content.length > 100 
                ? `${item.content.substring(0, 100)}...` 
                : item.content}
            </div>
            <div className="diary-date">
              创建时间: {new Date(item.createdAt).toLocaleString('zh-CN')}
            </div>
          </div>
        </StableCol>
        <StableCol {...actionsColProps}>
          <div className="diary-status-section">
            {getStatusStamp(item.status)}
          </div>
        </StableCol>
      </StableRow>
    );
  }, [item, dropdownRef, toggleDropdown, dropdownContent, getStatusStamp, isDropdownOpen]);

  return (
    <List.Item className="diary-list-item">
      {rowContent}
    </List.Item>
  );
}, (prevProps, nextProps) => {
  // 优化比较函数，只在必要时重新渲染
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.status === nextProps.item.status &&
    prevProps.showDetails === nextProps.showDetails &&
    prevProps.hasPermission === nextProps.hasPermission &&
    prevProps.getStatusStamp === nextProps.getStatusStamp
  );
});

// 自定义 Tabs 组件
const CustomTabs = memo(({ 
  activeKey, 
  onChange, 
  items 
}: { 
  activeKey: string;
  onChange: (key: string) => void;
  items: { key: string; label: string }[];
}) => {
  return (
    <div className="custom-tabs">
      {items.map(item => (
        <div
          key={item.key}
          className={`custom-tab-item ${activeKey === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
});

const AuditList: React.FC = () => {

  const { user } = useAuth();
  const [selectedDiary, setSelectedDiary] = useState<TravelDiary | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'author' | 'content' | 'all'>('title');
  const [currentFilter, setCurrentFilter] = useState<DiaryStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [diaries, setDiaries] = useState<TravelDiary[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  
  // 使用useRef存储组件挂载状态，防止在组件卸载后更新状态
  const isMountedRef = useRef(true);

  // 在组件卸载时更新挂载状态
  useEffect(() => {
    console.log('[生命周期] AuditList - 组件挂载');
    return () => {
      console.log('[生命周期] AuditList - 组件卸载');
      isMountedRef.current = false;
    };
  }, []);

  // Status filter options - 移动到组件内部
  const statusOptions = useMemo(() => [
    { value: 'all', label: '全部' },
    { value: DiaryStatus.PENDING, label: '待审核' },
    { value: DiaryStatus.APPROVED, label: '已通过' },
    { value: DiaryStatus.REJECTED, label: '未通过' }
  ], []);

  // 获取日记列表数据
  const fetchDiaries = useCallback(async (params: GetDiariesParams) => {
    // try {
    //   setLoading(true);
    //   const response = await auditService.getDiaries(params);
    //   if (isMountedRef.current) {
    //     setDiaries(response.data);
    //     setPagination(prev => ({
    //       ...prev,
    //       total: response.total,
    //     }));
    //   }
    // } catch (error) {
    //   console.error('Failed to fetch diaries:', error);
    //   message.error('获取游记列表失败');
    // } finally {
    //   if (isMountedRef.current) {
    //     setLoading(false);
    //   }
    // }
    if (isMountedRef.current) {
      setDiaries(mockDiaries);
      setPagination(prev => ({
        ...prev,
        total: mockDiaries.length,
      }));
    }
  }, []);

  // 监听筛选条件变化，重新获取数据
  useEffect(() => {
    const params: GetDiariesParams = {
      status: currentFilter,
      searchKeyword,
      searchType,
      page: pagination.current,
      pageSize: pagination.pageSize,
    };
    fetchDiaries(params);
  }, [currentFilter, searchKeyword, searchType, pagination.current, pagination.pageSize, fetchDiaries]);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    console.log('[操作] AuditList - 执行搜索:', value);
    setSearchKeyword(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  // 处理分页变化
  const handlePaginationChange = useCallback((page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize,
    }));
  }, []);

  // 检查用户权限 - 使用 useCallback 避免重新创建
  const hasPermission = useCallback((action: 'approve' | 'reject' | 'delete'): boolean => {
    if (!user) return false;
    
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    
    if (user.role === UserRole.AUDITOR) {
      return action === 'approve' || action === 'reject';
    }
    
    return false;
  }, [user]);

  // 展示详情
  const showDetails = useCallback((diary: TravelDiary) => {
    setSelectedDiary(diary);
    setDetailsModalVisible(true);
  }, []);

  // 使用自定义 Modal 替代 Ant Design Modal
  const modalRef = useRef<HTMLDivElement>(null);
  
  // 关闭模态框
  const closeModal = useCallback(() => {
    setDetailsModalVisible(false);
  }, []);
  
  // 点击模态框外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };
    
    if (detailsModalVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
    };
  }, [detailsModalVisible, closeModal]);

  // 渲染状态标签
  const getStatusStamp = useCallback((status: DiaryStatus) => {
    switch (status) {
      case DiaryStatus.PENDING:
        return (
          <div className="status-stamp pending-stamp">
            <div className="status-label">待审核</div>
          </div>
        );
      case DiaryStatus.APPROVED:
        return (
          <div className="status-stamp approved-stamp">
            <div className="status-label">已通过</div>
          </div>
        );
      case DiaryStatus.REJECTED:
        return (
          <div className="status-stamp rejected-stamp">
            <div className="status-label">未通过</div>
          </div>
        );
      case DiaryStatus.DELETED:
        return (
          <div className="status-stamp deleted-stamp">
            <div className="status-label">已删除</div>
          </div>
        );
      default:
        return <div className="status-stamp">未知</div>;
    }
  }, []);

  // 处理Tab切换
  const handleTabChange = useCallback((key: string) => {
    console.log('[操作] AuditList - 切换标签:', key);
    setCurrentFilter(key as DiaryStatus | 'all');
  }, []);
  
  // 使用 useMemo 创建 Tabs 的 items 配置
  const tabItems = useMemo(() => 
    statusOptions.map(option => ({
      key: option.value,
      label: option.label
    }))
  , [statusOptions]);

  // 使用 useMemo 缓存自定义 Tabs 组件
  const tabsComponent = useMemo(() => (
    <CustomTabs 
      activeKey={currentFilter} 
      onChange={handleTabChange} 
      items={tabItems}
    />
  ), [currentFilter, handleTabChange, tabItems]);

  // 创建列表项渲染器
  const renderItem = useCallback((item: TravelDiary) => {
    console.log('[渲染项] AuditList - 渲染列表项:', item.id);
    return (
      <DiaryItem 
        key={item.id}
        item={item} 
        showDetails={showDetails}
        hasPermission={hasPermission}
        getStatusStamp={getStatusStamp}
      />
    );
  }, [showDetails, hasPermission, getStatusStamp]);

  // 处理选中日记的操作
  const handleApprove = useCallback(async () => {
    if (selectedDiary) {
      try {
        await auditService.approveDiary(selectedDiary.id);
        message.success('游记已批准');
        // 刷新列表
        fetchDiaries({
          status: currentFilter,
          searchKeyword,
          searchType,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        closeModal();
      } catch (error) {
        console.error('Failed to approve diary:', error);
        message.error('批准游记失败');
      }
    }
  }, [selectedDiary, currentFilter, searchKeyword, searchType, pagination, fetchDiaries]);

  const handleReject = useCallback(async (reason: string) => {
    if (selectedDiary) {
      try {
        await auditService.rejectDiary(selectedDiary.id, reason);
        message.success('游记已拒绝');
        // 刷新列表
        fetchDiaries({
          status: currentFilter,
          searchKeyword,
          searchType,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        closeModal();
      } catch (error) {
        console.error('Failed to reject diary:', error);
        message.error('拒绝游记失败');
      }
    }
  }, [selectedDiary, currentFilter, searchKeyword, searchType, pagination, fetchDiaries]);

  const handleDelete = useCallback(async () => {
    if (selectedDiary) {
      try {
        await auditService.deleteDiary(selectedDiary.id);
        message.success('游记已删除');
        // 刷新列表
        fetchDiaries({
          status: currentFilter,
          searchKeyword,
          searchType,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
        closeModal();
      } catch (error) {
        console.error('Failed to delete diary:', error);
        message.error('删除游记失败');
      }
    }
  }, [selectedDiary, currentFilter, searchKeyword, searchType, pagination, fetchDiaries]);

  // 在返回前记录
  console.log('[渲染] AuditList - 即将返回JSX');
  
  // 组件根元素返回
  return (
    <ErrorBoundary>
      <div className="audit-list-container">
        <Card className="audit-card"> 
          <div className="audit-list-toolbar">
            <Title level={4}>游记审核列表</Title>
            
            <div className="search-area" >
              <Space>
                <Select 
                  defaultValue="title" 
                  value={searchType}
                  onChange={(value: 'title' | 'author' | 'content' | 'all') => setSearchType(value)}
                  style={{ width: 100}}
                >
                  <Option value="title">标题</Option>
                  <Option value="author">作者</Option>
                  <Option value="content">内容</Option>
                  <Option value="all">全部</Option>
                </Select>
                <div style={{ flex: 1, minWidth: 0 }}> 
                <Search 
                  placeholder="请输入搜索关键词"
                  allowClear
                  enterButton={<span><SearchOutlined /> 搜索</span>}
                  size="middle"
                  onSearch={handleSearch}
                  style={{ width: '100%' }}
                />
                </div>
              </Space>
            </div>
            
            {tabsComponent}
          </div>

          <List
            className="diary-list"
            loading={loading}
            itemLayout="vertical"
            dataSource={diaries}
            renderItem={renderItem}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showTotal: (total) => `共 ${total} 条记录`,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
              onChange: handlePaginationChange,
            }}
          />
        </Card>

        <CustomModal
          modalRef={modalRef as React.RefObject<HTMLDivElement>}
          visible={detailsModalVisible}
          selectedDiary={selectedDiary}
          hasPermission={hasPermission}
          handleApprove={handleApprove}
          handleReject={handleReject}
          handleDelete={handleDelete}
          getStatusStamp={getStatusStamp}
          closeModal={closeModal}
        />
      </div>
    </ErrorBoundary>
  );
};

export default memo(AuditList); 