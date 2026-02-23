import type { PaintingContext } from '../PaintingContext';
import { MatrixStack } from './MatrixStack';
import { ShaderManager, ShaderProgram } from './ShaderManager';

/** 解析 CSS 颜色为 [r, g, b, a] (0~1) */
function parseColor(color: string): [number, number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      return [r, g, b, 1];
    }
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a];
  }
  if (color.startsWith('rgba')) {
    const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (m) return [+m[1] / 255, +m[2] / 255, +m[3] / 255, m[4] !== undefined ? +m[4] : 1];
  }
  if (color.startsWith('rgb')) {
    const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (m) return [+m[1] / 255, +m[2] / 255, +m[3] / 255, 1];
  }
  if (color === 'transparent') return [0, 0, 0, 0];
  if (color === 'white' || color === '#fff') return [1, 1, 1, 1];
  if (color === 'black') return [0, 0, 0, 1];
  return [0, 0, 0, 1];
}

interface DrawState {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  globalAlpha: number;
  font: string;
  textBaseline: CanvasTextBaseline;
  textAlign: CanvasTextAlign;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  hasClip: boolean;
}

function defaultState(): DrawState {
  return {
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    globalAlpha: 1,
    font: '10px sans-serif',
    textBaseline: 'alphabetic',
    textAlign: 'start',
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowBlur: 0,
    hasClip: false,
  };
}

function cloneState(s: DrawState): DrawState {
  return { ...s };
}

/**
 * WebGL 实现的 PaintingContext
 * 用 WebGL 模拟 Canvas 2D 的绘制 API
 */
export class WebGLPaintingContext implements PaintingContext {
  private _gl: WebGLRenderingContext;
  private _shaders: ShaderManager;
  private _matrix: MatrixStack = new MatrixStack();
  private _state: DrawState = defaultState();
  private _stateStack: DrawState[] = [];
  private _projMatrix = new Float32Array(16);
  private _mat4Buf = new Float32Array(16);
  private _clipDepth = 0; // 嵌套 clip 层级

  // 路径缓冲
  private _pathPoints: number[] = [];
  private _pathStartX = 0;
  private _pathStartY = 0;

  // 共享 VBO
  private _vbo: WebGLBuffer;

  // 离屏 Canvas 2D 用于文本光栅化和 measureText
  private _textCanvas: HTMLCanvasElement;
  private _textCtx: CanvasRenderingContext2D;

  // 设备像素比（用于高 DPI 文本光栅化）
  private _pixelRatio = 1;

  // 纹理缓存
  private _textureCache = new Map<CanvasImageSource, WebGLTexture>();

  // 文本纹理缓存：key = "font|color|baseline|text"
  private _textTexCache = new Map<string, { tex: WebGLTexture; texW: number; texH: number; cssW: number; cssH: number; canvasW: number; canvasH: number }>();
  private _textTexCacheMaxSize = 512;

  // 预分配的 Float32Array 缓冲区，避免每次 draw call 都 new
  private _vertBuf = new Float32Array(1024);
  private _texRectBuf = new Float32Array(24); // 6 vertices * 4 floats

  constructor(gl: WebGLRenderingContext) {
    this._gl = gl;
    this._shaders = new ShaderManager(gl);
    this._vbo = gl.createBuffer()!;
    this._textCanvas = document.createElement('canvas');
    this._textCanvas.width = 2048;
    this._textCanvas.height = 256;
    this._textCtx = this._textCanvas.getContext('2d')!;
  }

  /** 设置正交投影矩阵（每帧开始时调用） */
  setProjection(width: number, height: number, pixelRatio: number = 1): void {
    this._pixelRatio = pixelRatio;
    // 每帧重置矩阵栈和状态栈，防止上一帧 save/restore 不平衡导致状态泄漏
    this._matrix.reset();
    this._stateStack.length = 0;
    this._state = defaultState();
    this._clipDepth = 0;
    const m = this._projMatrix;
    m[0] = 2 / width; m[1] = 0;           m[2] = 0;  m[3] = 0;
    m[4] = 0;          m[5] = -2 / height; m[6] = 0;  m[7] = 0;
    m[8] = 0;          m[9] = 0;           m[10] = 1; m[11] = 0;
    m[12] = -1;        m[13] = 1;          m[14] = 0; m[15] = 1;
  }

