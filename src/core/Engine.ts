import { Ticker } from './Ticker';
import { RenderNode } from './nodes/base/RenderNode';
import { PipelineOwner } from './PipelineOwner';
import { EventManager } from './events/index';
import { SpatialIndex } from './spatial/SpatialIndex';
import { Monitor } from './monitor';
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
  // 渲染循环相关
  private _needsFrame: boolean = true;
  private _frameCount: number = 0;
  private _hasInitialLayout: boolean = false;
  private eventManager: EventManager;
  public readonly spatialIndex = new SpatialIndex();
  public debugDirtyRegions: boolean = false;
  public debugStats = { dirtyNodeCount: 0, dirtyRegionCount: 0 };
  private _resizeHandler: () => void = () => { };
  private _resizeListeners: Set<(width: number, height: number) => void> = new Set();
  private _cachedNodeCount: number = 0;

  /** 订阅窗口 resize 事件，返回取消订阅函数 */
  public onResize(listener: (width: number, height: number) => void): () => void {
    this._resizeListeners.add(listener);
    return () => this._resizeListeners.delete(listener);
  }

  public get root(): RenderNode | null {
    return this._root;
  }
  public set root(node: RenderNode | null) {
    if (this._root) this._root.detach();
    this._root = node;
    if (node) {
      node.parent = null;
      node.attach(this.pipelineOwner);
      // 计算并缓存节点总数
      this._cachedNodeCount = this._countNodes(node);
      // 重置初始布局标志
      this._hasInitialLayout = false;
    } else {
      this._cachedNodeCount = 0;
    }
    this.pipelineOwner.dirtyRegionManager.markFullRepaint();
    this._needsFrame = true;
  }

  constructor(options: EngineOptions) {
    this.canvas = this._resolveCanvas(options);
    this.backend = this._createBackend(options.renderer || 'webgl');

    this.pipelineOwner = new PipelineOwner(() => {
      this._needsFrame = true;
    });

    this.resize();
    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);

    this.ticker = new Ticker();
    this.eventManager = new EventManager(this.canvas, () => this.root, this.spatialIndex);
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

    for (const listener of this._resizeListeners) {
      listener(width, height);
    }
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
  private runPipeline(_delta: number) {
    if (!this.root) return;
    const pr = window.devicePixelRatio || 1;
    const width = this.canvas.width / pr;
    const height = this.canvas.height / pr;

    // 性能监控：记录各阶段时间
    let layoutTime = 0;
    let paintTime = 0;
    let compositeTime = 0;

    // 1. 布局（仅在需要时执行，或首次渲染）
    const layoutStart = performance.now();
    const needsLayout = this.pipelineOwner.needsLayout || !this._hasInitialLayout;
    if (needsLayout) {
      this.root.layout({
        maxWidth: width,
        minWidth: 0,
        maxHeight: height,
        minHeight: 0,
      });
      this._hasInitialLayout = true;
    }
    layoutTime = performance.now() - layoutStart;

    // 2. 重建空间索引（仅在布局后更新）
    if (needsLayout) {
      this.spatialIndex.rebuild(this.root);
    }

    // 3. 收集脏节点的新 bounds，然后获取合并后的脏矩形
    this.debugStats.dirtyNodeCount = this.pipelineOwner.dirtyNodeCount;

    this.pipelineOwner.flushPaint();
    const dirtyRegions = this.pipelineOwner.dirtyRegionManager.flush(width, height);

    this.debugStats.dirtyRegionCount = dirtyRegions === null ? -1 : dirtyRegions.length;

    const paintCtx = this.backend.getPaintingContext();

    // 4. 绘制
    const paintStart = performance.now();
    if (dirtyRegions === null) {
      // --- 全量重绘 ---
      this.backend.beginFullFrame(width, height, pr);
      this.root.paint(paintCtx);
      this.backend.compositeFullFrame();
    } else if (dirtyRegions.length > 0) {
      // --- 局部重绘 ---
      this.backend.beginDirtyFrame(dirtyRegions, width, height, pr);
      this.root.paint(paintCtx);
      const compositeStart = performance.now();
      this.backend.compositeDirtyRegions(dirtyRegions, pr);
      compositeTime = performance.now() - compositeStart;
    }
    paintTime = performance.now() - paintStart;

    this._needsFrame = false;

    // 记录性能数据
    Monitor.recordFrame({
      layoutTime,
      paintTime,
      compositeTime,
      dirtyNodeCount: this.debugStats.dirtyNodeCount,
      dirtyRegionCount: this.debugStats.dirtyRegionCount,
      nodeCount: this._cachedNodeCount,
    });
  }

  /**
   * 计算节点总数
   */
  private _countNodes(node: RenderNode | null): number {
    if (!node) return 0;
    let count = 1;
    if ('children' in node && Array.isArray((node as any).children)) {
      for (const child of (node as any).children) {
        count += this._countNodes(child);
      }
    }
    return count;
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
    this.backend.dispose();
    if (this._root) {
      this._root.detach();
      this._root = null;
    }
    this.canvas.remove();
  }
}
