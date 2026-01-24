import React from 'react';
import App from './App';
import { CyanEngine } from './core/engine';
import { CyanRenderer } from './core/adaptor/reconciler';

// 1. 获取 canvas 容器
const container = document.getElementById('root')!;
// 2. 检查全局是否已有引擎实例（防止热更新重复初始化）
let engine = (window as any).__CYAN_ENGINE__;

if (!engine) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  container.appendChild(canvas);
  engine = new CyanEngine({ canvas });
  // 将实例挂载到 window
  (window as any).__CYAN_ENGINE__ = engine;
}


// 3. 执行渲染
CyanRenderer.render(<App />, engine);