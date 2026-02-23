import { CyanPointerEvent, PointerEventType } from './PointerEvent';
import { GestureArenaMember, GestureArenaManager } from './GestureArena';
import { PointerRouter } from './PointerRouter';

const kTouchSlop = 18;

// --- 基类 ---
export abstract class GestureRecognizer implements GestureArenaMember {
  protected _trackedPointers = new Map<number, { resolve: (d: 'accepted' | 'rejected') => void }>();

  constructor(
    protected router: PointerRouter,
    protected arenaManager: GestureArenaManager,
  ) {}

  private _handleEvent = (event: CyanPointerEvent) => this.handleEvent(event);

  addPointer(event: CyanPointerEvent) {
    const entry = this.arenaManager.add(event.pointer, this);
    this._trackedPointers.set(event.pointer, entry);
    this.router.addRoute(event.pointer, this._handleEvent);
  }

  abstract handleEvent(event: CyanPointerEvent): void;
  abstract acceptGesture(pointer: number): void;
  abstract rejectGesture(pointer: number): void;

  protected resolve(pointer: number, disposition: 'accepted' | 'rejected') {
    this._trackedPointers.get(pointer)?.resolve(disposition);
  }

  dispose() { this._trackedPointers.clear(); }
}

// --- Tap ---
export class TapGestureRecognizer extends GestureRecognizer {
  onTap?: () => void;
  onTapDown?: (e: CyanPointerEvent) => void;
  onTapUp?: (e: CyanPointerEvent) => void;

  private _down: CyanPointerEvent | null = null;
  private _up: CyanPointerEvent | null = null;
  private _won = false;

  handleEvent(event: CyanPointerEvent) {
    if (event.type === PointerEventType.down) {
      this._down = event;
      this._up = null;
      this._won = false;
    } else if (event.type === PointerEventType.move) {
      if (this._down && this._slopExceeded(event)) this.resolve(event.pointer, 'rejected');
    } else if (event.type === PointerEventType.up) {
      if (this._won) { this.onTapUp?.(event); this.onTap?.(); this._reset(); }
      else { this._up = event; this.resolve(event.pointer, 'accepted'); }
    }
  }

  acceptGesture(_p: number) {
    this._won = true;
    if (this._down) this.onTapDown?.(this._down);
    if (this._up) { this.onTapUp?.(this._up); this.onTap?.(); this._reset(); }
  }
  rejectGesture(_p: number) { this._reset(); }

  private _slopExceeded(e: CyanPointerEvent) {
    const dx = e.localX - this._down!.localX, dy = e.localY - this._down!.localY;
    return dx * dx + dy * dy > kTouchSlop * kTouchSlop;
  }
  private _reset() { this._down = null; this._up = null; this._won = false; }
}

// --- Pan ---
export class PanGestureRecognizer extends GestureRecognizer {
  onPanStart?: (e: CyanPointerEvent) => void;
  onPanUpdate?: (dx: number, dy: number, e: CyanPointerEvent) => void;
  onPanEnd?: (e: CyanPointerEvent) => void;

  private _down: CyanPointerEvent | null = null;
  private _last: CyanPointerEvent | null = null;
  private _accepted = false;

  handleEvent(event: CyanPointerEvent) {
    if (event.type === PointerEventType.down) {
      this._down = event; this._last = event; this._accepted = false;
    } else if (event.type === PointerEventType.move) {
      if (this._accepted) {
        const dx = event.localX - (this._last?.localX ?? 0);
        const dy = event.localY - (this._last?.localY ?? 0);
        this.onPanUpdate?.(dx, dy, event);
        this._last = event;
      } else if (this._down && this._slopExceeded(event)) {
        this.resolve(event.pointer, 'accepted');
      }
    } else if (event.type === PointerEventType.up) {
      if (this._accepted) this.onPanEnd?.(event);
      this._reset();
    }
  }

  acceptGesture(_p: number) { this._accepted = true; if (this._down) this.onPanStart?.(this._down); }
  rejectGesture(_p: number) { this._reset(); }

  private _slopExceeded(e: CyanPointerEvent) {
    const dx = e.localX - this._down!.localX, dy = e.localY - this._down!.localY;
    return dx * dx + dy * dy > kTouchSlop * kTouchSlop;
  }
  private _reset() { this._down = null; this._last = null; this._accepted = false; }
}

// --- LongPress ---
export class LongPressGestureRecognizer extends GestureRecognizer {
  onLongPress?: (e: CyanPointerEvent) => void;

  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _down: CyanPointerEvent | null = null;
  private _accepted = false;

  handleEvent(event: CyanPointerEvent) {
    if (event.type === PointerEventType.down) {
      this._down = event;
      this._accepted = false;
      this._timer = setTimeout(() => {
        this._timer = null;
        this.resolve(event.pointer, 'accepted');
        if (this._accepted && this._down) this.onLongPress?.(this._down);
      }, 500);
    } else if (event.type === PointerEventType.move) {
      if (this._down && this._slopExceeded(event)) this.resolve(event.pointer, 'rejected');
    } else if (event.type === PointerEventType.up) {
      this._clear();
      this.resolve(event.pointer, 'rejected');
    }
  }

  acceptGesture(_p: number) {
    this._accepted = true;
    // 不立即触发，等定时器到期后在 handleEvent 的 setTimeout 回调中触发
  }
  rejectGesture(_p: number) { this._clear(); }

  private _slopExceeded(e: CyanPointerEvent) {
    const dx = e.localX - this._down!.localX, dy = e.localY - this._down!.localY;
    return dx * dx + dy * dy > kTouchSlop * kTouchSlop;
  }
  private _clear() { if (this._timer) { clearTimeout(this._timer); this._timer = null; } this._down = null; }
}
