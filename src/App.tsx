import React, { Suspense, lazy, useEffect, useState } from 'react';
import { ConfigProvider } from 'antd';
import type { Locale } from 'antd/es/locale';
import './styles/main.scss';
import { AuthProvider } from './contexts/AuthContext';
import Loader from './components/Loader';

// Lazy load routes
const AppRoutes = lazy(() => import('./routes/RenderRoute'));

function App() {
  const [locale, setLocale] = useState<Locale | null>(null);
  
  useEffect(() => {
    // Dynamically import the locale
    import('antd/lib/locale/zh_CN').then(module => {
      setLocale(module.default);
    });
  }, []);
  
  if (!locale) {
    return <Loader />;
  }

  return (
    <ConfigProvider locale={locale}>
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <AppRoutes />
        </Suspense>
      </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
