import { CyanEventHandlers } from '../types/events';
import {
  MainAxisAlignment,
  CrossAxisAlignment,
  Alignment,
  Direction,
  TextAlign,
  TextOverflow,
  FontWeight,
  FontStyle,
  TextDecoration,
  TextDirection,
  TextShadow,
  BoxFit,
  BoxShadow,
  Gradient,
  ImageRepeat,
  BlendMode,
  ColorFilter,
  Clip,
  VerticalDirection,
} from '../types/container';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size {
  width: number;
  height: number;
}

export type TriangleProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  blendMode?: BlendMode;
  boxShadow?: BoxShadow[];
} & CyanEventHandlers;

export type ArrowProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  blendMode?: BlendMode;
  boxShadow?: BoxShadow[];
} & CyanEventHandlers;

export type CircleProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  blendMode?: BlendMode;
  boxShadow?: BoxShadow[];
  border?: number;
  borderColor?: string;
} & CyanEventHandlers;

export type TextProps = {
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
  background?: string; // 背景色
  selectable?: boolean;
  softWrap?: boolean;
  semanticLabel?: string;
} & CyanEventHandlers;

export type ImageProps = {
  src: string;
  width?: number;
  height?: number;
  boxFit?: BoxFit;
  opacity?: number;
  repeat?: ImageRepeat;
  alignment?: Alignment;
  blendMode?: BlendMode;
  colorFilter?: ColorFilter;
  gaplessPlayback?: boolean;
  filterQuality?: 'low' | 'medium' | 'high';
  semanticLabel?: string;
  matchTextDirection?: boolean;
  centerSlice?: { x: number; y: number; w: number; h: number };
} & CyanEventHandlers;

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  flex?: number;
  borderRadius?: number;
  border?: number;
  borderColor?: string;
  boxShadow?: BoxShadow[];
  gradient?: Gradient;
  opacity?: number;
  blendMode?: BlendMode;
} & CyanEventHandlers;

export type ColumnProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
  textDirection?: TextDirection;
  verticalDirection?: VerticalDirection;
  clipBehavior?: Clip;
} & CyanEventHandlers;

export type RowProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
  textDirection?: TextDirection;
  verticalDirection?: VerticalDirection;
  clipBehavior?: Clip;
} & CyanEventHandlers;

export type ContainerProps = {
  x?: number;
  y?: number;
  color?: string;
  width?: number;
  height?: number;
  padding?: number;
  margin?: number;
  border?: number;
  borderRadius?: number;
  borderColor?: string;
  boxShadow?: BoxShadow[];
  gradient?: Gradient;
  opacity?: number;
  alignment?: Alignment;
  clipBehavior?: Clip;
  blendMode?: BlendMode;
  foregroundDecoration?: BoxShadow[];
  transform?: { scaleX?: number; scaleY?: number; rotateZ?: number };
  semanticContainer?: boolean;
  constraints?: { minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number };
} & CyanEventHandlers;

export type PaddingProps = {
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
} & CyanEventHandlers;

export type StackProps = {
  width?: number;
  height?: number;
  alignment?: Alignment;
  fit?: 'loose' | 'expand';
  clipBehavior?: Clip;
  textDirection?: TextDirection;
} & CyanEventHandlers;

export type AlignProps = {
  alignment?: Alignment;
  width?: number;
  height?: number;
  widthFactor?: number;
  heightFactor?: number;
} & CyanEventHandlers;

export type CenterProps = {
  width?: number;
  height?: number;
  widthFactor?: number;
  heightFactor?: number;
} & CyanEventHandlers;

export type SizedBoxProps = {
  width?: number;
  height?: number;
  child?: any;
} & CyanEventHandlers;

export type AspectRatioProps = {
  aspectRatio?: number;
  child?: any;
} & CyanEventHandlers;

export type FlexProps = {
  direction?: Direction;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  mainAxisSize?: 'min' | 'max';
  width?: number;
  height?: number;
  textDirection?: TextDirection;
  verticalDirection?: VerticalDirection;
  clipBehavior?: Clip;
} & CyanEventHandlers;

export type WrapProps = {
  direction?: 'horizontal' | 'vertical';
  spacing?: number;
  runSpacing?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  alignment?: 'start' | 'center' | 'end' | 'spaceEvenly' | 'spaceAround' | 'spaceBetween';
  runAlignment?: 'start' | 'center' | 'end' | 'spaceEvenly' | 'spaceAround' | 'spaceBetween';
  width?: number;
  height?: number;
  textDirection?: TextDirection;
  verticalDirection?: VerticalDirection;
  clipBehavior?: Clip;
} & CyanEventHandlers;

export type SingleChildScrollViewProps = {
  direction?: 'horizontal' | 'vertical';
  width?: number;
  height?: number;
  padding?: number;
  physics?: 'always' | 'bouncing' | 'never';
  clipBehavior?: Clip;
} & CyanEventHandlers;
