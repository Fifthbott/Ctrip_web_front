import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoginFormValues } from '../../types';
import './login.scss';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await login(values);
      if (success) {
        message.success('登录成功');
        navigate('/admin/audit');
      } else {
        setError('用户名或密码错误，请重试');
      }
    } catch (error) {
      setError('登录失败，请重试');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2} className="login-title">旅游日记审核系统</Title>
          <Title level={4} className="login-subtitle">管理员登录</Title>
        </div>
        
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="login-error"
            closable
          />
        )}
        
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="login-button"
              loading={loading}
              size="large"
              block
            >
              登录
            </Button>
          </Form.Item>
          
          <div className="login-tips">
            <Text type="secondary">
              管理员账号: admin / admin123
            </Text>
            <br />
            <Text type="secondary">
              审核员账号: auditor / auditor123
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
