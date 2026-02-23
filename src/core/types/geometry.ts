/**
 * 几何基础类型
 * 统一定义引擎中所有几何相关的接口
 */

/** 二维点 */
export interface Point {
  x: number;
  y: number;
}

/** 尺寸 */
export interface Size {
  width: number;
  height: number;
}

/** 矩形（位置 + 尺寸） */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** 轴对齐包围盒 */
export interface AABB {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
