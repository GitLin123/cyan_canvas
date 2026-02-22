import { Size } from './types/node';
import { BoxConstraints, BoxConstraintsHelper } from './types/container';
import { CyanEventHandlers, CyanKeyboardEvent } from './types/events';
import type { PipelineOwner } from './PipelineOwner';

export abstract class RenderNode implements CyanEventHandlers {
  public parent: RenderNode | null = null;
  public children: RenderNode[] = [];

  protected _x: number = 0;
  protected _y: number = 0;
  protected _width: number = 400;
  protected _height: number = 300;

  protected _preferredWidth?: number;
  protected _preferredHeight?: number;

  protected _offsetX: number = 0;
  protected _offsetY: number = 0;

  public alpha: number = 1;
  public visible: boolean = true;
  public flex: number = 0;

  // --- Pipeline dirty tracking ---
  private _needsLayout: boolean = true;
  private _needsPaint: boolean = true;
  private _owner: PipelineOwner | null = null;
  private _depth: number = 0;
  private _relayoutBoundary: RenderNode | null = null;
  private _constraints: BoxConstraints | null = null;

  // --- Scroll support ---
  public scrollOffsetX: number = 0;
  public scrollOffsetY: number = 0;

  // --- Event handlers ---
  public onClick?: (e: MouseEvent) => void;
  public onHover?: (e: MouseEvent) => void;
  public onMouseDown?: (e: MouseEvent) => void;
  public onMouseUp?: (e: MouseEvent) => void;
  public onMouseMove?: (e: MouseEvent) => void;
  public onMouseEnter?: (e: MouseEvent) => void;
  public onMouseLeave?: (e: MouseEvent) => void;
  public onWheel?: (e: WheelEvent) => void;
  public onContextMenu?: (e: MouseEvent) => void;
  public onKeyDown?: (e: CyanKeyboardEvent) => void;
  public onKeyUp?: (e: CyanKeyboardEvent) => void;
  public focusable: boolean = false;
  public _isMouseOver: boolean = false;

  // --- Pipeline state getters ---
  public get depth(): number { return this._depth; }
  public get needsLayout(): boolean { return this._needsLayout; }
  public get owner(): PipelineOwner | null { return this._owner; }

  // --- Position/size getters & setters ---

  public get x() { return this._x; }
  public set x(v: number) {
    if (this._x === v) return;
    this._x = v;
    this.markNeedsLayout();
  }

  public get y() { return this._y; }
  public set y(v: number) {
    if (this._y === v) return;
    this._y = v;
    this.markNeedsLayout();
  }

  public get width() {
    return this._width > 0 ? this._width : (this._preferredWidth ?? 100);
  }
  public set width(v: number) {
    if (this._width === v) return;
    this._width = v;
    this.markNeedsLayout();
  }

  public get height() {
    return this._height > 0 ? this._height : (this._preferredHeight ?? 100);
  }
  public set height(v: number) {
    if (this._height === v) return;
    this._height = v;
    this.markNeedsLayout();
  }

  public get preferredWidth() { return this._preferredWidth; }
  public set preferredWidth(v: number | undefined) {
    if (this._preferredWidth === v) return;
    this._preferredWidth = v;
    this.markNeedsLayout();
  }

  public get preferredHeight() { return this._preferredHeight; }
  public set preferredHeight(v: number | undefined) {
    if (this._preferredHeight === v) return;
    this._preferredHeight = v;
    this.markNeedsLayout();
  }

  public get offsetX() { return this._offsetX; }
  public set offsetX(v: number) {
    if (this._offsetX === v) return;
    this._offsetX = v;
    this.markNeedsPaint();
  }

  public get offsetY() { return this._offsetY; }
  public set offsetY(v: number) {
    if (this._offsetY === v) return;
    this._offsetY = v;
    this.markNeedsPaint();
  }

  // --- Tree operations ---

  add(child: RenderNode) {
    child.parent = this;
    this.children.push(child);
    if (this._owner) child.attach(this._owner);
    this.markNeedsLayout();
  }

