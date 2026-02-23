// 导出核心引擎
export { CyanEngine } from './Engine';
export { RenderNode } from './RenderNode';

// 导出渲染后端
export type { PaintingContext } from './backend/PaintingContext';
export type { RenderingBackend } from './backend/RenderingBackend';
export { Canvas2DPaintingContext } from './backend/Canvas2DPaintingContext';
export { Canvas2DRenderingBackend } from './backend/Canvas2DRenderingBackend';
export { WebGLPaintingContext } from './backend/webgl/WebGLPaintingContext';
export { WebGLRenderingBackend } from './backend/webgl/WebGLRenderingBackend';

// 导出基类（供扩展使用）
export { ShapeNode } from './nodes/base/ShapeNode';
export { SingleChildLayoutNode } from './nodes/base/SingleChildLayoutNode';

// 导出工具类
export { ConstraintUtils } from './utils/ConstraintUtils';

// 导出 Node 类
export { TextNode } from './nodes/TextNode';
export { ImageNode } from './nodes/ImageNodes';
export { RectNode } from './nodes/RectNode';
export { CircleNode } from './nodes/CircleNode';
export { TriangleNode } from './nodes/TriangleNode';
export { ArrowNode } from './nodes/ArrowNode';

// 导出 Layout 容器
export { ColumnNode } from './nodes/layout/ColumnNode';
export { RowNode } from './nodes/layout/RowNode';
export { ContainerNode } from './nodes/layout/ContainerNode';
export { PaddingNode } from './nodes/layout/PaddingNode';
export { CenterNode } from './nodes/layout/CenterNode';
export { AlignNode } from './nodes/layout/AlignNode';
export { FlexNode } from './nodes/layout/FlexNode';
export { SizedBoxNode } from './nodes/layout/SizedBoxNode';
export { AspectRatioNode } from './nodes/layout/AspectRatioNode';
export { StackNode } from './nodes/layout/StackNode';
export { WrapNode } from './nodes/layout/WrapNode';
export { SingleChildScrollViewNode } from './nodes/layout/SingleChildScrollViewNode';

// 导出类型定义（统一从 types 导出）
export type { Point, Size, Rect, AABB } from './types/geometry';
export type { BoxConstraints } from './types/constraints';
export type { EngineOptions } from './types/engine';
export type { CyanEventHandlers } from './types/events';
export type {
  TextShadow, ColorFilter, BoxDecoration, BoxBorder,
  BoxShadow, Gradient, TransformMatrix,
} from './types/decorations';
export {
  MainAxisAlignment,
  CrossAxisAlignment,
  MainAxisSize,
  Alignment,
  Direction,
  TextAlign,
  TextOverflow,
  FontWeight,
  FontStyle,
  TextDecoration,
  TextDirection,
  VerticalDirection,
  Clip,
  BlendMode,
  BoxFit,
  ImageRepeat,
  WrapAlignment,
  WrapCrossAlignment,
  ShapeType,
} from './types/enums';
