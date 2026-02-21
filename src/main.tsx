import React from 'react';
import App from './App';
import { CyanEngine } from './core/engine';
import { CyanRenderer } from './core/adaptor/reconciler';
// 检查全局是否已有引擎实例
let engine = (window as any).__CYAN_ENGINE__;

if (!engine) {
  engine = new CyanEngine({
    containerId: 'root',
    width: window.innerWidth,
    height: window.innerHeight
  });

  // 将实例挂载到 window（用于热更新保持状态）
  (window as any).__CYAN_ENGINE__ = engine;
}
CyanRenderer.render(<App />, engine);