import { Ticker } from './ticker';
import { RenderNode } from './RenderNode';
import { EventManager } from './events/index';
import { ScrollEventManager } from './events/ScrollEventManager';

export interface EngineOptions {
  // 画布
  canvas?: HTMLCanvasElement;
  containerId?: string;
  width?: number;
  height?: number;
  // 设备像素比，默认使用窗口设备像素比
  pixelRatio?: number;
}
export interface PerformanceMetrics {
  fps: number;
  layoutTime: number;
  paintTime: number;
  totalFrameTime: number;
  drawCalls: number;
  dirtyRectsCount: number;
}

export class CyanEngine {
  // 渲染上下文
  public ctx: CanvasRenderingContext2D;
  // 画布
  public canvas: HTMLCanvasElement;
  // 渲染树的根节点
  public root: RenderNode | null = null;
  // 渲染循环
  public ticker: Ticker;
  // 脏检查：是否需要重新渲染
  private _isDirty: boolean = true;
  // 移除节点级脏矩形集合，使用全量重绘
  // 离屏渲染画布
  private _offscreenCanvas: HTMLCanvasElement;
  // 离屏渲染上下文
  private _offscreenCtx: CanvasRenderingContext2D;
  private _frameCount: number = 0;
  private eventManager: EventManager;
  private scrollEventManager: ScrollEventManager;

