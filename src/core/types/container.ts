// 容器类型属性

// 主轴对齐方式
export enum MainAxisAlignment {
  Start, // 靠头/靠左
  End, // 靠尾/靠右
  Center, // 居中对齐
  SpaceBetween, // 两端对齐，子项间均匀分布
  SpaceAround, // 子项周围均等空间（边缘空间是中间空间的一半）
  SpaceEvenly, // 全部均等空间（包括边缘）
}

// 交叉轴对齐方式
export enum CrossAxisAlignment {
  Start, // 靠顶/靠左
  Center, // 居中对齐
  End, // 靠底/靠右
  Stretch, // 拉伸（填满交叉轴）
}

// 主轴尺寸（Flutter: MainAxisSize）
export enum MainAxisSize {
  Max, // 占满主轴空间（默认）
  Min, // 自动调整为内容大小
}

// 对齐方式
export enum Alignment {
  TopLeft = 'topLeft',
  TopCenter = 'topCenter',
  TopRight = 'topRight',
  CenterLeft = 'centerLeft',
  Center = 'center',
  CenterRight = 'centerRight',
  BottomLeft = 'bottomLeft',
  BottomCenter = 'bottomCenter',
  BottomRight = 'bottomRight',
}

// 约束类型（支持 Infinity）
export interface BoxConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

// 约束工具类
export class BoxConstraintsHelper {
  // 创建紧约束（min === max）
  static tight(width: number, height: number): BoxConstraints {
    return { minWidth: width, maxWidth: width, minHeight: height, maxHeight: height };
  }

  // 创建松约束（min = 0）
  static loose(maxWidth: number, maxHeight: number): BoxConstraints {
    return { minWidth: 0, maxWidth, minHeight: 0, maxHeight };
  }

  // 创建无界约束（主要用于测量）
  static unbounded(): BoxConstraints {
    return {
      minWidth: 0,
      maxWidth: Number.POSITIVE_INFINITY,
      minHeight: 0,
      maxHeight: Number.POSITIVE_INFINITY,
    };
  }

  // 限制约束范围（确保 min <= max）
  static constrain(
    constraints: BoxConstraints,
    minW: number,
    maxW: number,
    minH: number,
    maxH: number
  ): BoxConstraints {
    return {
      minWidth: Math.min(maxW, Math.max(minW, constraints.minWidth)),
      maxWidth: Math.max(minW, Math.min(maxW, constraints.maxWidth)),
      minHeight: Math.min(maxH, Math.max(minH, constraints.minHeight)),
      maxHeight: Math.max(minH, Math.min(maxH, constraints.maxHeight)),
    };
  }

  // 判断约束是否有效
  static isValid(constraints: BoxConstraints): boolean {
    return (
      constraints.minWidth <= constraints.maxWidth &&
      constraints.minHeight <= constraints.maxHeight &&
      constraints.minWidth >= 0 &&
      constraints.minHeight >= 0
    );
  }
}

export enum Direction {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

// 文本对齐方式（Flutter: TextAlign）
export enum TextAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
  Justify = 'justify',
  Start = 'start',
  End = 'end',
}

// 文本溢出处理（Flutter: TextOverflow）
export enum TextOverflow {
  Clip = 'clip', // 裁剪
  Ellipsis = 'ellipsis', // 省略号
  Fade = 'fade', // 渐隐
}

// 图片填充方式（Flutter: BoxFit）
export enum BoxFit {
  Fill = 'fill', // 拉伸填满（可能变形）
  Contain = 'contain', // 包含（保持宽高比，可能有空白）
  Cover = 'cover', // 覆盖（保持宽高比，可能裁剪）
  FitWidth = 'fitWidth', // 宽度填满（保持宽高比）
  FitHeight = 'fitHeight', // 高度填满（保持宽高比）
  ScaleDown = 'scaleDown', // 如果图片小则显示原尺寸，否则缩放至 contain
}

// 字体粗细（Flutter: FontWeight）
export enum FontWeight {
  W100 = '100', // thin
  W200 = '200', // extra light
  W300 = '300', // light
  W400 = '400', // normal (default)
  W500 = '500', // medium
  W600 = '600', // semi bold
  W700 = '700', // bold
  W800 = '800', // extra bold
  W900 = '900', // black
}