  // === 状态管理 ===
  save(): void {
    this._matrix.save();
    this._stateStack.push(cloneState(this._state));
  }

  restore(): void {
    this._matrix.restore();
    if (this._stateStack.length > 0) {
      const prevHadClip = this._state.hasClip;
      this._state = this._stateStack.pop()!;
      if (prevHadClip) {
        // 当前层有 clip，需要递减 clip 深度
        this._clipDepth--;
        const gl = this._gl;
        if (this._clipDepth <= 0) {
          // 没有更多 clip 层，完全关闭 stencil
          this._clipDepth = 0;
          gl.disable(gl.STENCIL_TEST);
          gl.clear(gl.STENCIL_BUFFER_BIT);
        } else {
          // 还有外层 clip，恢复到外层的 stencil 值
          // 先把当前层的 stencil 区域递减回去
          gl.stencilFunc(gl.ALWAYS, 0, 0xFF);
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
          gl.colorMask(false, false, false, false);
          // 重绘当前 clip 路径到 stencil（递减）
          // 简化：直接设置 stencilFunc 为外层深度
          gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
          gl.stencilFunc(gl.LEQUAL, this._clipDepth, 0xFF);
          gl.colorMask(true, true, true, true);
        }
      }
    }
  }

  // === 变换 ===
  translate(x: number, y: number): void { this._matrix.translate(x, y); }
  rotate(angle: number): void { this._matrix.rotate(angle); }
  scale(x: number, y: number): void { this._matrix.scale(x, y); }
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void {
    this._matrix.setTransform(a, b, c, d, e, f);
  }

