/**
 * GestureBinding
 * 处理指针事件的分发和手势识别的绑定。
 */

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
  // spatialIndex 可选，如果提供则使用空间索引进行 hitTest，否则使用传统的递归 hitTest 方法
  public spatialIndex: SpatialIndex | null = null;

  // 处理指针事件的入口方法，根据事件类型进行 hitTest，
  // 分发事件给路径上的节点和 router 中注册的 recognizer
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
      entry.target.handlePointerEvent?.(event.transformed(entry.localX, entry.localY));
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
