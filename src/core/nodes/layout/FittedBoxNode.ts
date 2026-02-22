/**
 * FittedBox - 缩放适配节点
 * 相当于 Flutter 的 FittedBox，将子节点缩放以适应父容器
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxFit } from '../../types/container';
import { Size } from '../../types/node';

export class FittedBoxNode extends RenderNode {
  private _fit: BoxFit = BoxFit.Contain;

  public get fit() { return this._fit; }
  public set fit(v: BoxFit) { if (this._fit === v) return; this._fit = v; this.markNeedsPaint(); }

  performLayout(constraints: BoxConstraints): Size {
    const width = this._preferredWidth ?? constraints.maxWidth;
    const height = this._preferredHeight ?? constraints.maxHeight;

    const finalWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, width));
    const finalHeight = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, height));

    if (this.children.length > 0) {
      const child = this.children[0];
      // 给子节点无约束，让其报告自然尺寸
      child.layout({
        minWidth: 0,
        maxWidth: Infinity,
        minHeight: 0,
        maxHeight: Infinity,
      });
      child.setPosition(0, 0);
    }

    return { width: finalWidth, height: finalHeight };
  }

  paint(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || this.alpha <= 0) return;
    if (this.children.length === 0) return;

    const child = this.children[0];
    const childW = child.width;
    const childH = child.height;

    if (childW <= 0 || childH <= 0) return;

    // 计算缩放比例
    let scaleX = this.width / childW;
    let scaleY = this.height / childH;

    switch (this._fit) {
      case BoxFit.Contain: {
        const s = Math.min(scaleX, scaleY);
        scaleX = s;
        scaleY = s;
        break;
      }
      case BoxFit.Cover: {
        const s = Math.max(scaleX, scaleY);
        scaleX = s;
        scaleY = s;
        break;
      }
      case BoxFit.FitWidth:
        scaleY = scaleX;
        break;
      case BoxFit.FitHeight:
        scaleX = scaleY;
        break;
      case BoxFit.Fill:
        // scaleX, scaleY 保持不同
        break;
      case BoxFit.ScaleDown: {
        const s = Math.min(scaleX, scaleY, 1);
        scaleX = s;
        scaleY = s;
        break;
      }
    }

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    // 裁剪到自身边界
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();

    // 居中缩放
    const scaledW = childW * scaleX;
    const scaledH = childH * scaleY;
    const dx = (this.width - scaledW) / 2;
    const dy = (this.height - scaledH) / 2;

    ctx.translate(dx, dy);
    ctx.scale(scaleX, scaleY);

    this.paintSelf(ctx);
    for (const c of this.children) {
      c.paint(ctx);
    }

    ctx.restore();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // FittedBox 本身不绘制
  }
}
