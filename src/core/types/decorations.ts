/**
 * 装饰/样式接口定义
 */

import type { BlendMode } from './enums';

// 文本阴影
export interface TextShadow {
  color: string;
  offset: { dx: number; dy: number };
  blurRadius: number;
}

// 颜色滤镜（Flutter: ColorFilter）
export interface ColorFilter {
  type: 'mode' | 'matrix';
  color?: string;
  blendMode?: BlendMode;
  matrix?: number[];
}

// 装饰类型（Flutter: BoxDecoration）
export interface BoxDecoration {
  color?: string;
  border?: BoxBorder;
  borderRadius?: number;
  boxShadow?: BoxShadow[];
  gradient?: Gradient;
}

// 边框配置
export interface BoxBorder {
  width?: number;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

// 阴影配置（Flutter: BoxShadow）
export interface BoxShadow {
  color: string;
  offset: { dx: number; dy: number };
  blurRadius: number;
  spreadRadius?: number;
}

// 渐变配置
export interface Gradient {
  type: 'linear' | 'radial';
  colors: string[];
  stops?: number[];
  angle?: number;
}

// 变换矩阵（Flutter: Transform）
export interface TransformMatrix {
  scaleX?: number;
  scaleY?: number;
  rotateZ?: number;
  translateX?: number;
  translateY?: number;
  skewX?: number;
  skewY?: number;
}
