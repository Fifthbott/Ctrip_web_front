import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './styles/main.scss';
import AppRoutes from './routes/RenderRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
