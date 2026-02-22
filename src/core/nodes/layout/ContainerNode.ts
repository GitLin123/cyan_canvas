import { RenderNode } from '../../RenderNode';
import {
  BoxConstraints,
  BoxDecoration,
  BoxShadow,
  Gradient,
  BoxBorder,
  Alignment,
  Clip,
  BlendMode,
} from '../../types/container';
import { Size } from '../../types/node';

export class ContainerNode extends RenderNode {
  public padding: number = 0;
  private _color: string = 'transparent';
  public margin: number = 0;
  public border: number = 0;
  private _borderRadius: number = 0;
  public borderColor: string = 'transparent';

  public get color(): string { return this._color; }
  public set color(v: string) {
    if (this._color === v) return;
    this._color = v;
    this.markNeedsPaint();
  }

  public get borderRadius(): number { return this._borderRadius; }
  public set borderRadius(v: number) {
    if (this._borderRadius === v) return;
    this._borderRadius = v;
    this.markNeedsPaint();
  }

  // 新增属性
  private _boxShadow: BoxShadow[] = [];
  private _gradient: Gradient | null = null;
  private _opacity: number = 1;
  private _decoration: BoxDecoration | null = null;
  private _alignment: Alignment = Alignment.Center;
  private _clipBehavior: Clip = Clip.None;
  private _blendMode: BlendMode = BlendMode.Normal;
  private _foregroundDecoration: BoxShadow[] = [];
  private _transform: { scaleX?: number; scaleY?: number; rotateZ?: number } = {};
  private _semanticContainer: boolean = true;

  constructor() {
    super();
  }

  // 装饰相关的 setter
  public set boxShadow(v: BoxShadow[]) {
    this._boxShadow = v;
    this.markNeedsPaint();
  }

  public set gradient(v: Gradient | null) {
    this._gradient = v;
    this.markNeedsPaint();
  }

  public set opacity(v: number) {
    if (this._opacity === v) return;
    this._opacity = Math.max(0, Math.min(1, v));
    this.markNeedsPaint();
  }

  public set decoration(v: BoxDecoration | null) {
    this._decoration = v;
    this.markNeedsPaint();
  }

  public set alignment(v: Alignment) {
    if (this._alignment === v) return;
    this._alignment = v;
    this.markNeedsLayout();
  }

  public set clipBehavior(v: Clip) {
    if (this._clipBehavior === v) return;
    this._clipBehavior = v;
    this.markNeedsPaint();
  }

  public set blendMode(v: BlendMode) {
    if (this._blendMode === v) return;
    this._blendMode = v;
    this.markNeedsPaint();
  }

  public set foregroundDecoration(v: BoxShadow[]) {
    this._foregroundDecoration = v;
    this.markNeedsPaint();
  }

  public set transform(v: { scaleX?: number; scaleY?: number; rotateZ?: number }) {
    this._transform = v;
    this.markNeedsPaint();
  }

  public set semanticContainer(v: boolean) {
    this._semanticContainer = v;
  }

  performLayout(constraints: BoxConstraints): Size {
    // 优先使用首选尺寸，否则占满约束空间
    const containerWidth = this._preferredWidth ?? constraints.maxWidth;
    const containerHeight = this._preferredHeight ?? constraints.maxHeight;

    // 应用约束限制
    const availWidth = Math.max(
      constraints.minWidth ?? 0,
      Math.min(constraints.maxWidth ?? containerWidth, containerWidth)
    );
    const availHeight = Math.max(
      constraints.minHeight ?? 0,
      Math.min(constraints.maxHeight ?? containerHeight, containerHeight)
    );

    // 内部可用空间：扣除 margin + border + padding
    const innerOffset = this.margin + this.border + this.padding;
    const innerMaxWidth = Math.max(0, availWidth - innerOffset * 2);
    const innerMaxHeight = Math.max(0, availHeight - innerOffset * 2);

    const innerConstraints: BoxConstraints = {
      minWidth: 0,
      maxWidth: innerMaxWidth,
      minHeight: 0,
      maxHeight: innerMaxHeight,
    };

    // 布局所有子节点
    let contentWidth = 0;
    let contentHeight = 0;
    this.children.forEach((child) => {
      child.layout(innerConstraints);
      child.setPosition(
        this.margin + this.border + this.padding,
        this.margin + this.border + this.padding
      );
      contentWidth = Math.max(contentWidth, child.width);
      contentHeight = Math.max(contentHeight, child.height);
    });

    // 理想尺寸
    const innerTotalX = contentWidth + this.padding * 2 + this.border * 2;
    const innerTotalY = contentHeight + this.padding * 2 + this.border * 2;
    const idealWidth = innerTotalX + this.margin * 2;
    const idealHeight = innerTotalY + this.margin * 2;

    // 最终尺寸
    const finalWidth =
      this._preferredWidth !== undefined && this._preferredWidth !== null
        ? this._preferredWidth
        : Math.max(constraints.minWidth, Math.min(constraints.maxWidth, idealWidth));
    const finalHeight =
      this._preferredHeight !== undefined && this._preferredHeight !== null
        ? this._preferredHeight
        : Math.max(constraints.minHeight, Math.min(constraints.maxHeight, idealHeight));

    return { width: finalWidth, height: finalHeight };
  }