  private _showDashBoard: boolean = true;
  private _metrics: PerformanceMetrics = {
    fps: 0,
    layoutTime: 0,
    paintTime: 0,
    totalFrameTime: 0,
    drawCalls: 0,
    dirtyRectsCount: 0,
  };
  private _lastStatsUpdate: number = 0;
  private _drawCallCounter: number = 0;

  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options);
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
    // 创建离屏渲染画布
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;

    this.resize();

    window.addEventListener('resize', () => {
      this.resize();
    });

    this.ticker = new Ticker();

    this.eventManager = new EventManager(
      this.canvas,
      () => this.root // 使用闭包确保总是能获取到最新的 root
    );
    this.scrollEventManager = new ScrollEventManager(
      this.canvas,
      () => this.root,
      () => {
        this._isDirty = true;
      }
    );
    this.setupCanvas(options.pixelRatio || window.devicePixelRatio);
    this.initPipeline();
  }

  private _resolveCanvas(options: EngineOptions): HTMLCanvasElement {
    if (options.canvas) {
      return options.canvas;
    }
    const canvas = document.createElement('canvas');
    canvas.width = options.width || window.innerWidth;
    canvas.height = options.height || window.innerHeight;

    // 挂载逻辑
    const container = options.containerId ? document.getElementById(options.containerId) : document.body;

    if (container) {
      container.appendChild(canvas);
    }
    return canvas;
  }

  /**
   * 处理画布大小调整
   * 当浏览器缩放时，必须同步更新物理像素尺寸
   */
  public resize() {
    const pr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 物理像素大小
    this.canvas.width = width * pr;
    this.canvas.height = height * pr;
    this._offscreenCanvas.width = width * pr;
    this._offscreenCanvas.height = height * pr;

    // CSS 像素大小
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    // 设置画布背景为白色
    this.canvas.style.background = '#ffffff';

    // 标记根节点需要重新布局
    if (this.root && typeof this.root.markNeedsLayout === 'function') {
      this.root.markNeedsLayout();
    }

    // 标记全局脏，下一帧强制全屏重绘
    this._isDirty = true;
    // 统一由引擎层面控制脏标识，节点级脏标识已移除
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((elapsed, delta) => {
      // 只有在需要更新时才执行重绘（由引擎级别的 _isDirty 控制）
      if (this.root && this._isDirty) {
        if (!(this.root as any).engine) (this.root as any).engine = this;
        this._frameCount++;
        this.runPipeline(delta);
        // 引擎层面在绘制后会清除 _isDirty
      }
    });
  }

  /**
   * 递归重置标记
   */
  // 已移除节点级脏状态重置（统一由引擎层面控制）

  /**
   * @param pixelRatio 设备像素比
   */
  private setupCanvas(pixelRatio: number) {
    const { width, height } = this.canvas.getBoundingClientRect();
    const fullWeight = width * pixelRatio;
    const fullHeight = height * pixelRatio;
    [this.canvas, this._offscreenCanvas].forEach((canvas) => {
      canvas.width = fullWeight;
      canvas.height = fullHeight;
    });
    this.ctx.scale(pixelRatio, pixelRatio);
    this._offscreenCtx.scale(pixelRatio, pixelRatio);
  }

  /**
   * 核心管线：Update -> Layout -> Paint
   */
  private runPipeline(delta: number) {
    if (!this.root) return;
    // 1. 获取基础参数（直接从 canvas 的物理像素尺寸计算逻辑尺寸）
    const pr = window.devicePixelRatio || 1;
    const width = this.canvas.width / pr; // 逻辑宽度
    const height = this.canvas.height / pr; // 逻辑高度

    // 2. 布局（完整布局）
    this.root.layout({
      maxWidth: width,
      minWidth: 0,
      maxHeight: height,
      minHeight: 0,
    });

    // 3. 离屏全量绘制（先填白底以避免透明/黑底问题）
    const offCtx = this._offscreenCtx;
    offCtx.save();
    offCtx.setTransform(pr, 0, 0, pr, 0, 0);
    // 清除并填充白色背景（逻辑像素）
    offCtx.clearRect(0, 0, width, height);
    offCtx.fillStyle = '#ffffff';
    offCtx.fillRect(0, 0, width, height);
    this.root.paint(offCtx);
    offCtx.restore();

    // 4. 合成到主画布（物理像素）
    this.ctx.save();
    // 使用物理像素坐标进行清屏和绘制，先填白底再绘制离屏内容
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(
      this._offscreenCanvas,
      0,
      0,
      this._offscreenCanvas.width,
      this._offscreenCanvas.height,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.ctx.restore();

    // 清除引擎脏标识，下一次需要时由 markNeedsPaint 设置
    this._isDirty = false;
    // 重置统计中关于脏矩形的计数
    this._metrics.dirtyRectsCount = 0;
  }
  /**
   * 当状态改变时，通知引擎需要刷新
   */
  public markNeedsPaint(node: RenderNode) {
    this._isDirty = true;
  }

  private _renderDashBoard() {
    const ctx = this.ctx;
    const metrics = this._metrics;
    const pr = window.devicePixelRatio || 1;

    ctx.save();
    // 关键：重置所有变换，直接使用物理像素坐标绘制 UI
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 1. 绘制背景板 (放在右上角)
    const width = 180 * pr;
    const height = 100 * pr;
    const padding = 10 * pr;
    const x = this.canvas.width - width - padding;
    const y = padding;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y, width, height);

    // 2. 绘制文字
    ctx.fillStyle = '#00ff00';
    ctx.font = `${12 * pr}px monospace`;
    const textX = x + 10 * pr;
    let textY = y + 20 * pr;
    const step = 16 * pr;

    ctx.fillText(`FPS: ${this.ticker.getFPS()}`, textX, textY);
    ctx.fillText(`Layout: ${metrics.layoutTime.toFixed(2)}ms`, textX, (textY += step));
    ctx.fillText(`Paint: ${metrics.paintTime.toFixed(2)}ms`, textX, (textY += step));
    ctx.fillText(`DirtyRects: ${metrics.dirtyRectsCount}`, textX, (textY += step));
    ctx.fillText(`Resolution: ${this.canvas.width}x${this.canvas.height}`, textX, (textY += step));

    ctx.restore();
  }

  public start() {
    console.log('[Engine] Ticker starting...');
    this.ticker.start();

    // 强制触发一次首帧检查
    if (this.root) {
      this.markNeedsPaint(this.root);
    }
  }

  public stop() {
    this.ticker.stop();
  }
}
