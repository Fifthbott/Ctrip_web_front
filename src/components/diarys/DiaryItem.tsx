import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DiaryStatus, TravelDiary } from "../../types";
import { 
    List,
    Image,
    Avatar,
    Row,
    Col,
    Typography
  } from 'antd';
  import { 
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined,
    DownOutlined
  } from '@ant-design/icons';
  import useMediaQuery from '../../hooks/useMediaQuery';


const {Title} = Typography;
// xs: 超小屏幕设备 < 576px
// sm: 小屏幕设备 ≥ 576px
// md: 中等屏幕设备 ≥ 768px
// lg: 大屏幕设备 ≥ 992px
// xl: 超大屏幕设备 ≥ 1200px
// xxl: 超超大屏幕设备 ≥ 1600px
// 预定义不同断点的Col属性，用固定值替代动态计算
const colPropsMap = {
    image: {
      xs: { span: 24 },
      sm: { span: 8 },
      md: { span: 8 },
      lg: { span: 6 },
      className: "diary-image-col"
    },
    content: {
      xs: { span: 24 },
      sm: { span: 16 },
      md: { span: 16 },
      lg: { span: 12 },
      className: "diary-content-col"
    },
    actions: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      lg: { span: 6 },
      className: "diary-actions-col"
    }
  };
  
  // 创建一个稳定的行组件
  const StableRow = memo(({ children, className, ...props }: React.ComponentProps<typeof Row>) => (
    <Row className={`diary-row ${className || ''}`} gutter={[16, 8]} align="top" {...props}>{children}</Row>
  ));
  
  // 创建一个稳定的列组件
  const StableCol = memo(({ children, className, ...props }: React.ComponentProps<typeof Col>) => (
    <Col className={`${className || ''}`} {...props}>{children}</Col>
  ));

// 组件参数定义
interface DiaryItemProps {
  item: TravelDiary;
  showDetails: (diary: TravelDiary) => void;
  hasPermission: (action: 'approve' | 'reject' | 'delete') => boolean;
  onApprove: (diary: TravelDiary) => void;
  onReject: (diary: TravelDiary) => void;
  onDelete: (diary: TravelDiary) => void;
  getStatusStamp: (status: DiaryStatus) => React.ReactNode;
}

// 缓存游记项组件
const DiaryItem = memo<DiaryItemProps>(({ 
    item, 
    showDetails, 
    hasPermission,
    onApprove,
    onReject,
    onDelete,
    getStatusStamp 
  }: DiaryItemProps) => {

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
      onApprove(item);
      setIsDropdownOpen(false);
    }, [item, onApprove]);
  
    const handleReject = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      onReject(item);
      setIsDropdownOpen(false);
    }, [item, onReject]);
  
    const handleDelete = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(item);
      setIsDropdownOpen(false);
    }, [item, onDelete]);
  
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
  
    // 检测屏幕尺寸
    const isLargeScreen = useMediaQuery('(min-width: 992px)');
    
    // 使用 useMemo 缓存行内容
    const rowContent = useMemo(() => {
      // 调试日志，检查内容数据
      console.log(`DiaryItem ${item.id} 的内容:`, item.content);
      
      const imageColProps = colPropsMap.image;
      const contentColProps = colPropsMap.content;
      const actionsColProps = colPropsMap.actions;
  
      return (
        <StableRow gutter={[16, 8]}>
          <StableCol {...imageColProps}>
            {item.images && item.images.length > 0 ? (
              <div className="image-container">
                <Image 
                  src={item.images[0]} 
                  alt={item.title}
                  className="diary-cover-image"
                  preview={false}
                  loading="lazy"
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
              <div className="diary-title" >
                <Title level={5} >
                  <div className="diary-title-content" onClick={toggleDropdown} style={{cursor: 'pointer'}}>
                  {item.title }
                  <DownOutlined className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
                  </div>
                </Title>
              </div>
              {dropdownContent}
            </div>
            
            {/* 小屏幕时在内容区的右下角显示状态图标 */}
            {!isLargeScreen && (
              <div 
                style={{
                  position: 'absolute', 
                  bottom: '10px', 
                  right: '10px', 
                  zIndex: 5,
                  transform: 'scale(0.5)',
                  transformOrigin: 'bottom right',
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'flex-end'
  
                }}
                className="diary-actions-col"
              >
                <div className="diary-status-section">
                  {getStatusStamp(item.status)}
                </div>
              </div>
            )}
            
            <div className="diary-brief">
              <div className="diary-author">
                <Avatar 
                  size="small" 
                  src={item.author.avatar} 
                  alt={item.author.nickname}
                />
                <span>{item.author.nickname}</span>
              </div>
              <div className="diary-excerpt">
                {item.content 
                  ? `${item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content}`
                  : '暂无内容'}
              </div>
              <div className="diary-date">
                {item.createdAt 
                  ? `创建时间: ${new Date(item.createdAt).toLocaleString('zh-CN')}` 
                  : '创建时间未知'}
              </div>
            </div>
          </StableCol>
          
          {/* 大屏幕时正常显示状态图标列 */}
          {isLargeScreen && (
            <StableCol {...actionsColProps}>
              <div className="diary-status-section">
                {getStatusStamp(item.status)}
              </div>
            </StableCol>
          )}
        </StableRow>
      );
    }, [item, item.content, item.images, item.title, item.createdAt, dropdownRef, toggleDropdown, dropdownContent, getStatusStamp, isDropdownOpen, isLargeScreen]);
  
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
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.content === nextProps.item.content &&
      (prevProps.item.images?.[0] === nextProps.item.images?.[0]) &&
      prevProps.showDetails === nextProps.showDetails &&
      prevProps.hasPermission === nextProps.hasPermission &&
      prevProps.getStatusStamp === nextProps.getStatusStamp
    );
  });

export default DiaryItem;