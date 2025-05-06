import React, { useEffect } from 'react';
import { Layout, Dropdown, Avatar, Space } from 'antd';
import { 
  LogoutOutlined, 
  UserOutlined, 
  DownOutlined,
  BookOutlined 
} from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWindowSize } from '../../ResizeTracker';
import './AdminLayout.scss';

const { Header, Content } = Layout;

const AdminLayout: React.FC = () => {
  console.log('[渲染] AdminLayout 组件渲染');
  
  // 获取窗口尺寸信息
  const windowSize = useWindowSize();
  
  // 在组件渲染时记录
  useEffect(() => {
    if (window.__RESIZE_TRACKER__ && windowSize.isResizing) {
      window.__RESIZE_TRACKER__.logRender('AdminLayout');
    }
  });
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('[操作] AdminLayout - 触发登出');
    logout();
    navigate('/login');
  };

  const dropdownItems = {
    items: [
      {
        key: 'logout',
        label: '退出登录',
        onClick: handleLogout
      }
    ]
  };

  console.log('[渲染] AdminLayout - 即将返回JSX');
  return (
    <Layout className='layout-container'>
        <Header className='layout-header'>
            <div className='logo-section'>
                <BookOutlined className='logo-icon' />
                <div className='logo'>旅游日记审核系统</div>
            </div>
            <div className='user-info'>
                    <Space size="middle" className="user-dropdown">
                        <Avatar icon={<UserOutlined />} src={user?.avatar} />
                        <span>{user?.name || '用户'}</span>
                        <Dropdown menu={dropdownItems} placement="bottom" overlayStyle={{width:'80px'}}>
                        <DownOutlined />
                        </Dropdown>
                    </Space>     
            </div>
        </Header>
        <Content className='admin-layout'>
            <div className='admin-container'>
                <div className='content-container'>
                    <Outlet />
                </div>
            </div>
        </Content>
    </Layout>
  );
};

export default AdminLayout; 