  remove(child: RenderNode) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parent = null;
      child.detach();
      this.markNeedsLayout();
    }
  }

  insertBefore(child: RenderNode, before: RenderNode) {
    child.parent = this;
    const idx = this.children.indexOf(before);
    if (idx !== -1) {
      this.children.splice(idx, 0, child);
    } else {
      this.children.push(child);
    }
    if (this._owner) child.attach(this._owner);
    this.markNeedsLayout();
  }

  /** Set position without triggering markNeedsLayout (for use during performLayout) */
  setPosition(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  // --- Attach / Detach lifecycle ---

  attach(owner: PipelineOwner) {
    this._owner = owner;
    this._depth = this.parent ? this.parent._depth + 1 : 0;
    if (this._needsLayout && this._relayoutBoundary !== null) {
      this._owner.addNodeNeedingLayout(this);
    }
    if (this._needsPaint) {
      this._owner.addNodeNeedingPaint(this);
    }
    for (const child of this.children) {
      child.attach(owner);
    }
  }

  detach() {
    for (const child of this.children) {
      child.detach();
    }
    this._owner = null;
  }

  // --- Dirty marking (Flutter-style) ---

  markNeedsLayout() {
    if (this._needsLayout) return;
    this._needsLayout = true;
    if (this._relayoutBoundary === this) {
      this._owner?.addNodeNeedingLayout(this);
      this._owner?.requestVisualUpdate();
    } else if (this.parent) {
      this.parent.markNeedsLayout();
    }
    this.markNeedsPaint();
  }

  markNeedsPaint() {
    if (this._needsPaint) return;
    this._needsPaint = true;
    this._owner?.addNodeNeedingPaint(this);
    this._owner?.requestVisualUpdate();
  }

  // --- Layout ---

  abstract performLayout(constraints: BoxConstraints): Size;
  abstract paintSelf(ctx: CanvasRenderingContext2D): void;

  layout(constraints: BoxConstraints) {
    if (!BoxConstraintsHelper.isValid(constraints)) {
      constraints = BoxConstraintsHelper.loose(
        constraints.maxWidth || 800, constraints.maxHeight || 600
      );
    }

    // Determine relayout boundary
    const isRelayoutBoundary =
      this.parent === null ||
      (constraints.minWidth === constraints.maxWidth &&
       constraints.minHeight === constraints.maxHeight);

    const relayoutBoundary = isRelayoutBoundary
      ? this
      : this.parent!._relayoutBoundary!;

    // Skip layout if not dirty and constraints unchanged
    if (!this._needsLayout &&
        this._relayoutBoundary === relayoutBoundary &&
        this._constraints !== null &&
        this._constraintsEqual(constraints)) {
      return;
    }

    this._constraints = constraints;
    this._relayoutBoundary = relayoutBoundary;
    this._performLayoutAndClamp(constraints);
  }

  /** Called by PipelineOwner for relayout boundary nodes */
  layoutWithoutResize() {
    if (!this._constraints) return;
    this._performLayoutAndClamp(this._constraints);
  }

  private _performLayoutAndClamp(constraints: BoxConstraints) {
    const preferred = this.performLayout(constraints);
    this._width = Math.max(
      constraints.minWidth,
      Math.min(
        constraints.maxWidth === Number.POSITIVE_INFINITY
          ? (preferred.width ?? 100) : constraints.maxWidth,
        preferred.width ?? 100
      )
    );
    this._height = Math.max(
      constraints.minHeight,
      Math.min(
        constraints.maxHeight === Number.POSITIVE_INFINITY
          ? (preferred.height ?? 100) : constraints.maxHeight,
        preferred.height ?? 100
      )
    );
    this._needsLayout = false;
    this._needsPaint = true;
  }

  private _constraintsEqual(c: BoxConstraints): boolean {
    const o = this._constraints!;
    return o.minWidth === c.minWidth && o.maxWidth === c.maxWidth &&
           o.minHeight === c.minHeight && o.maxHeight === c.maxHeight;
  }

  // --- Paint ---

  paint(ctx: CanvasRenderingContext2D) {
    if (!this.visible || this.alpha <= 0) return;
    ctx.save();
    ctx.translate(this._x + this._offsetX, this._y + this._offsetY);

    if (this.scrollOffsetX !== 0 || this.scrollOffsetY !== 0) {
      ctx.beginPath();
      ctx.rect(0, 0, this.width, this.height);
      ctx.clip();
      ctx.translate(-this.scrollOffsetX, -this.scrollOffsetY);
    }

    this.paintSelf(ctx);
    for (const child of this.children) child.paint(ctx);
    ctx.restore();
  }

  // --- Hit testing ---

  hitTest(localX: number, localY: number): RenderNode | null {
    if (!this.visible) return null;
    for (let i = this.children.length - 1; i >= 0; i--) {
      const child = this.children[i];
      const target = child.hitTest(
        localX - child.x - child._offsetX,
        localY - child.y - child._offsetY
      );
      if (target) return target;
    }
    if (localX >= 0 && localX <= this.width &&
        localY >= 0 && localY <= this.height) return this;
    return null;
  }

  // --- Scroll ---

  public scroll(deltaX: number, deltaY: number): void {
    let totalW = 0, totalH = 0;
    for (const child of this.children) {
      totalW = Math.max(totalW, child.x + child.width);
      totalH = Math.max(totalH, child.y + child.height);
    }
    this.scrollOffsetX = Math.max(0, Math.min(
      this.scrollOffsetX + deltaX, Math.max(0, totalW - this.width)));
    this.scrollOffsetY = Math.max(0, Math.min(
      this.scrollOffsetY + deltaY, Math.max(0, totalH - this.height)));
    this.markNeedsPaint();
  }

  public getScrollExtent() {
    let totalW = 0, totalH = 0;
    for (const child of this.children) {
      totalW = Math.max(totalW, child.x + child.width);
      totalH = Math.max(totalH, child.y + child.height);
    }
    return {
      x: this.scrollOffsetX, y: this.scrollOffsetY,
      maxX: Math.max(0, totalW - this.width),
      maxY: Math.max(0, totalH - this.height),
    };
  }

  // --- Serialization ---

  public toJSON(): any {
    return {
      type: this.constructor.name,
      props: { x: this._x, y: this._y, width: this._width, height: this._height },
      children: this.children.map((child) => child.toJSON()),
    };
  }
}
