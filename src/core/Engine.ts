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

    // 2.5 重建空间索引
    this.spatialIndex.rebuild(this.root);

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

    this._needsFrame = false;
    this.pipelineOwner.flushPaint();
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
