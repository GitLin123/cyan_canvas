import { Ticker } from './ticker';
import { RenderNode } from './RenderNode';
import { PipelineOwner } from './PipelineOwner';
import { EventManager } from './events/index';
import { ScrollEventManager } from './events/ScrollEventManager';
import { SpatialIndex } from './spatial/SpatialIndex';

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
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public ticker: Ticker;
  public pipelineOwner: PipelineOwner;

  private _root: RenderNode | null = null;
  private _needsFrame: boolean = true;
  private _offscreenCanvas: HTMLCanvasElement;
  private _offscreenCtx: CanvasRenderingContext2D;
  private _frameCount: number = 0;
  private eventManager: EventManager;
  private scrollEventManager: ScrollEventManager;
  public readonly spatialIndex = new SpatialIndex();
  public debugDirtyRegions: boolean = false;
  public debugStats = { dirtyNodeCount: 0, dirtyRegionCount: 0 };

  public get root(): RenderNode | null {
    return this._root;
  }
  public set root(node: RenderNode | null) {
    if (this._root) this._root.detach();
    this._root = node;
    if (node) {
      node.parent = null;
      node.attach(this.pipelineOwner);
    }
    this.pipelineOwner.dirtyRegionManager.markFullRepaint();
    this._needsFrame = true;
  }

  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options);
    this.ctx = this.canvas.getContext('2d', { alpha: false })!;
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;

    this.pipelineOwner = new PipelineOwner(() => {
      this._needsFrame = true;
    });

    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.ticker = new Ticker();
    this.eventManager = new EventManager(this.canvas, () => this.root, this.spatialIndex);
    this.scrollEventManager = new ScrollEventManager(
      this.canvas,
      () => this.root,
      () => {
        this.pipelineOwner.dirtyRegionManager.markFullRepaint();
        this._needsFrame = true;
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

    this.eventManager?.invalidateCache();
    this.pipelineOwner.dirtyRegionManager.markFullRepaint();
    if (this.root) this.root.markNeedsLayout();
    this._needsFrame = true;
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((_elapsed, delta) => {
      if (this._root && this._needsFrame) {
        this._frameCount++;
        this.runPipeline(delta);
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
    [this.canvas, this._offscreenCanvas].forEach((canvas) => {
      canvas.width = fullWeight;
      canvas.height = fullHeight;
    });
    this.ctx.scale(pixelRatio, pixelRatio);
    this._offscreenCtx.scale(pixelRatio, pixelRatio);
  }

  /**
   * 核心管线：Update -> Layout -> Paint（支持脏矩形局部重绘）
   */
  private runPipeline(delta: number) {
    if (!this.root) return;
    const pr = window.devicePixelRatio || 1;
    const width = this.canvas.width / pr;
    const height = this.canvas.height / pr;

    // 1. 布局
    this.root.layout({
      maxWidth: width,
      minWidth: 0,
      maxHeight: height,
      minHeight: 0,
    });

    // 2. 重建空间索引（更新 worldX/worldY）
    this.spatialIndex.rebuild(this.root);

    // 3. 收集脏节点的新 bounds，然后获取合并后的脏矩形
    // Debug: 在 flushPaint 前统计脏节点数
    this.debugStats.dirtyNodeCount = this.pipelineOwner.dirtyNodeCount;

    this.pipelineOwner.flushPaint();
    const dirtyRegions = this.pipelineOwner.dirtyRegionManager.flush(width, height);

    // Debug: 统计脏矩形数量
    this.debugStats.dirtyRegionCount = dirtyRegions === null ? -1 : dirtyRegions.length;

    const offCtx = this._offscreenCtx;

    if (dirtyRegions === null) {
      // --- 全量重绘 ---
      offCtx.save();
      offCtx.setTransform(pr, 0, 0, pr, 0, 0);
      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(0, 0, width, height);
      this.root.paint(offCtx);
      offCtx.restore();

      // 合成到主画布
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this._offscreenCanvas, 0, 0);
      this.ctx.restore();
    } else if (dirtyRegions.length > 0) {
      // --- 局部重绘：只重绘脏矩形区域 ---
      offCtx.save();
      offCtx.setTransform(pr, 0, 0, pr, 0, 0);

      // 构建脏区域 clip path
      offCtx.beginPath();
      for (const r of dirtyRegions) {
        offCtx.rect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
      }
      offCtx.clip();

      // 清除脏区域并填白底
      for (const r of dirtyRegions) {
        offCtx.clearRect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
        offCtx.fillStyle = '#ffffff';
        offCtx.fillRect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
      }

      // 重绘整棵树（clip 保证只有脏区域被实际绘制）
      this.root.paint(offCtx);
      offCtx.restore();

      // 合成：只拷贝脏区域到主画布
      this.ctx.save();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      for (const r of dirtyRegions) {
        const sx = r.minX * pr, sy = r.minY * pr;
        const sw = (r.maxX - r.minX) * pr, sh = (r.maxY - r.minY) * pr;
        this.ctx.drawImage(this._offscreenCanvas, sx, sy, sw, sh, sx, sy, sw, sh);
      }
      this.ctx.restore();
    }
    // dirtyRegions.length === 0: 无脏区域，跳过绘制

    // Debug: 高亮脏区域
    if (this.debugDirtyRegions) {
      this.ctx.save();
      this.ctx.setTransform(pr, 0, 0, pr, 0, 0);

      if (dirtyRegions === null) {
        // 全量重绘：高亮整个视口
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.18)';
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, width, height);
      } else if (dirtyRegions.length > 0) {
        // 局部重绘：高亮脏矩形
        for (const r of dirtyRegions) {
          const w = r.maxX - r.minX;
          const h = r.maxY - r.minY;
          this.ctx.fillStyle = 'rgba(255, 0, 0, 0.18)';
          this.ctx.fillRect(r.minX, r.minY, w, h);
          this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
          this.ctx.lineWidth = 1.5;
          this.ctx.strokeRect(r.minX, r.minY, w, h);
        }
      }

      this.ctx.restore();
    }

    this._needsFrame = false;
  }

  public markNeedsPaint(_node?: RenderNode) {
    this._needsFrame = true;
  }

  public start() {
    this.ticker.start();
    this._needsFrame = true;
  }

  public stop() {
    this.ticker.stop();
  }
}