  private roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    const radius = Math.max(0, Math.min(r, Math.min(w / 2, h / 2)));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  /**
   * 创建渐变对象
   */
  private createGradient(
    ctx: CanvasRenderingContext2D,
    gradient: Gradient,
    x: number,
    y: number,
    w: number,
    h: number
  ): CanvasGradient {
    let grad: CanvasGradient;

    if (gradient.type === 'linear') {
      const angle = ((gradient.angle || 0) * Math.PI) / 180;
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = Math.max(w, h) / 2;

      const x0 = centerX - Math.cos(angle) * radius;
      const y0 = centerY - Math.sin(angle) * radius;
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;

      grad = ctx.createLinearGradient(x0, y0, x1, y1);
    } else {
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = Math.max(w, h) / 2;
      grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    }

    // 添加颜色停点
    const colors = gradient.colors;
    const stops = gradient.stops || colors.map((_, i) => i / (colors.length - 1));

    for (let i = 0; i < colors.length; i++) {
      grad.addColorStop(Math.max(0, Math.min(1, stops[i])), colors[i]);
    }

    return grad;
  }

  /**
   * 绘制阴影
   */
  private drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, shadow: BoxShadow) {
    ctx.save();
    ctx.shadowColor = shadow.color;
    ctx.shadowOffsetX = shadow.offset.dx;
    ctx.shadowOffsetY = shadow.offset.dy;
    ctx.shadowBlur = shadow.blurRadius;

    this.roundRectPath(ctx, x, y, w, h, this.borderRadius);
    ctx.fillStyle = this.color || 'rgba(0,0,0,0.1)';
    ctx.fill();

    ctx.restore();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    ctx.globalAlpha = this._opacity;

    // 计算绘制区域
    const drawX = this.margin;
    const drawY = this.margin;
    const drawW = Math.max(0, this.width - this.margin * 2);
    const drawH = Math.max(0, this.height - this.margin * 2);

    const innerX = drawX + this.border / 2;
    const innerY = drawY + this.border / 2;
    const innerW = Math.max(0, drawW - this.border);
    const innerH = Math.max(0, drawH - this.border);

    // 绘制阴影
    if (this._boxShadow.length > 0) {
      for (const shadow of this._boxShadow) {
        this.drawShadow(ctx, innerX, innerY, innerW, innerH, shadow);
      }
    }

    // 背景
    if (this.color !== 'transparent' || this._gradient) {
      this.roundRectPath(ctx, innerX, innerY, innerW, innerH, this.borderRadius);

      if (this._gradient) {
        ctx.fillStyle = this.createGradient(ctx, this._gradient, innerX, innerY, innerW, innerH);
      } else {
        ctx.fillStyle = this.color;
      }
      ctx.fill();
    }

    // 边框
    if (this.border > 0 && this.borderColor !== 'transparent') {
      ctx.lineWidth = this.border;
      ctx.strokeStyle = this.borderColor;
      this.roundRectPath(ctx, innerX, innerY, innerW, innerH, this.borderRadius);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  // 重写 paint 以实现边界裁剪和滚动
  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    // 设置裁剪区域为 Container 的边界
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    // === 应用滚动偏移 ===
    ctx.translate(-this.scrollOffsetX, -this.scrollOffsetY);

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

}
