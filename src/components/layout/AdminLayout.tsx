import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Avatar, Space, Typography, Tag } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  DownOutlined,
  BookOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useWindowSize } from '../../ResizeTracker';
import './AdminLayout.scss';

// 引入API基础URL
import { API_BASE_URL } from '../../services/auditService';

const { Header, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // 获取窗口尺寸信息
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= 576;

  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 处理用户头像URL
  const processAvatarUrl = useCallback((avatarUrl?: string) => {
    if (!avatarUrl) return undefined;
    
    // 如果已经是完整的URL，直接返回
    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
    }
    
    // 删除/uploads/前缀，并构建完整的下载URL
    const avatarPath = avatarUrl.replace(/^\/uploads\//, '');
    return `${API_BASE_URL}/download/${avatarPath}`;
  }, []);

  // 获取角色显示文本
  const getRoleText = useCallback((role?: string) => {
    if (!role) return '用户';
    switch (role) {
      case 'admin': return '管理员';
      case 'reviewer': return '审核员';
      default: return '用户';
    }
  }, []);

  const handleLogout = useCallback(() => {
    console.log('[操作] AdminLayout - 触发登出');
    logout();
  }, [logout]);

  const toggleDropdown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(prev => !prev);
  }, []);

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

  // 处理的用户头像URL
  const avatarUrl = processAvatarUrl(user?.avatar);

  console.log('[渲染] AdminLayout - 即将返回JSX');
  return (
    <Layout className='layout-container'>
      <Header className='layout-header'>
        <div className='logo-section'>
          <BookOutlined className='logo-icon' />
          <div className='logo'>旅游日记审核系统</div>
        </div>
        <div className='user-info'>
          <div className="custom-dropdown" ref={dropdownRef}>
            <Space size="middle" className="user-dropdown" onClick={toggleDropdown}>
              <Avatar icon={<UserOutlined />} src={avatarUrl} />
              {!isMobile && (
                <div className="user-details-header">
                  <Text strong>{user?.nickname || user?.username || '用户'}</Text>
                  <Tag color={user?.role === 'admin' ? 'blue' : 'green'} className="role-tag">
                    {getRoleText(user?.role)}
                  </Tag>
                </div>
              )}
              {isMobile && <MenuOutlined className="menu-icon" />}
              <DownOutlined className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </Space>
            <div className={`custom-dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}>
              <div className="user-profile">
                <Avatar size="large" icon={<UserOutlined />} src={avatarUrl} />
                <div className="user-details">
                  <Text strong>{user?.nickname || user?.username || '用户'}</Text>
                  <Text type="secondary">{getRoleText(user?.role)}</Text>
                </div>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-item" onClick={handleLogout}>
                <LogoutOutlined /> 退出登录
              </div>
            </div>
          </div>
        </div>
      </Header>
      <Content className='admin-layout'>
        <div className='admin-container'>
          <div className='content-container'>
            {children}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default AdminLayout; 