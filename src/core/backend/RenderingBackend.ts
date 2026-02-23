import type { PaintingContext } from './PaintingContext';
import type { AABB } from '../types/geometry';

export type { AABB };

/**
 * 渲染后端抽象接口
 * 封装画布创建、帧绘制、脏区域合成等底层操作
 */
export interface RenderingBackend {
  /** 主显示画布 */
  readonly canvas: HTMLCanvasElement;

  /** 调整画布尺寸 */
  resize(width: number, height: number, pixelRatio: number): void;

  /** 获取离屏绘制上下文（节点 paint 使用） */
  getPaintingContext(): PaintingContext;

  /** 帧开始：全量重绘前的准备（清空离屏画布、设置变换等） */
  beginFullFrame(width: number, height: number, pixelRatio: number): void;

  /** 帧开始：局部重绘前的准备（设置脏区域 clip） */
  beginDirtyFrame(regions: AABB[], width: number, height: number, pixelRatio: number): void;

  /** 全量合成到主画布 */
  compositeFullFrame(): void;

  /** 局部合成脏区域到主画布 */
  compositeDirtyRegions(regions: AABB[], pixelRatio: number): void;

  /** 释放资源 */
  dispose(): void;
}
