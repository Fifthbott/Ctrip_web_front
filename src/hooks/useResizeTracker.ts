import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isResizing: boolean;
}

export const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    isResizing: false,
  });

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      setWindowSize(prev => ({ ...prev, isResizing: true }));

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
          isResizing: false,
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return windowSize;
}; 