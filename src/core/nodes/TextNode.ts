import { Rect, Size } from '../types/node';
import { BoxConstraints } from '../types/container';
import {
  TextAlign,
  TextOverflow,
  FontWeight,
  FontStyle,
  TextDecoration,
  TextDirection,
  TextShadow,
} from '../types/container';
import { RenderNode } from '../RenderNode';

export class TextNode extends RenderNode {
  private _text: string = '';
  private _fontSize: number = 16;
  private _color: string = 'black';
  private _fontFamily: string = 'sans-serif';
  private _textAlign: TextAlign = TextAlign.Left;
  private _textDirection: TextDirection = TextDirection.Ltr;
  private _fontWeight: FontWeight = FontWeight.W400;
  private _fontStyle: FontStyle = FontStyle.Normal;
  private _maxLines: number | null = null;
  private _textOverflow: TextOverflow = TextOverflow.Clip;
  private _opacity: number = 1;
  private _letterSpacing: number = 0;
  private _wordSpacing: number = 0;
  private _lineHeight: number = 1.2;
  private _heightFactor: number = 1;
  private _decoration: TextDecoration = TextDecoration.None;
  private _decorationColor: string = 'black';
  private _decorationThickness: number = 1;
  private _shadows: TextShadow[] = [];
  private _background: string = 'transparent';
  private _selectable: boolean = false;
  private _softWrap: boolean = true;
  private _semanticLabel: string = '';

  // 测量文字需要一个临时 context
  private static _measureCtx: CanvasRenderingContext2D | null = null;

  constructor(text?: string) {
    super();
    this._text = text || '';
  }

  // 属性 Getter/Setter
  public get text() {
    return this._text;
  }
  public set text(v: string) {
    if (this._text === v) return;
    this._text = v;
    this.markNeedsLayout();
  }

  public set fontSize(v: number) {
    if (this._fontSize === v) return;
    this._fontSize = v;
    this.markNeedsLayout();
  }

  public set color(v: string) {
    if (this._color === v) return;
    this._color = v;
    this.markNeedsPaint();
  }

  public set textAlign(v: TextAlign) {
    if (this._textAlign === v) return;
    this._textAlign = v;
    this.markNeedsPaint();
  }

  public set textDirection(v: TextDirection) {
    if (this._textDirection === v) return;
    this._textDirection = v;
    this.markNeedsPaint();
  }

  public set fontWeight(v: FontWeight) {
    if (this._fontWeight === v) return;
    this._fontWeight = v;
    this.markNeedsLayout();
  }

  public set fontStyle(v: FontStyle) {
    if (this._fontStyle === v) return;
    this._fontStyle = v;
    this.markNeedsLayout();
  }

  public set maxLines(v: number | null) {
    if (this._maxLines === v) return;
    this._maxLines = v;
    this.markNeedsLayout();
  }

  public set textOverflow(v: TextOverflow) {
    if (this._textOverflow === v) return;
    this._textOverflow = v;
    this.markNeedsPaint();
  }

  public set opacity(v: number) {
    if (this._opacity === v) return;
    this._opacity = Math.max(0, Math.min(1, v));
    this.markNeedsPaint();
  }

  public set letterSpacing(v: number) {
    if (this._letterSpacing === v) return;
    this._letterSpacing = v;
    this.markNeedsLayout();
  }

  public set wordSpacing(v: number) {
    if (this._wordSpacing === v) return;
    this._wordSpacing = v;
    this.markNeedsLayout();
  }

  public set lineHeight(v: number) {
    if (this._lineHeight === v) return;
    this._lineHeight = Math.max(0.5, v);
    this.markNeedsLayout();
  }

  public set heightFactor(v: number) {
    if (this._heightFactor === v) return;
    this._heightFactor = Math.max(0.5, v);
    this.markNeedsLayout();
  }

  public set decoration(v: TextDecoration) {
    if (this._decoration === v) return;
    this._decoration = v;
    this.markNeedsPaint();
  }

  public set decorationColor(v: string) {
    if (this._decorationColor === v) return;
    this._decorationColor = v;
    this.markNeedsPaint();
  }

  public set decorationThickness(v: number) {
    if (this._decorationThickness === v) return;
    this._decorationThickness = Math.max(0.5, v);
    this.markNeedsPaint();
  }

  public set shadows(v: TextShadow[]) {
    this._shadows = v;
    this.markNeedsPaint();
  }

  public set background(v: string) {
    if (this._background === v) return;
    this._background = v;
    this.markNeedsPaint();
  }

