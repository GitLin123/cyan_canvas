/**
 * Positioned - Stack 中的绝对定位节点
 * 相当于 Flutter 的 Positioned，通过 top/right/bottom/left 定位子节点
 * 必须作为 Stack 的子节点使用
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class PositionedNode extends RenderNode {
  private _top?: number;
  private _right?: number;
  private _bottom?: number;
  private _left?: number;

  public get top() { return this._top; }
  public set top(v: number | undefined) {
    if (this._top === v) return;
    this._top = v;
    this.markNeedsLayout();
  }

  public get right() { return this._right; }
  public set right(v: number | undefined) {
    if (this._right === v) return;
    this._right = v;
    this.markNeedsLayout();
  }

  public get bottom() { return this._bottom; }
  public set bottom(v: number | undefined) {
    if (this._bottom === v) return;
    this._bottom = v;
    this.markNeedsLayout();
  }

  public get left() { return this._left; }
  public set left(v: number | undefined) {
    if (this._left === v) return;
    this._left = v;
    this.markNeedsLayout();
  }

  performLayout(constraints: BoxConstraints): Size {
    // 根据 left/right/top/bottom 计算子节点约束
    let childMaxWidth = constraints.maxWidth;
    let childMaxHeight = constraints.maxHeight;

    const hasLeft = this._left !== undefined;
    const hasRight = this._right !== undefined;
    const hasTop = this._top !== undefined;
    const hasBottom = this._bottom !== undefined;

    // 如果同时指定了 left 和 right，子节点宽度被确定
    if (hasLeft && hasRight) {
      childMaxWidth = Math.max(0, constraints.maxWidth - this._left! - this._right!);
    }
    if (hasTop && hasBottom) {
      childMaxHeight = Math.max(0, constraints.maxHeight - this._top! - this._bottom!);
    }

    let childWidth = this._preferredWidth ?? childMaxWidth;
    let childHeight = this._preferredHeight ?? childMaxHeight;

    if (this.children.length > 0) {
      const child = this.children[0];
      const childConstraints: BoxConstraints =
        hasLeft && hasRight || hasTop && hasBottom
          ? {
              minWidth: hasLeft && hasRight ? childMaxWidth : 0,
              maxWidth: childMaxWidth,
              minHeight: hasTop && hasBottom ? childMaxHeight : 0,
              maxHeight: childMaxHeight,
            }
          : {
              minWidth: 0,
              maxWidth: childMaxWidth,
              minHeight: 0,
              maxHeight: childMaxHeight,
            };

      child.layout(childConstraints);
      childWidth = child.width;
      childHeight = child.height;

      // 计算位置
      let posX = 0;
      let posY = 0;

      if (hasLeft) {
        posX = this._left!;
      } else if (hasRight) {
        posX = constraints.maxWidth - childWidth - this._right!;
      }

      if (hasTop) {
        posY = this._top!;
      } else if (hasBottom) {
        posY = constraints.maxHeight - childHeight - this._bottom!;
      }

      child.setPosition(posX, posY);
    }

    return { width: constraints.maxWidth, height: constraints.maxHeight };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Positioned 本身不绘制
  }
}
