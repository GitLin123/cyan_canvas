/**
 * 全局常量配置
 * 集中管理所有硬编码的数值、颜色和配置项
 */

// 空间索引配置
export const SPATIAL_INDEX = {
  /** R树的扇出因子，控制树的分支度 */
  RTREE_M: 16,
  /** 累积变更数量达到此阈值后触发树重建 */
  RTREE_REBUILD_THRESHOLD: 50,
  /** hitTest 缓存大小限制 */
  HIT_TEST_CACHE_SIZE: 1000,
} as const;

// 脏矩形管理配置
export const DIRTY_REGION = {
  /** 两个矩形间距小于此值时合并（避免过多小矩形） */
  MERGE_THRESHOLD: 64,
  /** 四叉树节点容量 */
  QUADTREE_CAPACITY: 8,
  /** 四叉树最大深度，防止重叠区域导致无限递归 */
  QUADTREE_MAX_DEPTH: 8,
  /** 脏区域覆盖面积超过视口此比例时退化为全量重绘 */
  FULL_REPAINT_COVERAGE_THRESHOLD: 0.99, // 从 0.95 提高到 0.99
} as const;

// 事件处理配置
export const EVENT = {
  /** 键盘滚动的基础步长（像素） */
  KEYBOARD_SCROLL_AMOUNT: 15,
  /** 空格键滚动倍数 */
  SPACE_KEY_SCROLL_MULTIPLIER: 10,
} as const;

// 手势识别配置
export const GESTURE = {
  /** 触摸滑动阈值（像素），用于区分点击和拖动 */
  TOUCH_SLOP: 18,
  /** 长按手势的触发延迟（毫秒） */
  LONG_PRESS_DELAY: 500,
} as const;

// 默认颜色
export const COLOR = {
  /** 默认文本颜色 */
  TEXT: 'black',
  /** 默认形状颜色 */
  SHAPE: 'white',
  /** 默认背景色（透明） */
  TRANSPARENT: 'transparent',
  /** 默认边框颜色 */
  BORDER: 'transparent',
  /** 占位图背景色 */
  PLACEHOLDER_BG: '#e0e0e0',
  /** 占位图边框色 */
  PLACEHOLDER_BORDER: '#bdbdbd',
  /** 画布背景色 */
  CANVAS_BG: '#ffffff',
  /** 默认黑色 */
  BLACK: '#000000',
} as const;

// 文本默认值
export const TEXT = {
  /** 默认字体大小 */
  FONT_SIZE: 16,
  /** 默认字体族 */
  FONT_FAMILY: 'sans-serif',
  /** 默认行高倍数 */
  LINE_HEIGHT: 1.2,
  /** 默认高度因子 */
  HEIGHT_FACTOR: 1,
  /** 默认装饰线厚度 */
  DECORATION_THICKNESS: 1,
  /** 文本测量时的默认最大宽度 */
  MAX_WIDTH: 300,
} as const;

// 形状默认值
export const SHAPE = {
  /** 默认宽度 */
  WIDTH: 100,
  /** 默认高度 */
  HEIGHT: 100,
} as const;

// 箭头节点默认值
export const ARROW = {
  /** 默认宽度 */
  WIDTH: 120,
  /** 默认高度 */
  HEIGHT: 60,
  /** 箭头头部宽度比例 */
  HEAD_WIDTH_RATIO: 0.35,
  /** 箭头头部高度比例 */
  HEAD_HEIGHT_RATIO: 1.2,
} as const;

// 图片默认值
export const IMAGE = {
  /** 默认不透明度 */
  OPACITY: 1,
  /** 默认滤镜质量 */
  FILTER_QUALITY: 'medium' as const,
  /** 占位图宽度 */
  PLACEHOLDER_WIDTH: 100,
  /** 占位图高度 */
  PLACEHOLDER_HEIGHT: 100,
} as const;

// 容器默认值
export const CONTAINER = {
  /** 默认内边距 */
  PADDING: 0,
  /** 默认外边距 */
  MARGIN: 0,
  /** 默认边框宽度 */
  BORDER: 0,
  /** 默认不透明度 */
  OPACITY: 1,
} as const;

// 布局默认值
export const LAYOUT = {
  /** 约束无效时的默认宽度 */
  FALLBACK_WIDTH: 100,
  /** 约束无效时的默认高度 */
  FALLBACK_HEIGHT: 100,
} as const;

// Wrap 布局默认值
export const WRAP = {
  /** 默认主轴方向间距 */
  SPACING: 0,
  /** 默认辅轴方向间距 */
  RUN_SPACING: 0,
} as const;

// 渲染配置
export const RENDERING = {
  /** 默认线宽 */
  LINE_WIDTH: 1,
  /** 默认全局透明度 */
  GLOBAL_ALPHA: 1,
  /** 默认字体设置 */
  FONT: '10px sans-serif',
  /** 默认文本基线 */
  TEXT_BASELINE: 'alphabetic' as const,
  /** 默认文本对齐 */
  TEXT_ALIGN: 'start' as const,
} as const;

// WebGL
export const WEBGL = {
  /** 离屏文本光栅化画布宽度 */
  TEXT_CANVAS_WIDTH: 2048,
  /** 离屏文本光栅化画布高度 */
  TEXT_CANVAS_HEIGHT: 256,
  /** 文本纹理缓存最大尺寸 */
  TEXT_TEXTURE_CACHE_SIZE: 512,
  /** 预分配顶点缓冲大小 */
  VERTEX_BUFFER_SIZE: 1024,
  /** 圆角绘制的分段数 */
  BORDER_RADIUS_SEGMENTS: 8,
} as const;

// 性能监控配置
export const PERFORMANCE = {
  /** FPS 统计更新间隔（毫秒） */
  FPS_UPDATE_INTERVAL: 500,
} as const;

// 画布默认配置
export const CANVAS = {
  /** 默认宽度（使用窗口宽度） */
  get DEFAULT_WIDTH() {
    return typeof window !== 'undefined' ? window.innerWidth : 800;
  },
  /** 默认高度（使用窗口高度） */
  get DEFAULT_HEIGHT() {
    return typeof window !== 'undefined' ? window.innerHeight : 600;
  },
} as const;