  public set selectable(v: boolean) {
    this._selectable = v;
  }

  public set softWrap(v: boolean) {
    if (this._softWrap === v) return;
    this._softWrap = v;
    this.markNeedsLayout();
  }

  public set semanticLabel(v: string) {
    this._semanticLabel = v;
  }

  private getFontString() {
    return `${this._fontStyle} ${this._fontWeight} ${this._fontSize}px ${this._fontFamily}`;
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!TextNode._measureCtx) {
      TextNode._measureCtx = document.createElement('canvas').getContext('2d');
    }

    const ctx = TextNode._measureCtx!;
    ctx.font = this.getFontString();

    const maxWidth = constraints.maxWidth === Number.POSITIVE_INFINITY ? 300 : constraints.maxWidth;

    // 将文本分行，考虑 maxLines
    const lines = this.splitLines(ctx, this._text, maxWidth);

    if (this._maxLines && this._maxLines > 0) {
      while (lines.length > this._maxLines) {
        lines.pop();
        // 在最后一行添加省略号（如果使用 ellipsis）
        if (this._textOverflow === TextOverflow.Ellipsis && lines.length > 0) {
          lines[lines.length - 1] += '...';
        }
      }
    }

    // 计算宽度：使用最长行的宽度或约束宽度
    let width = 0;
    for (const line of lines) {
      const metrics = ctx.measureText(line);
      width = Math.max(width, metrics.width);
    }
    width = Math.min(width, maxWidth);

    // 计算高度：行数 × 行高
    const lineHeightPx = this._fontSize * this._lineHeight;
    const height = lines.length * lineHeightPx;

    // 优先使用 preferredWidth
    // 其次：如果设置了非左对齐 textAlign 且约束有限，使用约束宽度（这样可以正确对齐）
    // 否则使用计算的内容宽度
    let resultWidth = width;
    if (this._preferredWidth !== undefined && this._preferredWidth !== null) {
      resultWidth = this._preferredWidth;
    } else if (
      this._textAlign !== TextAlign.Left &&
      this._textAlign !== TextAlign.Start &&
      constraints.maxWidth !== Number.POSITIVE_INFINITY
    ) {
      resultWidth = constraints.maxWidth;
    }

    return {
      width: Math.max(constraints.minWidth, Math.min(constraints.maxWidth, resultWidth)),
      height: Math.max(constraints.minHeight, Math.min(constraints.maxHeight, height)),
    };
  }

  /**
   * 将文本分行，考虑最大宽度
   */
  private splitLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const lines: string[] = [];
    const words = text.split('\n'); // 先按换行符分割

    for (const word of words) {
      let line = '';
      const chars = word.split('');

      for (const char of chars) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && line.length > 0) {
          lines.push(line);
          line = char;
        } else {
          line = testLine;
        }
      }

      if (line.length > 0) {
        lines.push(line);
      }
    }

    return lines.length > 0 ? lines : [''];
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    if (!this._text) return;

    ctx.font = this.getFontString();
    ctx.fillStyle = this._color;
    ctx.globalAlpha = this._opacity;
    ctx.textBaseline = 'top';

    const maxWidth = this.width || 300;
    const lines = this.splitLines(ctx, this._text, maxWidth);

    // 应用 maxLines 限制
    let displayLines = lines;
    if (this._maxLines && this._maxLines > 0) {
      displayLines = lines.slice(0, this._maxLines);
      if (this._textOverflow === TextOverflow.Ellipsis && lines.length > this._maxLines) {
        displayLines[displayLines.length - 1] += '...';
      }
    }

    const lineHeightPx = this._fontSize * this._lineHeight;

    // 绘制每一行文本
    for (let i = 0; i < displayLines.length; i++) {
      const line = displayLines[i];
      let x = 0;

      // 根据 textAlign 计算 x 坐标
      switch (this._textAlign) {
        case TextAlign.Center:
          {
            const metrics = ctx.measureText(line);
            x = (this.width - metrics.width) / 2;
          }
          break;
        case TextAlign.Right:
        case TextAlign.End:
          {
            const metrics = ctx.measureText(line);
            x = this.width - metrics.width;
          }
          break;
        case TextAlign.Left:
        case TextAlign.Start:
        case TextAlign.Justify:
        default:
          x = 0;
          break;
      }

      ctx.fillText(line, Math.max(0, x), i * lineHeightPx);
    }

    ctx.globalAlpha = 1;
  }
}
