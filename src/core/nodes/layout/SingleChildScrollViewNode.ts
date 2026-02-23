/**
 * SingleChildScrollView 容器 - 可滚动容器，支持单个子节点
 * 相当于 Flutter 的 SingleChildScrollView
 * 在有限视口内显示可能更大的内容，并支持滚动。
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints, BoxConstraintsHelper, Direction } from '../../types/container';
import { Size } from '../../types/node';
import { HitTestResult, HitTestEntry } from '../../events/HitTestResult';
import type { PaintingContext } from '../../backend/PaintingContext';

export class SingleChildScrollViewNode extends RenderNode {
  public direction: Direction = Direction.vertical; // 滚动方向，默认为竖直滚动

  constructor() {
    super();
    this.onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.scroll(e.deltaX, e.deltaY);
    };
  }

  performLayout(constraints: BoxConstraints): Size {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      return { width: 100, height: 100 };
    }

    // === 确定视口大小 ===
    // 视口大小由 preferredWidth/preferredHeight 或约束决定
    const viewportWidth =
      this._preferredWidth ??
      (constraints.maxWidth === Number.POSITIVE_INFINITY ? constraints.minWidth : constraints.maxWidth);
    const viewportHeight =
      this._preferredHeight ??
      (constraints.maxHeight === Number.POSITIVE_INFINITY ? constraints.minHeight : constraints.maxHeight);

    // === 布局子项（不受视口大小限制，允许其超出） ===
    if (this.children.length > 0) {
      const child = this.children[0];

      if (this.direction === Direction.vertical) {
        // 竖直滚动：子项宽度受约束，高度无界
        child.layout({
          minWidth: 0,
          maxWidth: viewportWidth,
          minHeight: 0,
          maxHeight: Number.POSITIVE_INFINITY,
        });
      } else {
        // 水平滚动：子项宽度无界，高度受约束
        child.layout({
          minWidth: 0,
          maxWidth: Number.POSITIVE_INFINITY,
          minHeight: 0,
          maxHeight: viewportHeight,
        });
      }

      // 子项放在原点，滚动由 base paint() 的 translate 处理
      child.setPosition(0, 0);
    }

    // === 返回视口尺寸（容器自身的大小就是视口大小） ===
    const finalWidth = Math.max(
      constraints.minWidth,
      Math.min(constraints.maxWidth === Number.POSITIVE_INFINITY ? viewportWidth : constraints.maxWidth, viewportWidth)
    );

    const finalHeight = Math.max(
      constraints.minHeight,
      Math.min(
        constraints.maxHeight === Number.POSITIVE_INFINITY ? viewportHeight : constraints.maxHeight,
        viewportHeight
      )
    );

    return { width: finalWidth, height: finalHeight };
  }

  // 视口始终需要裁剪，即使 scrollOffset 为 0
  paint(ctx: PaintingContext) {
    if (!this.visible || this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);
    ctx.beginPath();
    ctx.rect(0, 0, this.width, this.height);
    ctx.clip();
    ctx.translate(-this.scrollOffsetX, -this.scrollOffsetY);
    this.paintSelf(ctx);
    for (const child of this.children) child.paint(ctx);
    ctx.restore();
  }

  hitTest(result: HitTestResult, localX: number, localY: number): boolean {
    if (!this.visible) return false;
    if (localX < 0 || localX > this.width || localY < 0 || localY > this.height) return false;
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      const childX = localX + this.scrollOffsetX - child.x - child.offsetX;
      const childY = localY + this.scrollOffsetY - child.y - child.offsetY;
      if (child.hitTest(result, childX, childY)) break;
    }
    result.add(new HitTestEntry(this, localX, localY));
    return true;
  }

  paintSelf(_ctx: PaintingContext): void {
    // SingleChildScrollView 容器本身不绘制任何东西
  }

  // 执行滚动操作并标记需要重绘
  public scroll(deltaX: number, deltaY: number): void {
    if (this.children.length === 0) return;

    const child = this.children[0];

    if (this.direction === Direction.vertical) {
      // 竖直滚动：限制 Y 偏移范围
      const maxScroll = Math.max(0, child.height - this.height);
      this.scrollOffsetY = Math.max(0, Math.min(this.scrollOffsetY + deltaY, maxScroll));
    } else {
      // 水平滚动：限制 X 偏移范围
      const maxScroll = Math.max(0, child.width - this.width);
      this.scrollOffsetX = Math.max(0, Math.min(this.scrollOffsetX + deltaX, maxScroll));
    }

    this.markNeedsPaint();
  }

  // 添加方法：获取可滚动的内容范围
  public getScrollExtent(): { x: number; y: number; maxX: number; maxY: number } {
    if (this.children.length === 0) {
      return { x: 0, y: 0, maxX: 0, maxY: 0 };
    }

    const child = this.children[0];
    return {
      x: this.scrollOffsetX,
      y: this.scrollOffsetY,
      maxX: Math.max(0, child.width - this.width),
      maxY: Math.max(0, child.height - this.height),
    };
  }
}
