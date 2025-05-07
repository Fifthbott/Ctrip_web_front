import React, { useState, memo, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Typography, 
  Input, 
  Tabs,
  Card,
  Image,
  Avatar,
  Row,
  Col,
  List,
  Space,
  Select,
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
import testImg from '../../assets/images/test.jpeg';
import { useWindowSize } from '../../ResizeTracker';
import CustomModal from '../audit/auditModal';

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

// 测试数据
const mockDiaries: TravelDiary[] = [
  {
    id: '1',
    title: '三亚五日游',
    content: '三亚是一个美丽的城市，有着蓝天白云和清澈的海水。这次旅行我体验了很多海上活动，包括潜水、冲浪和帆船。天气晴朗，海滩上人来人往，非常热闹。住的酒店服务也很好，早餐种类丰富。总的来说，这是一次非常愉快的旅行。',
    images: [
      testImg,
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '101',
      username: 'user1',
      nickname: '旅行达人',
      avatar: 'https://joeschmoe.io/api/v1/male/1'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-05-15T09:24:00Z',
    updatedAt: '2023-05-15T09:24:00Z'
  },
  {
    id: '2',
    title: '北京文化之旅',
    content: '北京是一座历史悠久的城市，有着丰富的文化遗产和现代都市风貌。参观了故宫、长城和颐和园等著名景点，感受到了深厚的历史文化底蕴。特别是故宫的建筑风格和内部陈设，展现了中国古代宫廷的奢华与精致。',
    images: [
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '102',
      username: 'user2',
      nickname: '文化探索者',
      avatar: 'https://joeschmoe.io/api/v1/male/2'
    },
    status: DiaryStatus.APPROVED,
    createdAt: '2023-06-20T14:30:00Z',
    updatedAt: '2023-06-21T10:15:00Z'
  },
  {
    id: '3',
    title: '上海美食之旅',
    content: '上海的美食种类繁多，融合了中西方多种风味。品尝了正宗的上海小笼包、生煎馒头和炒年糕，每一样都让人回味无穷。南京路步行街的夜景也非常美丽，各种霓虹灯照亮了整条街道，非常热闹。',
    images: [
      testImg
    ],
    video: '',
    author: {
      id: '103',
      username: 'user3',
      nickname: '美食猎人',
      avatar: 'https://joeschmoe.io/api/v1/female/1'
    },
    status: DiaryStatus.REJECTED,
    rejectReason: '内容与旅游主题不符，更偏向美食攻略。',
    createdAt: '2023-07-05T18:45:00Z',
    updatedAt: '2023-07-06T09:20:00Z'
  },
  {
    id: '4',
    title: '杭州西湖游记',
    content: '西湖美景令人陶醉，湖水清澈，周围群山环绕，景色宜人。划着小船在湖中央，感受微风拂面，十分惬意。苏堤和白堤上的柳树随风摇曳，景色如画。特别推荐黄昏时分的断桥，夕阳西下的余晖映照在湖面上，美不胜收。',
    images: [
      testImg,
      testImg,
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '104',
      username: 'user4',
      nickname: '风景摄影师',
      avatar: 'https://joeschmoe.io/api/v1/male/3'
    },
    status: DiaryStatus.PENDING,
    createdAt: '2023-08-10T11:30:00Z',
    updatedAt: '2023-08-10T11:30:00Z'
  },
  {
    id: '5',
    title: '云南民族风情游',
    content: '云南的民族文化多姿多彩，参观了几个少数民族村寨，领略了不同的民族服饰和生活习俗。大理的洱海风光秀丽，丽江古城保存完好，处处充满古朴的韵味。当地的美食也很特别，过桥米线和破酥包非常好吃。',
    images: [
      testImg,
      testImg
    ],
    video: '',
    author: {
      id: '105',
      username: 'user5',
      nickname: '文化爱好者',
      avatar: 'https://joeschmoe.io/api/v1/female/2'
    },
    status: DiaryStatus.APPROVED,
    createdAt: '2023-09-02T16:20:00Z',
    updatedAt: '2023-09-03T08:45:00Z'
  }
];

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
  console.log('[渲染] AuditList组件渲染开始');
  const renderCount = useRef(0);
  
  // 获取窗口尺寸信息
  const windowSize = useWindowSize();
  
  // 在组件渲染时记录尺寸变化期间的渲染
  useEffect(() => {
    if (window.__RESIZE_TRACKER__ && windowSize.isResizing) {
      window.__RESIZE_TRACKER__.logRender('AuditList');
    }
  });
  
  // 增加渲染计数
  useEffect(() => {
    renderCount.current += 1;
    console.log('[计数] AuditList组件渲染次数:', renderCount.current);
  });
  
  const { user } = useAuth();
  const [selectedDiary, setSelectedDiary] = useState<TravelDiary | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [currentFilter, setCurrentFilter] = useState<DiaryStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);
  
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
  
  // Status filter options
  const statusOptions = useMemo(() => [
    { value: 'all', label: '全部' },
    { value: DiaryStatus.PENDING, label: '待审核' },
    { value: DiaryStatus.APPROVED, label: '已通过' },
    { value: DiaryStatus.REJECTED, label: '未通过' }
  ], []);

  // Handle search
  const handleSearch = useCallback((value: string) => {
    console.log('[操作] AuditList - 执行搜索:', value);
    setSearchKeyword(value);
  }, []);

  // 根据过滤条件获取日记列表
  const getFilteredDiaries = useCallback(() => {
    let result = [...mockDiaries];
    
    // 根据状态过滤
    if (currentFilter !== 'all') {
      result = result.filter(diary => diary.status === currentFilter);
    }
    
    // 根据搜索词过滤
    if (searchKeyword) {
      result = result.filter(diary => {
        if (searchType === 'title' && diary.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return true;
        }
        if (searchType === 'author' && diary.author.nickname.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return true;
        }
        if (searchType === 'content' && diary.content.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return true;
        }
        if (searchType === 'all') {
          return diary.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
            diary.author.nickname.toLowerCase().includes(searchKeyword.toLowerCase()) || 
            diary.content.toLowerCase().includes(searchKeyword.toLowerCase());
        }
        return false;
      });
    }
    
    return result;
  }, [currentFilter, searchKeyword, searchType]);

  // 使用 useMemo 缓存过滤后的日记列表，避免每次渲染都重新过滤
  const filteredDiaries = useMemo(() => getFilteredDiaries(), [getFilteredDiaries]);

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
    console.log('[函数调用] AuditList - getStatusStamp被调用:', status);
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
  const handleApprove = useCallback(() => {
    if (selectedDiary) {
      console.log('批准游记', selectedDiary.id);
      // TODO: 实现批准逻辑
    }
  }, [selectedDiary]);

  const handleReject = useCallback(() => {
    if (selectedDiary) {
      console.log('拒绝游记', selectedDiary.id);
      // TODO: 实现拒绝逻辑
    }
  }, [selectedDiary]);

  const handleDelete = useCallback(() => {
    if (selectedDiary) {
      console.log('删除游记', selectedDiary.id);
      // TODO: 实现删除逻辑
    }
  }, [selectedDiary]);


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
                  onChange={setSearchType}
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
            dataSource={filteredDiaries}
            renderItem={renderItem}
            pagination={{
              pageSize: 5,
              showTotal: (total) => `共 ${total} 条记录`,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20']
            }}
          />
        </Card>

        <CustomModal
          modalRef={modalRef}
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

// 日记详情组件
const DiaryDetail = memo(({ diary, getStatusStamp }: { 
  diary: TravelDiary;
  getStatusStamp: (status: DiaryStatus) => React.ReactNode;
}) => {
  console.log('[渲染] DiaryDetail组件 - ID:', diary.id, '状态:', diary.status);
  
  // 获取窗口尺寸信息
  const windowSize = useWindowSize();
  
  // 在组件渲染时记录尺寸变化期间的渲染
  useEffect(() => {
    if (window.__RESIZE_TRACKER__ && windowSize.isResizing) {
      window.__RESIZE_TRACKER__.logRender(`DiaryDetail-${diary.id}`);
    }
  });
  
  // 跟踪组件渲染次数
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log('[计数] DiaryDetail组件渲染次数 - ID:', diary.id, '次数:', renderCount.current);
  });
  
  // 使用图片列表，避免使用可能导致循环渲染的组件
  const imagesPreview = useMemo(() => {
    console.log('[Memo] DiaryDetail - ID:', diary.id, '计算图片预览, 图片数量:', diary.images.length);
    if (diary.images.length === 0) return null;
    
    return (
      <div className="diary-images">
        <Image.PreviewGroup>
          <div className="images-row">
            {diary.images.map((image, index) => (
              <div key={index} className="image-col">
                <Image
                  src={image} 
                  alt={`图片 ${index + 1}`} 
                  className="diary-image"
                  width="100%"
                />
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    );
  }, [diary.images]);
  
  console.log('[渲染] DiaryDetail - ID:', diary.id, '即将返回JSX');
  return (
    <div className="diary-detail">
      <Title level={4}>{diary.title}</Title>
      
      <div className="diary-meta">
        <div className="diary-author">
          <Avatar 
            src={diary.author.avatar} 
            alt={diary.author.nickname} 
            size={32}
          />
          <span>{diary.author.nickname}</span>
        </div>
        <div className="diary-status">
          {getStatusStamp(diary.status)}
          <span className="diary-date">
            {new Date(diary.createdAt).toLocaleString('zh-CN')}
          </span>
        </div>
      </div>
      
      {diary.status === DiaryStatus.REJECTED && diary.rejectReason && (
        <div className="reject-reason">
          <Typography.Text type="danger">
            拒绝原因: {diary.rejectReason}
          </Typography.Text>
        </div>
      )}
      
      <div className="diary-content">
        <Paragraph>{diary.content}</Paragraph>
        
        {imagesPreview}
        
        {diary.video && (
          <div className="diary-video">
            <Card 
              title="视频内容" 
              bordered={false}
              className="video-card"
            >
              <video controls width="100%">
                <source src={diary.video} type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
});

export default memo(AuditList); 