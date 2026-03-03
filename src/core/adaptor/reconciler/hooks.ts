import { createContext, useContext, useState, useEffect } from 'react';
import type { CyanEngine } from '../../Engine';

export const EngineContext = createContext<CyanEngine | null>(null);

// 自定义 Hook，提供对 CyanEngine 实例的访问
export function useEngine(): CyanEngine {
  const engine = useContext(EngineContext);
  if (!engine) throw new Error('useEngine must be used within CyanRenderer');
  return engine;
}

// 监听窗口尺寸变化的 Hook，返回当前窗口宽高
export function useWindowSize(): { width: number; height: number } {
  const engine = useEngine();
  const [size, setSize] = useState(() => ({
    width: engine.canvas.width / (window.devicePixelRatio || 1),
    height: engine.canvas.height / (window.devicePixelRatio || 1),
  }));

  useEffect(() => {
    return engine.onResize((w, h) => setSize({ width: w, height: h }));
  }, [engine]);

  return size;
}
