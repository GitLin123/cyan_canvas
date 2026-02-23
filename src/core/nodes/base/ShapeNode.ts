import { RenderNode } from '../../RenderNode';
import { BoxConstraints } from '../../types/container';
import { Size } from '../../types/node';
import type { PaintingContext } from '../../backend/PaintingContext';

/**
 * 形状节点基类
 * 为所有基础形状（Circle, Rect, Triangle, Arrow）提供通用属性和布局逻辑
 */
export abstract class ShapeNode extends RenderNode {
  // 共同属性
  protected _color: string = 'white';
  protected _prefWidth?: number;
  protected _prefHeight?: number;

  // color getter/setter
  public get color() {
    return this._color;
  }
  public set color(v: string) {
    if (this._color === v) return;
    this._color = v;
    this.markNeedsPaint();
  }

  // preferredWidth/preferredHeight setter
  public set preferredWidth(v: number | undefined) {
    if (this._prefWidth === v) return;
    this._prefWidth = v;
    this.markNeedsLayout();
  }
  public set preferredHeight(v: number | undefined) {
    if (this._prefHeight === v) return;
    this._prefHeight = v;
    this.markNeedsLayout();
  }

  // 获取默认尺寸（子类可覆盖）
  protected getDefaultWidth(): number {
    return 100;
  }
  protected getDefaultHeight(): number {
    return 100;
  }

  // 通用的 performLayout 实现
  performLayout(constraints: BoxConstraints): Size {
    return {
      width: this._prefWidth ?? this.getDefaultWidth(),
      height: this._prefHeight ?? this.getDefaultHeight(),
    };
  }

  // 抽象方法 - 子类必须实现
  abstract paintSelf(ctx: PaintingContext): void;
}
