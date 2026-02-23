/**
 * 枚举类型定义
 * 布局、文本、样式等所有枚举集中管理
 */

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
  Clip = 'clip',
  Ellipsis = 'ellipsis',
  Fade = 'fade',
}

// 图片填充方式（Flutter: BoxFit）
export enum BoxFit {
  Fill = 'fill',
  Contain = 'contain',
  Cover = 'cover',
  FitWidth = 'fitWidth',
  FitHeight = 'fitHeight',
  ScaleDown = 'scaleDown',
}

// 字体粗细（Flutter: FontWeight）
export enum FontWeight {
  W100 = '100',
  W200 = '200',
  W300 = '300',
  W400 = '400',
  W500 = '500',
  W600 = '600',
  W700 = '700',
  W800 = '800',
  W900 = '900',
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
  Ltr = 'ltr',
  Rtl = 'rtl',
}

// 垂直方向（Flutter: VerticalDirection）
export enum VerticalDirection {
  Up = 'up',
  Down = 'down',
}

// 裁剪行为（Flutter: Clip）
export enum Clip {
  None = 'none',
  HardEdge = 'hardEdge',
  AntiAlias = 'antiAlias',
  AntiAliasWithSaveLayer = 'antiAliasWithSaveLayer',
}

// 混合模式（Flutter: BlendMode）
export enum BlendMode {
  Normal = 'source-over',
  SrcOver = 'source-over',
  SrcIn = 'source-in',
  SrcOut = 'source-out',
  SrcAtop = 'source-atop',
  DstOver = 'destination-over',
  DstIn = 'destination-in',
  DstOut = 'destination-out',
  DstAtop = 'destination-atop',
  Lighter = 'lighter',
  Copy = 'copy',
  Xor = 'xor',
  Multiply = 'multiply',
  Screen = 'screen',
  Overlay = 'overlay',
  Darken = 'darken',
}

// 图片重复方式（Flutter: ImageRepeat）
export enum ImageRepeat {
  NoRepeat = 'no-repeat',
  Repeat = 'repeat',
  RepeatX = 'repeat-x',
  RepeatY = 'repeat-y',
}

// 形状类型
export enum ShapeType {
  Rectangle = 'rectangle',
  Circle = 'circle',
  Triangle = 'triangle',
  Arrow = 'arrow',
}

// Wrap 对齐方式
export enum WrapAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
  SpaceBetween = 'spaceBetween',
  SpaceAround = 'spaceAround',
  SpaceEvenly = 'spaceEvenly',
}

// Wrap 交叉轴对齐
export enum WrapCrossAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
}