// 字体样式（Flutter: FontStyle）
export enum FontStyle {
  Normal = 'normal',
  Italic = 'italic',
}

// 文本装饰（Flutter: TextDecoration）
export enum TextDecoration {
  None = 'none',
  Underline = 'underline',
  Overline = 'overline',
  LineThrough = 'lineThrough',
}

// 文本方向（Flutter: TextDirection）
export enum TextDirection {
  Ltr = 'ltr', // left-to-right
  Rtl = 'rtl', // right-to-left
}

// 垂直方向（Flutter: VerticalDirection）
export enum VerticalDirection {
  Up = 'up',
  Down = 'down',
}

// 裁剪行为（Flutter: Clip）
export enum Clip {
  None = 'none', // 不裁剪
  HardEdge = 'hardEdge', // 硬边裁剪
  AntiAlias = 'antiAlias', // 抗锯齿裁剪
  AntiAliasWithSaveLayer = 'antiAliasWithSaveLayer', // 保存层的抗锯齿
}

// 混合模式（Flutter: BlendMode）
export enum BlendMode {
  Normal = 'normal',
  Multiply = 'multiply',
  Screen = 'screen',
  Overlay = 'overlay',
  Darken = 'darken',
  Lighten = 'lighten',
  ColorDodge = 'colorDodge',
  ColorBurn = 'colorBurn',
  HardLight = 'hardLight',
  SoftLight = 'softLight',
  Difference = 'difference',
  Exclusion = 'exclusion',
}

// 图片重复模式（Flutter: ImageRepeat）
export enum ImageRepeat {
  NoRepeat = 'noRepeat',
  Repeat = 'repeat',
  RepeatX = 'repeatX',
  RepeatY = 'repeatY',
}

// 容器形状（Flutter: ShapeBorder）
export enum ShapeType {
  Rectangle = 'rectangle',
  RoundedRectangle = 'roundedRectangle',
  Circle = 'circle',
  Oval = 'oval',
}

// Wrap 对齐方式（主轴）
export enum WrapAlignment {
  Start = 'start',
  End = 'end',
  Center = 'center',
  SpaceBetween = 'spaceBetween',
  SpaceAround = 'spaceAround',
  SpaceEvenly = 'spaceEvenly',
}

// Wrap 对齐方式（交叉轴）
export enum WrapCrossAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}

// 文本阴影
export interface TextShadow {
  color: string; // 阴影颜色
  offset: { dx: number; dy: number }; // 偏移
  blurRadius: number; // 模糊半径
}

// 颜色滤镜（Flutter: ColorFilter）
export interface ColorFilter {
  type: 'mode' | 'matrix'; // 模式或矩阵
  color?: string; // 颜色模式的颜色
  blendMode?: BlendMode; // 混合模式
  matrix?: number[]; // 5x4 的色彩矩阵
}

// 装饰类型（Flutter: BoxDecoration 的属性）
export interface BoxDecoration {
  color?: string; // 背景色
  border?: BoxBorder; // 边框
  borderRadius?: number; // 圆角
  boxShadow?: BoxShadow[]; // 阴影
  gradient?: Gradient; // 渐变
}

// 边框配置
export interface BoxBorder {
  width?: number;
  color?: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

// 阴影配置（Flutter: BoxShadow）
export interface BoxShadow {
  color: string; // 阴影颜色
  offset: { dx: number; dy: number }; // 偏移
  blurRadius: number; // 模糊半径
  spreadRadius?: number; // 扩展半径
}

// 渐变配置
export interface Gradient {
  type: 'linear' | 'radial';
  colors: string[];
  stops?: number[]; // 0-1, 颜色在渐变中的位置
  angle?: number; // 线性渐变方向（度数）
}

// 变换矩阵（Flutter: Transform）
export interface TransformMatrix {
  scaleX?: number;
  scaleY?: number;
  rotateZ?: number; // 旋转角度（度数）
  translateX?: number;
  translateY?: number;
  skewX?: number;
  skewY?: number;
}
