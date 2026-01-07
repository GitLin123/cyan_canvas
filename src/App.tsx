import React, { useEffect, useRef, useState } from 'react';
import { CyanEngine } from './core/engine';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displayFps, setDisplayFps] = useState(0);

  useEffect(() => {
    const engine = new CyanEngine({ canvas: canvasRef.current! });
    
    // 模拟一些渲染负载
    engine.start();

    // 每一帧都获取最新的 FPS 并同步给 React 状态
    const updateStats = () => {
      // 只有在数值变化时才触发 React 渲染
      const currentFps = engine.ticker.getFPS();
      setDisplayFps(currentFps);
      
      // 强制引擎持续工作以便观察最高 FPS
      engine.markNeedsPaint(); 
    };

    engine.ticker.add(updateStats);

    return () => engine.stop();
  }, []);

  return (
    <div style={{ background: '#222', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 10, left: 10, color: '#0f0',
        fontFamily: 'monospace', fontSize: '20px', pointerEvents: 'none'
      }}>
        FPS: {displayFps}
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
export default App;