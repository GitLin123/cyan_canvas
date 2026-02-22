/**
 * Transform - 2D 变换节点
 * 相当于 Flutter 的 Transform，对子树应用 2D 变换（平移、旋转、缩放）
 */

import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';

export class TransformNode extends RenderNode {
  private _translateX: number = 0;
  private _translateY: number = 0;
  private _scaleX: number = 1;
  private _scaleY: number = 1;
  private _rotation: number = 0; // 弧度
  private _originX: number = 0.5; // 变换原点 (0~1)
  private _originY: number = 0.5;

  public get translateX() { return this._translateX; }
  public set translateX(v: number) { if (this._translateX === v) return; this._translateX = v; this.markNeedsPaint(); }

  public get translateY() { return this._translateY; }
  public set translateY(v: number) { if (this._translateY === v) return; this._translateY = v; this.markNeedsPaint(); }

  public get scaleX() { return this._scaleX; }
  public set scaleX(v: number) { if (this._scaleX === v) return; this._scaleX = v; this.markNeedsPaint(); }

  public get scaleY() { return this._scaleY; }
  public set scaleY(v: number) { if (this._scaleY === v) return; this._scaleY = v; this.markNeedsPaint(); }

  public get rotation() { return this._rotation; }
  public set rotation(v: number) { if (this._rotation === v) return; this._rotation = v; this.markNeedsPaint(); }

  public get originX() { return this._originX; }
  public set originX(v: number) { if (this._originX === v) return; this._originX = v; this.markNeedsPaint(); }

  public get originY() { return this._originY; }
  public set originY(v: number) { if (this._originY === v) return; this._originY = v; this.markNeedsPaint(); }

  performLayout(constraints: BoxConstraints): Size {
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout({
        minWidth: constraints.minWidth,
        maxWidth: constraints.maxWidth,
        minHeight: constraints.minHeight,
        maxHeight: constraints.maxHeight,
      });
      child.setPosition(0, 0);
      return { width: child.width, height: child.height };
    }
    return { width: constraints.minWidth, height: constraints.minHeight };
  }

  paint(ctx: CanvasRenderingContext2D): void {
    if (!this.visible || this.alpha <= 0) return;

    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    // 变换原点
    const ox = this.width * this._originX;
    const oy = this.height * this._originY;
    ctx.translate(ox, oy);

    // 应用变换
    ctx.translate(this._translateX, this._translateY);
    ctx.rotate(this._rotation);
    ctx.scale(this._scaleX, this._scaleY);

    // 还原原点
    ctx.translate(-ox, -oy);

    this.paintSelf(ctx);
    for (const child of this.children) {
      child.paint(ctx);
    }

    ctx.restore();
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // Transform 本身不绘制
  }
}