  // === 路径操作 ===
  beginPath(): void { this._pathPoints = []; }
  moveTo(x: number, y: number): void {
    this._pathStartX = x;
    this._pathStartY = y;
    this._pathPoints.push(x, y);
  }
  lineTo(x: number, y: number): void { this._pathPoints.push(x, y); }
  closePath(): void {
    if (this._pathPoints.length >= 2) {
      this._pathPoints.push(this._pathStartX, this._pathStartY);
    }
  }

  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, ccw?: boolean): void {
    const segments = Math.max(16, Math.ceil(Math.abs(endAngle - startAngle) / (Math.PI * 2) * 64));
    let start = startAngle;
    let end = endAngle;
    if (ccw && end > start) end -= Math.PI * 2;
    if (!ccw && end < start) end += Math.PI * 2;
    const step = (end - start) / segments;
    for (let i = 0; i <= segments; i++) {
      const a = start + step * i;
      this._pathPoints.push(x + Math.cos(a) * radius, y + Math.sin(a) * radius);
    }
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    // 简化实现：用直线近似
    this._pathPoints.push(x1, y1);
    this._pathPoints.push(x2, y2);
  }

  rect(x: number, y: number, w: number, h: number): void {
    this._pathPoints.push(x, y, x + w, y, x + w, y + h, x, y + h, x, y);
  }

  roundRect(x: number, y: number, w: number, h: number, radii: number | number[]): void {
    const r = typeof radii === 'number' ? radii : radii[0] || 0;
    const cr = Math.min(r, w / 2, h / 2);
    if (cr <= 0) { this.rect(x, y, w, h); return; }
    const segs = 8;
    const corners = [
      { cx: x + w - cr, cy: y + cr, sa: -Math.PI / 2, ea: 0 },
      { cx: x + w - cr, cy: y + h - cr, sa: 0, ea: Math.PI / 2 },
      { cx: x + cr, cy: y + h - cr, sa: Math.PI / 2, ea: Math.PI },
      { cx: x + cr, cy: y + cr, sa: Math.PI, ea: Math.PI * 1.5 },
    ];
    for (const c of corners) {
      for (let i = 0; i <= segs; i++) {
        const a = c.sa + (c.ea - c.sa) * (i / segs);
        this._pathPoints.push(c.cx + Math.cos(a) * cr, c.cy + Math.sin(a) * cr);
      }
    }
    // 闭合
    if (this._pathPoints.length >= 2) {
      this._pathPoints.push(this._pathPoints[0], this._pathPoints[1]);
    }
  }

  // === 填充 ===
  get fillStyle(): string | CanvasGradient | CanvasPattern { return this._state.fillStyle; }
  set fillStyle(value: string | CanvasGradient | CanvasPattern) { this._state.fillStyle = value; }

  fill(): void {
    if (this._pathPoints.length < 6) return; // 至少 3 个点
    const triangles = this._triangulate(this._pathPoints);
    if (triangles.length === 0) return;
    const color = typeof this._state.fillStyle === 'string'
      ? parseColor(this._state.fillStyle) : [0, 0, 0, 1] as [number, number, number, number];
    this._drawTriangles(triangles, color);
  }

  fillRect(x: number, y: number, w: number, h: number): void {
    const verts = [x, y, x + w, y, x + w, y + h, x, y, x + w, y + h, x, y + h];
    const color = typeof this._state.fillStyle === 'string'
      ? parseColor(this._state.fillStyle) : [0, 0, 0, 1] as [number, number, number, number];
    this._drawTriangles(verts, color);
  }

  // === 描边 ===
  get strokeStyle(): string | CanvasGradient | CanvasPattern { return this._state.strokeStyle; }
  set strokeStyle(value: string | CanvasGradient | CanvasPattern) { this._state.strokeStyle = value; }
  get lineWidth(): number { return this._state.lineWidth; }
  set lineWidth(value: number) { this._state.lineWidth = value; }

  stroke(): void {
    if (this._pathPoints.length < 4) return;
    const color = typeof this._state.strokeStyle === 'string'
      ? parseColor(this._state.strokeStyle) : [0, 0, 0, 1] as [number, number, number, number];
    const hw = this._state.lineWidth / 2;
    const verts: number[] = [];
    for (let i = 0; i < this._pathPoints.length - 2; i += 2) {
      const x0 = this._pathPoints[i], y0 = this._pathPoints[i + 1];
      const x1 = this._pathPoints[i + 2], y1 = this._pathPoints[i + 3];
      const dx = x1 - x0, dy = y1 - y0;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) continue;
      const nx = -dy / len * hw, ny = dx / len * hw;
      verts.push(
        x0 + nx, y0 + ny, x1 + nx, y1 + ny, x1 - nx, y1 - ny,
        x0 + nx, y0 + ny, x1 - nx, y1 - ny, x0 - nx, y0 - ny,
      );
    }
    if (verts.length > 0) this._drawTriangles(verts, color);
  }

  // === 文本（离屏 Canvas 2D 光栅化 → WebGL 纹理） ===
  get font(): string { return this._state.font; }
  set font(value: string) { this._state.font = value; }
  get textBaseline(): CanvasTextBaseline { return this._state.textBaseline; }
  set textBaseline(value: CanvasTextBaseline) { this._state.textBaseline = value; }
  get textAlign(): CanvasTextAlign { return this._state.textAlign; }
  set textAlign(value: CanvasTextAlign) { this._state.textAlign = value; }

  fillText(text: string, x: number, y: number, _maxWidth?: number): void {
    if (!text) return;
    const pr = this._pixelRatio;
    const font = this._state.font;
    const color = typeof this._state.fillStyle === 'string' ? this._state.fillStyle : '#000';
    const baseline = this._state.textBaseline;

    // 缓存 key
    const cacheKey = `${font}|${color}|${baseline}|${pr}|${text}`;
    let cached = this._textTexCache.get(cacheKey);

    if (!cached) {
      const tc = this._textCtx;
      tc.font = font;
      const metrics = tc.measureText(text);
      const cssW = Math.ceil(metrics.width) + 4;
      const fontSizeMatch = font.match(/(\d+(?:\.\d+)?)px/);
      const fontSize = fontSizeMatch ? parseFloat(fontSizeMatch[1]) : 16;
      const cssH = Math.ceil(fontSize * 1.5) + 4;
      if (cssW <= 0 || cssH <= 0) return;

      const texW = Math.ceil(cssW * pr);
      const texH = Math.ceil(cssH * pr);
      this._textCanvas.width = Math.max(this._textCanvas.width, texW);
      this._textCanvas.height = Math.max(this._textCanvas.height, texH);
      tc.clearRect(0, 0, texW, texH);
      tc.save();
      tc.scale(pr, pr);
      tc.font = font;
      tc.textBaseline = baseline;
      tc.fillStyle = color;
      tc.fillText(text, 0, baseline === 'top' ? 0 : fontSize);
      tc.restore();

      // 创建独立纹理（不复用 _textCanvas 的缓存纹理）
      const gl = this._gl;
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._textCanvas as TexImageSource);

      cached = { tex, texW, texH, cssW, cssH, canvasW: this._textCanvas.width, canvasH: this._textCanvas.height };
      this._textTexCache.set(cacheKey, cached);

      // LRU 淘汰
      if (this._textTexCache.size > this._textTexCacheMaxSize) {
        const firstKey = this._textTexCache.keys().next().value!;
        const evicted = this._textTexCache.get(firstKey)!;
        gl.deleteTexture(evicted.tex);
        this._textTexCache.delete(firstKey);
      }
    }

    // 直接绑定缓存纹理绘制
    this._drawCachedTexturedRect(cached!, cached!.texW, cached!.texH, x, y, cached!.cssW, cached!.cssH);
  }

  measureText(text: string): TextMetrics {
    this._textCtx.font = this._state.font;
    return this._textCtx.measureText(text);
  }

  // === 图像 ===
  drawImage(image: CanvasImageSource, ...args: number[]): void {
    if (args.length === 2) {
      const [dx, dy] = args;
      const w = (image as HTMLImageElement).width || 100;
      const h = (image as HTMLImageElement).height || 100;
      this._drawTexturedRect(image, 0, 0, w, h, dx, dy, w, h);
    } else if (args.length === 4) {
      const [dx, dy, dw, dh] = args;
      const w = (image as HTMLImageElement).width || dw;
      const h = (image as HTMLImageElement).height || dh;
      this._drawTexturedRect(image, 0, 0, w, h, dx, dy, dw, dh);
    } else if (args.length === 8) {
      const [sx, sy, sw, sh, dx, dy, dw, dh] = args;
      this._drawTexturedRect(image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
  }

  // === 裁剪（Stencil buffer，支持嵌套） ===
  clip(): void {
    if (this._pathPoints.length < 6) return;
    const gl = this._gl;
    this._state.hasClip = true;
    this._clipDepth++;

    gl.enable(gl.STENCIL_TEST);
    // 将 clip 路径区域的 stencil 值递增
    gl.stencilFunc(gl.ALWAYS, this._clipDepth, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
    gl.colorMask(false, false, false, false);

    // 绘制路径到 stencil buffer
    const triangles = this._triangulate(this._pathPoints);
    if (triangles.length > 0) {
      this._drawTrianglesRaw(triangles);
    }

    gl.colorMask(true, true, true, true);
    // 后续绘制只在 stencil >= clipDepth 的区域通过
    gl.stencilFunc(gl.LEQUAL, this._clipDepth, 0xFF);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
  }

  // === 透明度 ===
  get globalAlpha(): number { return this._state.globalAlpha; }
  set globalAlpha(value: number) { this._state.globalAlpha = value; }

  // === 阴影（简化：不实现模糊，仅偏移） ===
  get shadowColor(): string { return this._state.shadowColor; }
  set shadowColor(value: string) { this._state.shadowColor = value; }
  get shadowOffsetX(): number { return this._state.shadowOffsetX; }
  set shadowOffsetX(value: number) { this._state.shadowOffsetX = value; }
  get shadowOffsetY(): number { return this._state.shadowOffsetY; }
  set shadowOffsetY(value: number) { this._state.shadowOffsetY = value; }
  get shadowBlur(): number { return this._state.shadowBlur; }
  set shadowBlur(value: number) { this._state.shadowBlur = value; }

  // === 渐变（返回 CanvasGradient，实际绘制时降级为纯色） ===
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this._textCtx.createLinearGradient(x0, y0, x1, y1);
  }
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient {
    return this._textCtx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  // === 清除 ===
  clearRect(x: number, y: number, w: number, h: number): void {
    const gl = this._gl;
    // 简化：如果是全屏清除，用 gl.clear
    if (x === 0 && y === 0) {
      gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    } else {
      gl.enable(gl.SCISSOR_TEST);
      const pr = 1; // 由外部处理 pixelRatio
      gl.scissor(x * pr, gl.canvas.height - (y + h) * pr, w * pr, h * pr);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.SCISSOR_TEST);
    }
  }

  // ============ Private helpers ============

  /** 简单扇形三角化（凸多边形或近似凸） */
  private _triangulate(points: number[]): number[] {
    const n = points.length / 2;
    if (n < 3) return [];
    const tris: number[] = [];
    const x0 = points[0], y0 = points[1];
    for (let i = 1; i < n - 1; i++) {
      tris.push(
        x0, y0,
        points[i * 2], points[i * 2 + 1],
        points[(i + 1) * 2], points[(i + 1) * 2 + 1],
      );
    }
    return tris;
  }

  /** 用 solid shader 绘制三角形列表 */
  private _drawTriangles(verts: number[], color: [number, number, number, number]): void {
    const gl = this._gl;
    const prog = this._shaders.solid;
    gl.useProgram(prog.program);

    const texCoordLoc = this._shaders.texture.attributes['a_texCoord'];
    if (texCoordLoc >= 0) gl.disableVertexAttribArray(texCoordLoc);

    // 使用预分配缓冲区
    const len = verts.length;
    if (this._vertBuf.length < len) this._vertBuf = new Float32Array(len * 2);
    this._vertBuf.set(verts);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertBuf.subarray(0, len), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(prog.attributes['a_position']);
    gl.vertexAttribPointer(prog.attributes['a_position'], 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(prog.uniforms['u_projection'], false, this._projMatrix);
    this._matrix.toMat4(this._mat4Buf);
    gl.uniformMatrix4fv(prog.uniforms['u_matrix'], false, this._mat4Buf);
    gl.uniform4f(prog.uniforms['u_color'], color[0], color[1], color[2], color[3]);
    gl.uniform1f(prog.uniforms['u_alpha'], this._state.globalAlpha);

    gl.drawArrays(gl.TRIANGLES, 0, len / 2);
  }

  /** 绘制三角形到 stencil（不设颜色） */
  private _drawTrianglesRaw(verts: number[]): void {
    const gl = this._gl;
    const prog = this._shaders.solid;
    gl.useProgram(prog.program);

    const texCoordLoc = this._shaders.texture.attributes['a_texCoord'];
    if (texCoordLoc >= 0) gl.disableVertexAttribArray(texCoordLoc);

    const len = verts.length;
    if (this._vertBuf.length < len) this._vertBuf = new Float32Array(len * 2);
    this._vertBuf.set(verts);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, this._vertBuf.subarray(0, len), gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(prog.attributes['a_position']);
    gl.vertexAttribPointer(prog.attributes['a_position'], 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(prog.uniforms['u_projection'], false, this._projMatrix);
    this._matrix.toMat4(this._mat4Buf);
    gl.uniformMatrix4fv(prog.uniforms['u_matrix'], false, this._mat4Buf);
    gl.uniform4f(prog.uniforms['u_color'], 0, 0, 0, 1);
    gl.uniform1f(prog.uniforms['u_alpha'], 1);

    gl.drawArrays(gl.TRIANGLES, 0, len / 2);
  }

  /** 获取或创建纹理 */
  private _getTexture(source: CanvasImageSource): WebGLTexture {
    let tex = this._textureCache.get(source);
    if (tex) return tex;
    const gl = this._gl;
    tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);
    this._textureCache.set(source, tex);
    return tex;
  }

  /** 用 texture shader 绘制纹理矩形 */
  private _drawTexturedRect(
    source: CanvasImageSource,
    sx: number, sy: number, sw: number, sh: number,
    dx: number, dy: number, dw: number, dh: number,
  ): void {
    const gl = this._gl;
    const prog = this._shaders.texture;
    gl.useProgram(prog.program);

    const isTextCanvas = source === this._textCanvas;
    let tex: WebGLTexture;
    if (isTextCanvas) {
      tex = this._getTexture(source);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source as TexImageSource);
    } else {
      tex = this._getTexture(source);
      gl.bindTexture(gl.TEXTURE_2D, tex);
    }

    const imgW = (source as any).width || sw;
    const imgH = (source as any).height || sh;
    const u0 = sx / imgW, v0 = sy / imgH;
    const u1 = (sx + sw) / imgW, v1 = (sy + sh) / imgH;

    this._uploadTexRect(dx, dy, dw, dh, u0, v0, u1, v1);

    const stride = 4 * 4;
    gl.enableVertexAttribArray(prog.attributes['a_position']);
    gl.vertexAttribPointer(prog.attributes['a_position'], 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(prog.attributes['a_texCoord']);
    gl.vertexAttribPointer(prog.attributes['a_texCoord'], 2, gl.FLOAT, false, stride, 8);

    gl.uniformMatrix4fv(prog.uniforms['u_projection'], false, this._projMatrix);
    this._matrix.toMat4(this._mat4Buf);
    gl.uniformMatrix4fv(prog.uniforms['u_matrix'], false, this._mat4Buf);
    gl.uniform1i(prog.uniforms['u_texture'], 0);
    gl.uniform1f(prog.uniforms['u_alpha'], this._state.globalAlpha);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /** 绘制已缓存的文本纹理 */
  private _drawCachedTexturedRect(
    entry: { tex: WebGLTexture; texW: number; texH: number; cssW: number; cssH: number; canvasW: number; canvasH: number },
    texW: number, texH: number,
    dx: number, dy: number, dw: number, dh: number,
  ): void {
    const gl = this._gl;
    const prog = this._shaders.texture;
    gl.useProgram(prog.program);
    gl.bindTexture(gl.TEXTURE_2D, entry.tex);

    // 纹理中有效区域的 UV（使用创建时的 canvas 尺寸）
    const u1 = texW / entry.canvasW;
    const v1 = texH / entry.canvasH;

    this._uploadTexRect(dx, dy, dw, dh, 0, 0, u1, v1);

    const stride = 4 * 4;
    gl.enableVertexAttribArray(prog.attributes['a_position']);
    gl.vertexAttribPointer(prog.attributes['a_position'], 2, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(prog.attributes['a_texCoord']);
    gl.vertexAttribPointer(prog.attributes['a_texCoord'], 2, gl.FLOAT, false, stride, 8);

    gl.uniformMatrix4fv(prog.uniforms['u_projection'], false, this._projMatrix);
    this._matrix.toMat4(this._mat4Buf);
    gl.uniformMatrix4fv(prog.uniforms['u_matrix'], false, this._mat4Buf);
    gl.uniform1i(prog.uniforms['u_texture'], 0);
    gl.uniform1f(prog.uniforms['u_alpha'], this._state.globalAlpha);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  /** 上传纹理矩形顶点到 VBO（预分配缓冲区） */
  private _uploadTexRect(
    dx: number, dy: number, dw: number, dh: number,
    u0: number, v0: number, u1: number, v1: number,
  ): void {
    const d = this._texRectBuf;
    d[0] = dx;      d[1] = dy;      d[2] = u0; d[3] = v0;
    d[4] = dx + dw; d[5] = dy;      d[6] = u1; d[7] = v0;
    d[8] = dx + dw; d[9] = dy + dh; d[10] = u1; d[11] = v1;
    d[12] = dx;     d[13] = dy;     d[14] = u0; d[15] = v0;
    d[16] = dx + dw; d[17] = dy + dh; d[18] = u1; d[19] = v1;
    d[20] = dx;     d[21] = dy + dh; d[22] = u0; d[23] = v1;

    const gl = this._gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
    gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
  }

  /** 释放资源 */
  dispose(): void {
    const gl = this._gl;
    this._shaders.dispose();
    gl.deleteBuffer(this._vbo);
    for (const tex of this._textureCache.values()) {
      gl.deleteTexture(tex);
    }
    this._textureCache.clear();
    for (const entry of this._textTexCache.values()) {
      gl.deleteTexture(entry.tex);
    }
    this._textTexCache.clear();
  }
}