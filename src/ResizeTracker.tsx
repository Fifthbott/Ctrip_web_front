import { useState, useEffect } from 'react';

// 窗口尺寸接口
interface WindowSize {
  width: number;
  height: number;
}

// 获取窗口初始尺寸
const getWindowSize = (): WindowSize => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
};

// 窗口尺寸自定义Hook
export const useWindowSize = (): WindowSize => {
  // 初始化状态为当前窗口尺寸
  const [windowSize, setWindowSize] = useState<WindowSize>(getWindowSize());

  useEffect(() => {
    // 窗口尺寸变化处理函数
    const handleResize = () => {
      setWindowSize(getWindowSize());
    };

    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    // 清理函数 - 组件卸载时移除事件监听
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 空依赖数组确保只在组件挂载和卸载时运行

  return windowSize;
}; 