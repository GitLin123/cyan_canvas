/**
 * 引擎配置类型定义
 */

export interface EngineOptions {
  // 画布
  canvas?: HTMLCanvasElement;
  containerId?: string;
  width?: number;
  height?: number;
  // 设备像素比，默认使用窗口设备像素比
  pixelRatio?: number;
  // 渲染后端：'canvas2d' | 'webgl' | 'auto'，默认 'canvas2d'
  renderer?: 'canvas2d' | 'webgl' | 'auto';
}
