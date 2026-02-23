/**
 * OverflowBox - 允许溢出节点
 * 相当于 Flutter 的 OverflowBox，允许子节点超出父容器的约束
 * 自身按父约束确定尺寸，但给子节点不同的约束
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, Alignment } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class OverflowBoxNode extends RenderNode {
  private _overflowMinWidth?: number;
  private _overflowMaxWidth?: number;
  private _overflowMinHeight?: number;
  private _overflowMaxHeight?: number;
  private _alignment: Alignment = Alignment.Center;

  public get overflowMinWidth() { return this._overflowMinWidth; }
  public set overflowMinWidth(v: number | undefined) { if (this._overflowMinWidth === v) return; this._overflowMinWidth = v; this.markNeedsLayout(); }

  public get overflowMaxWidth() { return this._overflowMaxWidth; }
  public set overflowMaxWidth(v: number | undefined) { if (this._overflowMaxWidth === v) return; this._overflowMaxWidth = v; this.markNeedsLayout(); }

  public get overflowMinHeight() { return this._overflowMinHeight; }
  public set overflowMinHeight(v: number | undefined) { if (this._overflowMinHeight === v) return; this._overflowMinHeight = v; this.markNeedsLayout(); }

  public get overflowMaxHeight() { return this._overflowMaxHeight; }
  public set overflowMaxHeight(v: number | undefined) { if (this._overflowMaxHeight === v) return; this._overflowMaxHeight = v; this.markNeedsLayout(); }

  public get alignment() { return this._alignment; }
  public set alignment(v: Alignment) { if (this._alignment === v) return; this._alignment = v; this.markNeedsLayout(); }

  performLayout(constraints: BoxConstraints): Size {
    // 自身按父约束确定尺寸
    const selfWidth = this._preferredWidth ?? constraints.maxWidth;
    const selfHeight = this._preferredHeight ?? constraints.maxHeight;

    const finalWidth = Math.max(constraints.minWidth, Math.min(constraints.maxWidth, selfWidth));
    const finalHeight = Math.max(constraints.minHeight, Math.min(constraints.maxHeight, selfHeight));

    if (this.children.length > 0) {
      const child = this.children[0];
      // 给子节点覆盖后的约束
      child.layout({
        minWidth: this._overflowMinWidth ?? constraints.minWidth,
        maxWidth: this._overflowMaxWidth ?? constraints.maxWidth,
        minHeight: this._overflowMinHeight ?? constraints.minHeight,
        maxHeight: this._overflowMaxHeight ?? constraints.maxHeight,
      });

      // 居中放置
      const dx = (finalWidth - child.width) / 2;
      const dy = (finalHeight - child.height) / 2;
      child.setPosition(dx, dy);
    }

    return { width: finalWidth, height: finalHeight };
  }

  paintSelf(ctx: PaintingContext): void {
    // OverflowBox 本身不绘制
  }
}
