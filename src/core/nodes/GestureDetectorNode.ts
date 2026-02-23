import { RenderNode } from '../RenderNode';
import { CyanPointerEvent, PointerEventType } from '../events/PointerEvent';
import { GestureBinding } from '../events/GestureBinding';
import {
  TapGestureRecognizer,
  PanGestureRecognizer,
  LongPressGestureRecognizer,
  GestureRecognizer,
} from '../events/GestureRecognizer';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';
import type { PaintingContext } from '../backend/PaintingContext';

export class GestureDetectorNode extends RenderNode {
  public onTap?: () => void;
  public onTapDown?: (e: CyanPointerEvent) => void;
  public onTapUp?: (e: CyanPointerEvent) => void;
  public onLongPress?: (e: CyanPointerEvent) => void;
  public onPanStart?: (e: CyanPointerEvent) => void;
  public onPanUpdate?: (dx: number, dy: number, e: CyanPointerEvent) => void;
  public onPanEnd?: (e: CyanPointerEvent) => void;

  private _recognizers: GestureRecognizer[] = [];
  public _binding: GestureBinding | null = null;

  handlePointerEvent(event: CyanPointerEvent) {
    if (event.type !== PointerEventType.down) return;
    this._syncRecognizers();
    for (const r of this._recognizers) r.addPointer(event);
  }

  private _syncRecognizers() {
    if (!this._binding) return;
    for (const r of this._recognizers) r.dispose();
    this._recognizers = [];
    const { router, arenaManager } = this._binding;

    if (this.onTap || this.onTapDown || this.onTapUp) {
      const t = new TapGestureRecognizer(router, arenaManager);
      t.onTap = this.onTap; t.onTapDown = this.onTapDown; t.onTapUp = this.onTapUp;
      this._recognizers.push(t);
    }
    if (this.onPanStart || this.onPanUpdate || this.onPanEnd) {
      const p = new PanGestureRecognizer(router, arenaManager);
      p.onPanStart = this.onPanStart; p.onPanUpdate = this.onPanUpdate; p.onPanEnd = this.onPanEnd;
      this._recognizers.push(p);
    }
    if (this.onLongPress) {
      const l = new LongPressGestureRecognizer(router, arenaManager);
      l.onLongPress = this.onLongPress;
      this._recognizers.push(l);
    }
  }

  performLayout(constraints: BoxConstraints): Size {
    if (this.children.length > 0) {
      const child = this.children[0];
      child.layout(constraints);
      child.setPosition(0, 0);
      return { width: child.width, height: child.height };
    }
    return { width: constraints.minWidth, height: constraints.minHeight };
  }

  paintSelf(_ctx: PaintingContext): void {}
}
