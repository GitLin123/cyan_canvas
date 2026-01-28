import { Ticker } from './ticker';
import { RenderNode } from './RenderNode';
import { EventManager } from './events/index'; 

export interface EngineOptions {
  // 画布
  canvas?: HTMLCanvasElement;
  containerId?: string;
  width?: number;
  height?: number;
  // 设备像素比，默认使用窗口设备像素比
  pixelRatio?: number;
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
  // 记录所有需要重绘的节点
  private _dirtyNodes: Set<RenderNode> = new Set();
  // 离屏渲染画布
  private _offscreenCanvas: HTMLCanvasElement;
  // 离屏渲染上下文
  private _offscreenCtx: CanvasRenderingContext2D;
  private _frameCount: number = 0;
  private eventManager: EventManager;

  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options);
    this.ctx = this.canvas.getContext('2d')!;
    // 创建离屏渲染画布
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;


    this.ticker = new Ticker();

    this.eventManager = new EventManager(
      this.canvas,
      () => this.root // 使用闭包确保总是能获取到最新的 root
    );
    this.setupCanvas(options.pixelRatio || window.devicePixelRatio);
    this.initPipeline();
  }

  private _resolveCanvas(options: EngineOptions): HTMLCanvasElement {
    if (options.canvas) {
      return options.canvas;
    }
    const canvas = document.createElement('canvas');
    canvas.width = options.width || 800;
    canvas.height = options.height || 600;

    // 挂载逻辑
    const container = options.containerId
      ? document.getElementById(options.containerId)
      : document.body;

    if (container) {
      container.appendChild(canvas);
    }
    return canvas;
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((elapsed, delta) => {
      // 只有在需要更新时才执行重绘，节省能耗
      if (this.root && (this.root._isDirty || this.root._hasDirtyChild)) {
        if (!(this.root as any).engine) (this.root as any).engine = this;
        this._frameCount++;
        this.runPipeline(delta);
        this.resetDirtyStatus();
      }
    });
  }

  /**
   * 递归重置标记
  */
  private resetDirtyStatus() {
    // 原有的 resetDirtyStatus 改为安全递归，跳过 null/undefined 节点
    const safeReset = (node: any) => {
      if (!node) return;
      node._isDirty = false;
      node._hasDirtyChild = false;
      if (Array.isArray(node.children)) {
        node.children.forEach((child: any) => safeReset(child));
      }
    };
    safeReset(this.root);
  }

  /**
   * @param pixelRatio 设备像素比
   */
  private setupCanvas(pixelRatio: number) {
    const { width, height } = this.canvas.getBoundingClientRect();
    const fullWeight = width * pixelRatio;
    const fullHeight = height * pixelRatio;
    [this.canvas, this._offscreenCanvas].forEach(canvas => {
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
    const start = performance.now();
    if (!this.root || (!this.root._isDirty && !this.root._hasDirtyChild)) return;

    const dirtyRects = this.root.consumeDirtyRects();
    const pr = window.devicePixelRatio || 1;
    const offCtx = this._offscreenCtx;
    const rect = this.canvas.getBoundingClientRect();

    let finalRects = dirtyRects;
    if (dirtyRects.length > 10) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      dirtyRects.forEach(r => {
        minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
        maxX = Math.max(maxX, r.x + r.width); maxY = Math.max(maxY, r.y + r.height);
      });
      finalRects = [{ x: minX, y: minY, width: maxX - minX, height: maxY - minY }];
    }
    if (finalRects.length === 0) dirtyRects.push({ x: 0, y: 0, width: rect.width, height: rect.height });

    offCtx.save();
    offCtx.setTransform(pr, 0, 0, pr, 0, 0);

    offCtx.beginPath();
    dirtyRects.forEach(rect => {
      offCtx.rect(rect.x, rect.y, rect.width, rect.height);
    });
    offCtx.clip();

    dirtyRects.forEach(rect => {
      offCtx.clearRect(rect.x, rect.y, rect.width, rect.height);
    });


    this.root.layout({
      maxWidth: rect.width,
      minWidth: 0,
      maxHeight: rect.height,
      minHeight: 0
    });
    this.root.paint(offCtx);

    offCtx.restore();

    this.ctx.save();
    finalRects.forEach(r => {
      if (r.width > 0 && r.height > 0) {
        this.ctx.clearRect(r.x, r.y, r.width, r.height);
        this.ctx.drawImage(
          this._offscreenCanvas,
          r.x * pr, r.y * pr, r.width * pr, r.height * pr, // 离屏源（物理像素）
          r.x, r.y, r.width, r.height                       // 主屏目标（逻辑像素）
        );
      }

    });
    this.ctx.restore();

    this._isDirty = false;
    const end = performance.now();
    if (this._frameCount % 60 === 0) {
      console.log(`[Performance] 渲染耗时: ${(end - start).toFixed(4)}ms`);
    }

  }

  /**
   * 当状态改变时，通知引擎需要刷新
   */
  public markNeedsPaint(node: RenderNode) {
    this._isDirty = true;
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