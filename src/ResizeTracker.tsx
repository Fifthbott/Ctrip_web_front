import { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';

// 创建一个上下文，用于全局共享窗口尺寸信息
export const ResizeContext = createContext<{
  width: number;
  height: number;
  isResizing: boolean;
}>({
  width: window.innerWidth,
  height: window.innerHeight,
  isResizing: false
});

// 自定义钩子，方便组件使用窗口尺寸信息
export const useWindowSize = () => useContext(ResizeContext);

// 全局窗口尺寸追踪组件
export const ResizeTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isResizing: false
  });
  
  // 使用 useRef 存储渲染记录的组件列表，避免在每次渲染时重新创建
  const renderingComponentsRef = useRef(new Set<string>());
  
  // 记录组件渲染
  const logComponentRender = useCallback((componentName: string) => {
    renderingComponentsRef.current.add(componentName);
    console.log(`[窗口变化渲染] ${componentName} 正在渲染 - 当前窗口宽度: ${dimensions.width}px`);
  }, [dimensions.width]);
  
  // 监听窗口尺寸变化
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    let isResizing = false;
    
    const handleResize = () => {
      if (!isResizing) {
        isResizing = true;
        setDimensions(prev => ({ 
          ...prev, 
          isResizing: true 
        }));
        
        // 清除控制台并开始新的跟踪会话
        if (renderingComponentsRef.current.size > 0) {
          console.log('----------------------');
          console.log(`[窗口变化] 开始新的尺寸变化: ${window.innerWidth}x${window.innerHeight}`);
          renderingComponentsRef.current.clear();
        }
      }
      
      // 使用防抖，避免频繁更新
      clearTimeout(resizeTimer);
      
      resizeTimer = setTimeout(() => {
        isResizing = false;
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
          isResizing: false
        });
        
        // 跟踪会话结束
        console.log('[窗口变化] 窗口尺寸调整结束');
        console.log('渲染的组件列表:');
        renderingComponentsRef.current.forEach(name => {
          console.log(`- ${name}`);
        });
        console.log('----------------------');
        
      }, 200); // 200ms防抖延迟
    };
    
    window.addEventListener('resize', handleResize);
    
    // 提供全局日志函数
    window.__RESIZE_TRACKER__ = {
      logRender: logComponentRender
    };
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      delete window.__RESIZE_TRACKER__;
    };
  }, [logComponentRender]);
  
  return (
    <ResizeContext.Provider value={dimensions}>
      {children}
    </ResizeContext.Provider>
  );
};

// 声明全局变量类型
declare global {
  interface Window {
    __RESIZE_TRACKER__?: {
      logRender: (componentName: string) => void;
    }
  }
}

export default ResizeTracker; 