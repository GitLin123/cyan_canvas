import { RenderNode } from '../RenderNode';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';

export class ContainerNode extends RenderNode {
  public padding: number = 0;
  public color: string = 'transparent';
  public margin: number = 0;
  public border: number = 0;
  public borderRadius: number = 0;
  public borderColor: string = 'transparent';

  constructor() {
    super();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 有效容器尺寸（优先使用声明的宽高，但受父约束限制）
    const availWidth = Math.min(this.width ?? constraints.maxWidth, constraints.maxWidth);
    const availHeight = Math.min(this.height ?? constraints.maxHeight, constraints.maxHeight);

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

    // 布局所有子节点：子节点相对于 container 的内边距区域定位（不做堆叠，仅放在内左上）
    let contentWidth = 0;
    let contentHeight = 0;
    this.children.forEach((child, idx) => {
      // 传入内约束进行 layout
      child.layout(innerConstraints);
      // 将子节点放在内区域（支持多个子节点叠放；若需布局策略可扩展）
      child.x = this.margin + this.border + this.padding;
      child.y = this.margin + this.border + this.padding;
      contentWidth = Math.max(contentWidth, child.width);
      contentHeight = Math.max(contentHeight, child.height);
    });

    // 理想尺寸：子内容 + padding + border（margin 会计入最终尺寸以实现外边距效果）
    const innerTotalX = contentWidth + this.padding * 2 + this.border * 2;
    const innerTotalY = contentHeight + this.padding * 2 + this.border * 2;

    const idealWidth = innerTotalX + this.margin * 2;
    const idealHeight = innerTotalY + this.margin * 2;

    // 最终尺寸：若显式指定则优先，否则在约束范围内取理想尺寸
    const finalWidth = this.width !== undefined && this.width !== null
      ? this.width
      : Math.max(constraints.minWidth, Math.min(constraints.maxWidth, idealWidth));
    const finalHeight = this.height !== undefined && this.height !== null
      ? this.height
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

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // 计算绘制区域（排除 margin 区域）
    const drawX = this.margin;
    const drawY = this.margin;
    const drawW = Math.max(0, this.width - this.margin * 2);
    const drawH = Math.max(0, this.height - this.margin * 2);

    const innerX = drawX + this.border / 2;
    const innerY = drawY + this.border / 2;
    const innerW = Math.max(0, drawW - this.border);
    const innerH = Math.max(0, drawH - this.border);

    // 背景（在 border 内侧）
    if (this.color && this.color !== 'transparent') {
      this.roundRectPath(ctx, innerX, innerY, innerW, innerH, this.borderRadius);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    // 边框
    if (this.border > 0 && this.borderColor && this.borderColor !== 'transparent') {
      ctx.lineWidth = this.border;
      ctx.strokeStyle = this.borderColor;
      this.roundRectPath(ctx, innerX, innerY, innerW, innerH, this.borderRadius);
      ctx.stroke();
    }
  }
}