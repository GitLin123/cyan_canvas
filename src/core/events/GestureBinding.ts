import { CyanPointerEvent, PointerEventType } from './PointerEvent';
import { HitTestResult } from './HitTestResult';
import { PointerRouter } from './PointerRouter';
import { GestureArenaManager } from './GestureArena';
import { RenderNode } from '../RenderNode';
import type { SpatialIndex } from '../spatial/SpatialIndex';

export class GestureBinding {
  public readonly router = new PointerRouter();
  public readonly arenaManager = new GestureArenaManager();
  private _hitTests = new Map<number, HitTestResult>();
  public spatialIndex: SpatialIndex | null = null;

  handlePointerEvent(event: CyanPointerEvent, root: RenderNode) {
    let result: HitTestResult;

    if (event.type === PointerEventType.down || event.type === PointerEventType.hover) {
      if (this.spatialIndex) {
        result = this.spatialIndex.hitTest(event.localX, event.localY);
      } else {
        result = new HitTestResult();
        root.hitTest(result, event.localX - root.x, event.localY - root.y);
      }
      if (event.type === PointerEventType.down) this._hitTests.set(event.pointer, result);
    } else {
      result = this._hitTests.get(event.pointer) ?? new HitTestResult();
    }

    // 先分发给路径上每个节点（down 时注册 recognizer 路由）
    for (const entry of result.path) {
      entry.target.handlePointerEvent?.(
        event.transformed(entry.localX, entry.localY)
      );
    }

    // 再通过 router 分发（recognizer 已注册，可收到事件）
    this.router.route(event);

    if (event.type === PointerEventType.down) {
      this.arenaManager.close(event.pointer);
    }
    if (event.type === PointerEventType.up || event.type === PointerEventType.cancel) {
      this._hitTests.delete(event.pointer);
      this.arenaManager.sweep(event.pointer);
    }
  }
}
