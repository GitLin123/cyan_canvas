import type { RenderingBackend, AABB } from './RenderingBackend';
import type { PaintingContext } from './PaintingContext';
import { Canvas2DPaintingContext } from './Canvas2DPaintingContext';

/**
 * Canvas 2D 渲染后端
 * 封装双画布（offscreen + main）合成逻辑
 */
export class Canvas2DRenderingBackend implements RenderingBackend {
  public readonly canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _offscreenCanvas: HTMLCanvasElement;
  private _offscreenCtx: CanvasRenderingContext2D;
  private _paintingContext: Canvas2DPaintingContext;
  private _mainPaintingContext: Canvas2DPaintingContext;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._ctx = canvas.getContext('2d', { alpha: false })!;
    this._offscreenCanvas = document.createElement('canvas');
    this._offscreenCtx = this._offscreenCanvas.getContext('2d')!;
    this._paintingContext = new Canvas2DPaintingContext(this._offscreenCtx);
    this._mainPaintingContext = new Canvas2DPaintingContext(this._ctx);
  }

  /** 主画布的 PaintingContext（用于 debug 绘制等） */
  get mainPaintingContext(): Canvas2DPaintingContext { return this._mainPaintingContext; }

  /** 主画布原生 ctx（Engine debug 高亮需要） */
  get mainCtx(): CanvasRenderingContext2D { return this._ctx; }

  /** 离屏画布（合成时 drawImage 需要） */
  get offscreenCanvas(): HTMLCanvasElement { return this._offscreenCanvas; }

  resize(width: number, height: number, pixelRatio: number): void {
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    this._offscreenCanvas.width = width * pixelRatio;
    this._offscreenCanvas.height = height * pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.background = '#ffffff';
  }

  setupScale(pixelRatio: number): void {
    this._ctx.scale(pixelRatio, pixelRatio);
    this._offscreenCtx.scale(pixelRatio, pixelRatio);
  }

  getPaintingContext(): PaintingContext {
    return this._paintingContext;
  }

  beginFullFrame(width: number, height: number, pixelRatio: number): void {
    const offCtx = this._offscreenCtx;
    offCtx.save();
    offCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    offCtx.clearRect(0, 0, width, height);
    offCtx.fillStyle = '#ffffff';
    offCtx.fillRect(0, 0, width, height);
  }

  beginDirtyFrame(regions: AABB[], width: number, height: number, pixelRatio: number): void {
    const offCtx = this._offscreenCtx;
    offCtx.save();
    offCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    // 构建脏区域 clip path
    offCtx.beginPath();
    for (const r of regions) {
      offCtx.rect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
    }
    offCtx.clip();

    // 清除脏区域并填白底
    for (const r of regions) {
      offCtx.clearRect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
      offCtx.fillStyle = '#ffffff';
      offCtx.fillRect(r.minX, r.minY, r.maxX - r.minX, r.maxY - r.minY);
    }
  }

  compositeFullFrame(): void {
    this._offscreenCtx.restore();
    this._ctx.save();
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.fillStyle = '#ffffff';
    this._ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this._ctx.drawImage(this._offscreenCanvas, 0, 0);
    this._ctx.restore();
  }

  compositeDirtyRegions(regions: AABB[], pixelRatio: number): void {
    this._offscreenCtx.restore();
    this._ctx.save();
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const r of regions) {
      const sx = r.minX * pixelRatio, sy = r.minY * pixelRatio;
      const sw = (r.maxX - r.minX) * pixelRatio, sh = (r.maxY - r.minY) * pixelRatio;
      this._ctx.drawImage(this._offscreenCanvas, sx, sy, sw, sh, sx, sy, sw, sh);
    }
    this._ctx.restore();
  }

  dispose(): void {
    // Canvas 2D 无需特殊清理
  }
}
