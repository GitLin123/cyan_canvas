import { RenderNode } from '../RenderNode';
import { CyanPointerEvent, PointerEventType } from '../events/PointerEvent';
import { BoxConstraints } from '../types/container';
import { Size } from '../types/node';

export class ListenerNode extends RenderNode {
  public onPointerDown?: (e: CyanPointerEvent) => void;
  public onPointerMove?: (e: CyanPointerEvent) => void;
  public onPointerUp?: (e: CyanPointerEvent) => void;
  public onPointerCancel?: (e: CyanPointerEvent) => void;

  handlePointerEvent(event: CyanPointerEvent) {
    switch (event.type) {
      case PointerEventType.down: this.onPointerDown?.(event); break;
      case PointerEventType.move: this.onPointerMove?.(event); break;
      case PointerEventType.up: this.onPointerUp?.(event); break;
      case PointerEventType.cancel: this.onPointerCancel?.(event); break;
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

  paintSelf(): void {}
}
