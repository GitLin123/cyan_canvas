import { Rect, Size } from "../types/node";
import { BoxConstraints } from "../types/container";
import { RenderNode } from '../RenderNode';

export class TextNode extends RenderNode {
  private _text: string = '';
  private _fontSize: number = 16;
  private _color: string = 'black';
  private _fontFamily: string = 'sans-serif';

  // 测量文字需要一个临时 context
  private static _measureCtx: CanvasRenderingContext2D | null = null;

  constructor(text?: string) {
    super();
    this._text = text || '';
  }

  // 属性 Getter/Setter
  public get text() { return this._text; }
  public set text(v: string) {
    if (this._text === v) return;
    this._text = v;
    this.markNeedsLayout();
  }

  public set fontSize(v: number) { this._fontSize = v; this.markNeedsLayout(); }
  public set color(v: string) { this._color = v; this.markNeedsPaint(); }

  private getFontString() {
    return `${this._fontSize}px ${this._fontFamily}`;
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!TextNode._measureCtx) {
      TextNode._measureCtx = document.createElement('canvas').getContext('2d');
    }

    const ctx = TextNode._measureCtx!;
    ctx.font = this.getFontString();
    const metrics = ctx.measureText(this._text);

    // 计算逻辑尺寸：宽度是测量值，高度近似为字号（或加上行高倍率）
    return {
      width: metrics.width,
      height: this._fontSize * 1.2
    };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    if (!this._text) return;

    ctx.font = this.getFontString();
    ctx.fillStyle = this._color;
    ctx.textBaseline = 'top'; // 方便对齐
    ctx.fillText(this._text, 0, 0);
  }
}