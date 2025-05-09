import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Avatar, Space, Typography } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  DownOutlined,
  BookOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWindowSize } from '../../ResizeTracker';
import './AdminLayout.scss';

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
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = useCallback(() => {
    console.log('[操作] AdminLayout - 触发登出');
    logout();
    navigate('/login');
  }, [logout, navigate]);

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
              <Avatar icon={<UserOutlined />} src={user?.avatar} />
              <span>{user?.name || '用户'}</span>
              <MenuOutlined className="menu-icon" />
              <DownOutlined className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`} />
            </Space>
            <div className={`custom-dropdown-menu ${isDropdownOpen ? 'visible' : ''}`}>
              {isMobile && (
                <>
                  <div className="user-profile">
                    <Avatar size="large" icon={<UserOutlined />} src={user?.avatar} />
                    <div className="user-details">
                      <Text strong>{user?.name || '用户'}</Text>
                      <Text type="secondary">{user?.role === 'admin' ? '管理员' : '审核员'}</Text>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                </>
              )}
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