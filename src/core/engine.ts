import { Ticker } from './ticker';
import { RenderNode } from './RenderNode'; // 假设你已有或将有这个基类

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  pixelRatio?: number;
}

export class CyanEngine {
  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  public root: RenderNode | null = null; // 渲染树的根节点
  public ticker: Ticker;

  private _isDirty: boolean = true; // 脏检查：是否需要重新渲染

  constructor(options: EngineOptions) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.ticker = new Ticker();

    this.setupCanvas(options.pixelRatio || window.devicePixelRatio);
    this.initPipeline();
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((elapsed, delta) => {
      // 只有在需要更新时才执行重绘，节省能耗
      if (this._isDirty) {
        this.runPipeline(delta);
        this._isDirty = false;
      }
    });
  }

  /**
   * 核心管线：Update -> Layout -> Paint
   */
  private runPipeline(delta: number) {
    if (!this.root) return;

    // 1. 清理画布 (将来这里可以优化为脏矩形局部清理)
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. 布局阶段 (Layout Pass)
    // 借鉴 Flutter: Constraints Down, Sizes Up
    this.root.performLayout({
      maxWidth: this.canvas.width / (window.devicePixelRatio || 1),
      minWidth: 0,
      maxHeight: this.canvas.height / (window.devicePixelRatio || 1),
      minHeight: 0
    });

    // 3. 绘制阶段 (Paint Pass)
    this.ctx.save();
    // 渲染树递归绘制
    this.root.paint(this.ctx);
    this.ctx.restore();
  }

  /**
   * 当状态改变时，通知引擎需要刷新
   */
  public markNeedsPaint() {
    this._isDirty = true;
  }

  /**
   * 处理 Canvas 高清屏适配
   */
  private setupCanvas(pr: number) {
    const { width, height } = this.canvas.getBoundingClientRect();
    this.canvas.width = width * pr;
    this.canvas.height = height * pr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.scale(pr, pr);
  }

  public start() {
    this.ticker.start();
  }

  public stop() {
    this.ticker.stop();
  }
}