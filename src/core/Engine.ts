import { Ticker } from './ticker';
import { RenderNode } from './RenderNode';
import { PipelineOwner } from './PipelineOwner';
import { EventManager } from './events/index';
import { ScrollEventManager } from './events/ScrollEventManager';
import { SpatialIndex } from './spatial/SpatialIndex';
import type { RenderingBackend } from './backend/RenderingBackend';
import { Canvas2DRenderingBackend } from './backend/Canvas2DRenderingBackend';
import { WebGLRenderingBackend } from './backend/webgl/WebGLRenderingBackend';
import type { EngineOptions } from './types/engine';

export type { EngineOptions };

export class CyanEngine {
  public canvas: HTMLCanvasElement;
  public ticker: Ticker;
  public pipelineOwner: PipelineOwner;
  public backend: RenderingBackend;

  private _root: RenderNode | null = null;
  private _needsFrame: boolean = true;
  private _frameCount: number = 0;
  private eventManager: EventManager;
  private scrollEventManager: ScrollEventManager;
  public readonly spatialIndex = new SpatialIndex();
  public debugDirtyRegions: boolean = false;
  public debugStats = { dirtyNodeCount: 0, dirtyRegionCount: 0 };
  private _resizeHandler: () => void = () => {};

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
    this.backend = this._createBackend(options.renderer || 'canvas2d');

    this.pipelineOwner = new PipelineOwner(() => {
      this._needsFrame = true;
    });

    this.resize();
    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);

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

  private _createBackend(renderer: 'canvas2d' | 'webgl' | 'auto'): RenderingBackend {
    if (renderer === 'webgl' || renderer === 'auto') {
      try {
        return new WebGLRenderingBackend(this.canvas);
      } catch (e) {
        if (renderer === 'webgl') throw e;
        // auto 模式：WebGL 失败，降级到 Canvas 2D
        console.warn('[CyanEngine] WebGL not available, falling back to Canvas 2D');
      }
    }
    return new Canvas2DRenderingBackend(this.canvas);
  }

  /**
   * 处理画布大小调整
   * 当浏览器缩放时，必须同步更新物理像素尺寸
   */
  public resize() {
    const pr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.backend.resize(width, height, pr);

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
    const fullWidth = width * pixelRatio;
    const fullHeight = height * pixelRatio;
    this.canvas.width = fullWidth;
    this.canvas.height = fullHeight;
    if (this.backend instanceof Canvas2DRenderingBackend) {
      this.backend.setupScale(pixelRatio);
    }
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
    this.debugStats.dirtyNodeCount = this.pipelineOwner.dirtyNodeCount;

    this.pipelineOwner.flushPaint();
    const dirtyRegions = this.pipelineOwner.dirtyRegionManager.flush(width, height);

    this.debugStats.dirtyRegionCount = dirtyRegions === null ? -1 : dirtyRegions.length;

    const paintCtx = this.backend.getPaintingContext();

    if (dirtyRegions === null) {
      // --- 全量重绘 ---
      this.backend.beginFullFrame(width, height, pr);
      this.root.paint(paintCtx);
      this.backend.compositeFullFrame();
    } else if (dirtyRegions.length > 0) {
      // --- 局部重绘 ---
      this.backend.beginDirtyFrame(dirtyRegions, width, height, pr);
      this.root.paint(paintCtx);
      this.backend.compositeDirtyRegions(dirtyRegions, pr);
    }
    // dirtyRegions.length === 0: 无脏区域，跳过绘制

    // Debug: 高亮脏区域（仅 Canvas 2D 后端支持）
    if (this.debugDirtyRegions && this.backend instanceof Canvas2DRenderingBackend) {
      const ctx = this.backend.mainCtx;
      ctx.save();
      ctx.setTransform(pr, 0, 0, pr, 0, 0);

      if (dirtyRegions === null) {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.18)';
        ctx.fillRect(0, 0, width, height);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, width, height);
      } else if (dirtyRegions.length > 0) {
        for (const r of dirtyRegions) {
          const w = r.maxX - r.minX;
          const h = r.maxY - r.minY;
          ctx.fillStyle = 'rgba(255, 0, 0, 0.18)';
          ctx.fillRect(r.minX, r.minY, w, h);
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(r.minX, r.minY, w, h);
        }
      }

      ctx.restore();
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

  public dispose() {
    this.ticker.stop();
    window.removeEventListener('resize', this._resizeHandler);
    this.eventManager.dispose();
    this.scrollEventManager.dispose();
    this.backend.dispose();
    if (this._root) {
      this._root.detach();
      this._root = null;
    }
    this.canvas.remove();
  }
}
