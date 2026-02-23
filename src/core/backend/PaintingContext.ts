/**
 * 渲染后端抽象接口
 * 签名与 CanvasRenderingContext2D 对齐，覆盖引擎中所有实际使用的 API
 */
export interface PaintingContext {
  // === 状态管理 ===
  save(): void;
  restore(): void;

  // === 变换 ===
  translate(x: number, y: number): void;
  rotate(angle: number): void;
  scale(x: number, y: number): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;

  // === 路径操作 ===
  beginPath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  closePath(): void;
  rect(x: number, y: number, w: number, h: number): void;
  roundRect(x: number, y: number, w: number, h: number, radii: number | number[]): void;

  // === 填充 ===
  get fillStyle(): string | CanvasGradient | CanvasPattern;
  set fillStyle(value: string | CanvasGradient | CanvasPattern);
  fill(): void;
  fillRect(x: number, y: number, w: number, h: number): void;

  // === 描边 ===
  get strokeStyle(): string | CanvasGradient | CanvasPattern;
  set strokeStyle(value: string | CanvasGradient | CanvasPattern);
  get lineWidth(): number;
  set lineWidth(value: number);
  stroke(): void;

  // === 文本 ===
  get font(): string;
  set font(value: string);
  get textBaseline(): CanvasTextBaseline;
  set textBaseline(value: CanvasTextBaseline);
  get textAlign(): CanvasTextAlign;
  set textAlign(value: CanvasTextAlign);
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  measureText(text: string): TextMetrics;

  // === 图像 ===
  drawImage(image: CanvasImageSource, dx: number, dy: number): void;
  drawImage(image: CanvasImageSource, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number,
            dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: CanvasImageSource, ...args: number[]): void;

  // === 裁剪 ===
  clip(): void;

  // === 透明度 ===
  get globalAlpha(): number;
  set globalAlpha(value: number);

  // === 阴影 ===
  get shadowColor(): string;
  set shadowColor(value: string);
  get shadowOffsetX(): number;
  set shadowOffsetX(value: number);
  get shadowOffsetY(): number;
  set shadowOffsetY(value: number);
  get shadowBlur(): number;
  set shadowBlur(value: number);

  // === 渐变工厂 ===
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;

  // === 清除 ===
  clearRect(x: number, y: number, w: number, h: number): void;
}