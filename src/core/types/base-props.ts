import { CyanEventHandlers } from './events';
import {
  Alignment,
  BlendMode,
  BoxShadow,
  Clip,
  TextDirection,
  VerticalDirection,
} from './container';

/**
 * 基础 Props - 所有节点共享的基础属性
 */
export interface BaseProps extends CyanEventHandlers {
  // 事件处理器通过 CyanEventHandlers 继承
}

/**
 * 定位 Props - 支持位置和尺寸的节点
 */
export interface PositionableProps extends BaseProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * 可绘制 Props - 支持透明度和混合模式的节点
 */
export interface PaintableProps extends PositionableProps {
  opacity?: number;
  blendMode?: BlendMode;
}

/**
 * 可装饰 Props - 支持颜色和阴影的节点
 */
export interface DecorableProps extends PaintableProps {
  color?: string;
  boxShadow?: BoxShadow[];
}

/**
 * 可对齐 Props - 支持对齐方式的节点
 */
export interface AlignableProps extends BaseProps {
  alignment?: Alignment;
}

/**
 * 可裁剪 Props - 支持裁剪行为的节点
 */
export interface ClippableProps extends BaseProps {
  clipBehavior?: Clip;
}

/**
 * 方向 Props - 支持文本和垂直方向的节点
 */
export interface DirectionalProps extends BaseProps {
  textDirection?: TextDirection;
  verticalDirection?: VerticalDirection;
}
