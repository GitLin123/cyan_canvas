import type { RenderingBackend, AABB } from '../RenderingBackend';
import type { PaintingContext } from '../PaintingContext';
import { WebGLPaintingContext } from './WebGLPaintingContext';

/**
 * WebGL 渲染后端
 * 使用 WebGL context 进行硬件加速渲染
 */
export class WebGLRenderingBackend implements RenderingBackend {
  public readonly canvas: HTMLCanvasElement;
  private _gl: WebGLRenderingContext;
  private _paintingContext: WebGLPaintingContext;
  private _width = 0;
  private _height = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', {
      alpha: false,
      stencil: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) throw new Error('WebGL not supported');
    this._gl = gl;
    this._paintingContext = new WebGLPaintingContext(gl);

    // 默认 blend 模式
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(1, 1, 1, 1);
  }

  resize(width: number, height: number, pixelRatio: number): void {
    this._width = width;
    this._height = height;
    this.canvas.width = width * pixelRatio;
    this.canvas.height = height * pixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.canvas.style.background = '#ffffff';
    this._gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  getPaintingContext(): PaintingContext {
    return this._paintingContext;
  }

  beginFullFrame(width: number, height: number, pixelRatio: number): void {
    const gl = this._gl;
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this._paintingContext.setProjection(width, height, pixelRatio);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    gl.disable(gl.STENCIL_TEST);
  }

  beginDirtyFrame(_regions: AABB[], width: number, height: number, pixelRatio: number): void {
    // WebGL 后端始终全量重绘，避免 scissor + stencil clip 交互导致闪烁
    this.beginFullFrame(width, height, pixelRatio);
  }

  compositeFullFrame(): void {
    // WebGL 直接渲染到屏幕，无需额外合成
    this._gl.flush();
  }

  compositeDirtyRegions(_regions: AABB[], _pixelRatio: number): void {
    // 全量重绘模式，直接 flush
    this._gl.flush();
  }

  dispose(): void {
    this._paintingContext.dispose();
    const ext = this._gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  }
}
