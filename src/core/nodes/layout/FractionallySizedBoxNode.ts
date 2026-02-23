/**
 * FractionallySizedBox - 按比例尺寸节点
 * 相当于 Flutter 的 FractionallySizedBox，根据父容器尺寸的百分比来确定自身尺寸
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper, Alignment } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

export class FractionallySizedBoxNode extends RenderNode {
  private _widthFactor?: number;  // 0~1 的比例
  private _heightFactor?: number;
  private _alignment: Alignment = Alignment.Center;

  public get widthFactor() { return this._widthFactor; }
  public set widthFactor(v: number | undefined) { if (this._widthFactor === v) return; this._widthFactor = v; this.markNeedsLayout(); }

  public get heightFactor() { return this._heightFactor; }
  public set heightFactor(v: number | undefined) { if (this._heightFactor === v) return; this._heightFactor = v; this.markNeedsLayout(); }

  public get alignment() { return this._alignment; }
  public set alignment(v: Alignment) { if (this._alignment === v) return; this._alignment = v; this.markNeedsLayout(); }

  performLayout(constraints: BoxConstraints): Size {
    // 自身占满父约束
    const selfWidth = constraints.maxWidth;
    const selfHeight = constraints.maxHeight;

    // 子节点按比例计算尺寸
    const childWidth = this._widthFactor !== undefined ? selfWidth * this._widthFactor : selfWidth;
    const childHeight = this._heightFactor !== undefined ? selfHeight * this._heightFactor : selfHeight;

    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(BoxConstraintsHelper.tight(childWidth, childHeight));

      // 根据对齐方式放置子节点
      const dx = (selfWidth - child.width) / 2;
      const dy = (selfHeight - child.height) / 2;
      child.setPosition(Math.max(0, dx), Math.max(0, dy));
    }

    return { width: selfWidth, height: selfHeight };
  }

  paintSelf(ctx: PaintingContext): void {
    // FractionallySizedBox 本身不绘制
  }
}
