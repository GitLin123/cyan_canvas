import { Ticker } from './Ticker';
import { RenderNode } from './RenderNode'; // 假设你已有或将有这个基类

export interface EngineOptions {
  // 画布
  canvas: HTMLCanvasElement;
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
  // 离屏渲染画布
  private _offscreenCanvas: HTMLCanvasElement;
  // 离屏渲染上下文
  private _offscreenCtx: CanvasRenderingContext2D;
  private _frameCount: number = 0;


  constructor(options: EngineOptions) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d')!;
    // 创建离屏渲染画布
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;
    
    this.ticker = new Ticker();

    this.setupCanvas(options.pixelRatio || window.devicePixelRatio);
    this.initPipeline();
    this.initEvent();
  }

  /**
   * 初始化渲染管线
   */
  private initPipeline() {
    this.ticker.add((elapsed, delta) => {
      // 只有在需要更新时才执行重绘，节省能耗
      if(this.root &&this.root._isDirty) {
        this._frameCount++;
        this.runPipeline(delta);
        this.resetDirtyStatus(this.root);
      }
    });
  }

  /**
   * 递归重置标记
  */
 private resetDirtyStatus(node: RenderNode) {
  (node as any)._isDirty = false;
  node.children.forEach(child => this.resetDirtyStatus(child));
 }


  /**
   * 初始化事件
  */
  private initEvent() {
    this.canvas.addEventListener('click', (e:MouseEvent) => {
      if(!this.root) return;
      //获取相对坐标
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // 命中测试
      const target = this.root.hitTest(x, y);
      if(target && target.onClick) {
        target.onClick(e);
        // 点击后可能改变了状态，标记需要重绘
        this.markNeedsPaint();
      }
    })
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
  if (!this.root || !this.root._isDirty) return;

  const dirtyRects = this.root.consumeDirtyRects();
  const pr = window.devicePixelRatio || 1;
  const offCtx = this._offscreenCtx;
  const rect = this.canvas.getBoundingClientRect();

  let finalRects = dirtyRects;
  if(dirtyRects.length > 10) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    dirtyRects.forEach(r => {
      minX = Math.min(minX, r.x); minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w); maxY = Math.max(maxY, r.y + r.h);
    });
    finalRects = [{ x: minX, y: minY, w: maxX - minX, h: maxY - minY }];
  }
  if(finalRects.length === 0) dirtyRects.push({ x: 0, y: 0, w: rect.width, h: rect.height });

  offCtx.save();
  offCtx.setTransform(pr, 0, 0, pr, 0, 0);

  offCtx.beginPath();
  dirtyRects.forEach(rect => {
    offCtx.rect(rect.x, rect.y, rect.w, rect.h);
  });
  offCtx.clip();

  dirtyRects.forEach(rect => {
    offCtx.clearRect(rect.x, rect.y, rect.w, rect.h);
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
    if (r.w > 0 && r.h > 0) {
      this.ctx.clearRect(r.x, r.y, r.w, r.h);
      this.ctx.drawImage(
        this._offscreenCanvas,
        r.x * pr, r.y * pr, r.w * pr, r.h * pr, // 离屏源（物理像素）
        r.x, r.y, r.w, r.h                       // 主屏目标（逻辑像素）
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
  public markNeedsPaint() {
    this._isDirty = true;
  }

  
  public start() {
    this.ticker.start();
  }

  public stop() {
    this.ticker.stop();
  }
}