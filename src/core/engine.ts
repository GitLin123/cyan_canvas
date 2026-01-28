import { Ticker } from './ticker';
import { RenderNode } from './RenderNode';

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


  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options);
    this.ctx = this.canvas.getContext('2d')!;
    // 创建离屏渲染画布
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;

    this.ticker = new Ticker();

    this.setupCanvas(options.pixelRatio || window.devicePixelRatio);
    this.initPipeline();
    this.initEvent();
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
   * 初始化事件
  */
  private initEvent() {
    this.canvas.addEventListener('click', (e: MouseEvent) => {
      if (!this.root) return;

      // --- 修正开始 ---
      // 1. 获取 Canvas 在屏幕上的矩形区域
      const rect = this.canvas.getBoundingClientRect();

      // 2. 获取 Canvas 的边框宽度 (浏览器计算后的样式)
      // getBoundingClientRect 包含边框，但 Canvas 绘图区是从边框内部开始的
      const style = window.getComputedStyle(this.canvas);
      const borderLeft = parseFloat(style.borderLeftWidth) || 0;
      const borderTop = parseFloat(style.borderTopWidth) || 0;
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingTop = parseFloat(style.paddingTop) || 0;

      // 3. 计算缩放比例 (处理 CSS width 与 内部 width 不一致的情况)
      // 逻辑宽度 = canvas.width / pixelRatio。如果 CSS 设置了 width: 100%，可能导致拉伸。
      // 我们需要算出：1个屏幕像素 等于 多少个逻辑像素
      const logicalWidth = this.canvas.width /  window.devicePixelRatio;
      // rect.width 包含了 border + padding + content
      // 我们需要 content 的显示宽度
      const contentWidth = rect.width - borderLeft - (parseFloat(style.borderRightWidth) || 0) - paddingLeft - (parseFloat(style.paddingRight) || 0);

      const scaleX = contentWidth > 0 ? logicalWidth / contentWidth : 1;
      const scaleY = scaleX; // 通常保持纵横比一致，或者单独计算 height

      // 4. 计算相对于 Canvas 绘图区左上角的逻辑坐标
      // (鼠标屏幕坐标 - Canvas屏幕坐标 - 边框 - 内边距) * 缩放比例
      const x = (e.clientX - rect.left - borderLeft - paddingLeft) * scaleX;
      const y = (e.clientY - rect.top - borderTop - paddingTop) * scaleY;
      // --- 修正结束 ---

      // 5. 减去根节点自身的偏移 (Container 的 x/y)
      const localX = x - this.root.x;
      const localY = y - this.root.y;

      const target = this.root.hitTest(localX, localY);

      if (target && target.onClick) {
        target.onClick(e);
        // 如果是在 React 环境下，状态更新会自动触发重绘，无需手动处理
      }
    });
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
    // 1. 移除 if (!this.root) 的拦截，允许引擎先启动等待内容
    // 2. 移除 this.resetDirtyStatus()，保留初始的 _isDirty=true 状态

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