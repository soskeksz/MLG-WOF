// components/MemoryMonitor.js
import { useEffect, useState } from 'react';

const MemoryMonitor = () => {
  const [memory, setMemory] = useState(null);
  
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      const updateMemory = () => {
        if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
          const used = Math.round(window.performance.memory.usedJSHeapSize / (1024 * 1024));
          const total = Math.round(window.performance.memory.totalJSHeapSize / (1024 * 1024));
          setMemory({ used, total });
        }
      };
      
      updateMemory();
      const interval = setInterval(updateMemory, 2000);
      
      return () => clearInterval(interval);
    }
  }, []);
  
  if (!memory || process.env.NODE_ENV === 'production') return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.7)',
      color: memory.used > 500 ? '#ff3333' : '#33ff33',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Memory: {memory.used} MB / {memory.total} MB
    </div>
  );
};

export default MemoryMonitor;