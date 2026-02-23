import {
  MainAxisAlignment,
  CrossAxisAlignment,
  Direction,
  TextAlign,
  TextOverflow,
  FontWeight,
  FontStyle,
  TextDecoration,
  TextDirection,
  BoxFit,
  ImageRepeat,
} from '../types/container';
import type {
  TextShadow,
  BoxShadow,
  Gradient,
  ColorFilter,
} from '../types/container';
import {
  BaseProps,
  PositionableProps,
  PaintableProps,
  DecorableProps,
  AlignableProps,
  ClippableProps,
  DirectionalProps,
} from './base-props';

// 几何类型从 geometry.ts 统一导出
export { Rect, Size } from './geometry';
export type { Point, AABB } from './geometry';

// 形状节点 Props - 使用 DecorableProps 基类
export interface TriangleProps extends DecorableProps {}

export interface ArrowProps extends DecorableProps {}

export interface CircleProps extends DecorableProps {
  border?: number;
  borderColor?: string;
}

export interface TextProps extends BaseProps {
  text?: string;
  fontSize?: number;
  color?: string;
  width?: number;
  height?: number;
  textAlign?: TextAlign;
  textDirection?: TextDirection;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  maxLines?: number;
  textOverflow?: TextOverflow;
  opacity?: number;
  letterSpacing?: number;
  wordSpacing?: number;
  lineHeight?: number;
  heightFactor?: number;
  decoration?: TextDecoration;
  decorationColor?: string;
  decorationThickness?: number;
  shadows?: TextShadow[];
  background?: string;
  selectable?: boolean;
  softWrap?: boolean;
  semanticLabel?: string;
}

export interface ImageProps extends PaintableProps, AlignableProps {
  src: string;
  boxFit?: BoxFit;
  repeat?: ImageRepeat;
  colorFilter?: ColorFilter;
  gaplessPlayback?: boolean;
  filterQuality?: 'low' | 'medium' | 'high';
  semanticLabel?: string;
  matchTextDirection?: boolean;
  centerSlice?: { x: number; y: number; w: number; h: number };
}

export interface RectProps extends DecorableProps {
  flex?: number;
  borderRadius?: number;
  border?: number;
  borderColor?: string;
  gradient?: Gradient;
}

// Flex 布局节点 Props
export interface ColumnProps extends PositionableProps, ClippableProps, DirectionalProps {
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
}

export interface RowProps extends PositionableProps, ClippableProps, DirectionalProps {
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
}

export interface ContainerProps extends DecorableProps, AlignableProps, ClippableProps {
  padding?: number;
  margin?: number;
  border?: number;
  borderRadius?: number;
  borderColor?: string;
  gradient?: Gradient;
  foregroundDecoration?: BoxShadow[];
  transform?: { scaleX?: number; scaleY?: number; rotateZ?: number };
  semanticContainer?: boolean;
  constraints?: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number };
}

export interface PaddingProps extends BaseProps {
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

export interface StackProps extends PositionableProps, AlignableProps, ClippableProps {
  fit?: 'loose' | 'expand';
  textDirection?: TextDirection;
}

export interface AlignProps extends AlignableProps {
  width?: number;
  height?: number;
  widthFactor?: number;
  heightFactor?: number;
}

export interface CenterProps extends BaseProps {
  width?: number;
  height?: number;
  widthFactor?: number;
  heightFactor?: number;
}

export interface SizedBoxProps extends BaseProps {
  width?: number;
  height?: number;
  child?: any;
}

export interface AspectRatioProps extends BaseProps {
  aspectRatio?: number;
  child?: any;
}

export interface FlexProps extends PositionableProps, ClippableProps, DirectionalProps {
  direction?: Direction;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
}

export interface WrapProps extends PositionableProps, ClippableProps, DirectionalProps {
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  runSpacing?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  alignment?: 'start' | 'center' | 'end' | 'spaceEvenly' | 'spaceAround' | 'spaceBetween';
  runAlignment?: 'start' | 'center' | 'end' | 'spaceEvenly' | 'spaceAround' | 'spaceBetween';
}

export interface SingleChildScrollViewProps extends PositionableProps, ClippableProps {
  direction?: 'horizontal' | 'vertical';
  padding?: number;
  physics?: 'always' | 'bouncing' | 'never';
}

export type ListenerProps = {
  onPointerDown?: (e: any) => void;
  onPointerMove?: (e: any) => void;
  onPointerUp?: (e: any) => void;
  onPointerCancel?: (e: any) => void;
};

export type GestureDetectorProps = {
  onTap?: () => void;
  onTapDown?: (e: any) => void;
  onTapUp?: (e: any) => void;
  onLongPress?: (e: any) => void;
  onPanStart?: (e: any) => void;
  onPanUpdate?: (dx: number, dy: number, e: any) => void;
  onPanEnd?: (e: any) => void;
};

export interface ExpandedProps extends BaseProps {
  flex?: number;
}

export interface SpacerProps extends BaseProps {
  flex?: number;
}

export interface PositionedProps extends BaseProps {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  width?: number;
  height?: number;
}

export interface OpacityProps extends BaseProps {
  opacity?: number;
}

export interface ClipRRectProps extends BaseProps {
  borderRadius?: number;
  width?: number;
  height?: number;
}

export interface TransformProps extends BaseProps {
  translateX?: number;
  translateY?: number;
  scaleX?: number;
  scaleY?: number;
  rotation?: number;
  originX?: number;
  originY?: number;
}

export interface ConstrainedBoxProps extends BaseProps {
  constraintMinWidth?: number;
  constraintMaxWidth?: number;
  constraintMinHeight?: number;
  constraintMaxHeight?: number;
}

export interface FractionallySizedBoxProps extends AlignableProps {
  widthFactor?: number;
  heightFactor?: number;
}

export interface LimitedBoxProps extends BaseProps {
  maxLimitWidth?: number;
  maxLimitHeight?: number;
}

export interface FittedBoxProps extends BaseProps {
  fit?: BoxFit;
  width?: number;
  height?: number;
}

export interface OverflowBoxProps extends AlignableProps {
  overflowMinWidth?: number;
  overflowMaxWidth?: number;
  overflowMinHeight?: number;
  overflowMaxHeight?: number;
  width?: number;
  height?: number;
}

export interface OffstageProps extends BaseProps {
  offstage?: boolean;
}
