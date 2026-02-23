import { PaintingContext } from './PaintingContext';

/**
 * Canvas 2D 后端 — 直接代理到 CanvasRenderingContext2D
 * 零开销薄包装，保持现有行为完全不变
 */
export class Canvas2DPaintingContext implements PaintingContext {
  private _ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx;
  }

  /** 获取底层原生 context（Engine 合成阶段需要） */
  get nativeContext(): CanvasRenderingContext2D { return this._ctx; }

  /** 切换底层 context（resize 时需要） */
  setContext(ctx: CanvasRenderingContext2D) { this._ctx = ctx; }

  // === 状态管理 ===
  save() { this._ctx.save(); }
  restore() { this._ctx.restore(); }

  // === 变换 ===
  translate(x: number, y: number) { this._ctx.translate(x, y); }
  rotate(angle: number) { this._ctx.rotate(angle); }
  scale(x: number, y: number) { this._ctx.scale(x, y); }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number) {
    this._ctx.setTransform(a, b, c, d, e, f);
  }

  // === 路径操作 ===
  beginPath() { this._ctx.beginPath(); }
  moveTo(x: number, y: number) { this._ctx.moveTo(x, y); }
  lineTo(x: number, y: number) { this._ctx.lineTo(x, y); }
  arc(x: number, y: number, r: number, start: number, end: number, ccw?: boolean) {
    this._ctx.arc(x, y, r, start, end, ccw);
  }
  arcTo(x1: number, y1: number, x2: number, y2: number, r: number) {
    this._ctx.arcTo(x1, y1, x2, y2, r);
  }
  closePath() { this._ctx.closePath(); }
  rect(x: number, y: number, w: number, h: number) { this._ctx.rect(x, y, w, h); }
  roundRect(x: number, y: number, w: number, h: number, radii: number | number[]) {
    this._ctx.roundRect(x, y, w, h, radii);
  }

  // === 填充 ===
  get fillStyle(): string | CanvasGradient | CanvasPattern { return this._ctx.fillStyle; }
  set fillStyle(value: string | CanvasGradient | CanvasPattern) { this._ctx.fillStyle = value; }
  fill() { this._ctx.fill(); }
  fillRect(x: number, y: number, w: number, h: number) { this._ctx.fillRect(x, y, w, h); }

  // === 描边 ===
  get strokeStyle(): string | CanvasGradient | CanvasPattern { return this._ctx.strokeStyle; }
  set strokeStyle(value: string | CanvasGradient | CanvasPattern) { this._ctx.strokeStyle = value; }
  get lineWidth(): number { return this._ctx.lineWidth; }
  set lineWidth(value: number) { this._ctx.lineWidth = value; }
  stroke() { this._ctx.stroke(); }

  // === 文本 ===
  get font(): string { return this._ctx.font; }
  set font(value: string) { this._ctx.font = value; }
  get textBaseline(): CanvasTextBaseline { return this._ctx.textBaseline; }
  set textBaseline(value: CanvasTextBaseline) { this._ctx.textBaseline = value; }
  get textAlign(): CanvasTextAlign { return this._ctx.textAlign; }
  set textAlign(value: CanvasTextAlign) { this._ctx.textAlign = value; }
  fillText(text: string, x: number, y: number, maxWidth?: number) {
    if (maxWidth !== undefined) this._ctx.fillText(text, x, y, maxWidth);
    else this._ctx.fillText(text, x, y);
  }
  measureText(text: string): TextMetrics { return this._ctx.measureText(text); }

  // === 图像 ===
  drawImage(image: CanvasImageSource, ...args: number[]) {
    (this._ctx.drawImage as any)(image, ...args);
  }

  // === 裁剪 ===
  clip() { this._ctx.clip(); }

  // === 透明度 ===
  get globalAlpha(): number { return this._ctx.globalAlpha; }
  set globalAlpha(value: number) { this._ctx.globalAlpha = value; }

  // === 阴影 ===
  get shadowColor(): string { return this._ctx.shadowColor; }
  set shadowColor(value: string) { this._ctx.shadowColor = value; }
  get shadowOffsetX(): number { return this._ctx.shadowOffsetX; }
  set shadowOffsetX(value: number) { this._ctx.shadowOffsetX = value; }
  get shadowOffsetY(): number { return this._ctx.shadowOffsetY; }
  set shadowOffsetY(value: number) { this._ctx.shadowOffsetY = value; }
  get shadowBlur(): number { return this._ctx.shadowBlur; }
  set shadowBlur(value: number) { this._ctx.shadowBlur = value; }

  // === 渐变工厂 ===
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this._ctx.createLinearGradient(x0, y0, x1, y1);
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return this._ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  // === 清除 ===
  clearRect(x: number, y: number, w: number, h: number) { this._ctx.clearRect(x, y, w, h); }
}
