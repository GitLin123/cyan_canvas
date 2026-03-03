import { RenderNode } from '../RenderNode';
import { CyanPointerEvent, PointerEventType, PointerDeviceKind } from './PointerEvent';
import { GestureBinding } from './GestureBinding';
import { GestureDetectorNode } from '../nodes/GestureDetectorNode';
import type { SpatialIndex } from '../spatial/SpatialIndex';
import type { CyanKeyboardEvent } from '../types/events';

export class EventManager {
  // 记录当前 hover 状态的节点
  private lastHoveredNode: RenderNode | null = null;
  // 手势竞技场相关
  public readonly gestureBinding = new GestureBinding();
  // pointer 生成器和 touch identifier 映射
  private _nextPointer = 0;
  private _touchPointerMap = new Map<number, number>();
  private _abortController = new AbortController();

  /** 当前拥有键盘焦点的节点 */
  private _focusedNode: RenderNode | null = null;

  // 缓存坐标变换参数
  private _cachedRect: DOMRect | null = null;
  private _cachedScaleX = 1;
  private _cachedScaleY = 1;
  private _cachedOffsetX = 0;
  private _cachedOffsetY = 0;

  // 旧事件类型到 RenderNode handler 的映射
  private readonly handlerMap: Record<string, keyof RenderNode> = {
    click: 'onClick',
    mousedown: 'onMouseDown',
    mouseup: 'onMouseUp',
    mousemove: 'onMouseMove',
    wheel: 'onWheel',
    contextmenu: 'onContextMenu',
  };

  constructor(
    private canvas: HTMLCanvasElement,
    // 获取根节点的函数
    private getRoot: () => RenderNode | null,
    // 空间索引，用于优化点击判断
    private spatialIndex: SpatialIndex | null = null
  ) {
    this.gestureBinding.spatialIndex = spatialIndex;
    this.init();
  }

  /** resize 后需要刷新坐标缓存 */
  invalidateCache() {
    this._cachedRect = null;
  }

  private init() {
    this.initMouseEvents();
    this.initTouchEvents();
    this.initKeyboardEvents();
  }

  private initMouseEvents() {
    const signal = this._abortController.signal;
    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        const pos = this.getLogicalPos(e.clientX, e.clientY);
        const pointer = this._nextPointer++;
        this.dispatchAll(PointerEventType.down, pointer, pos, PointerDeviceKind.mouse, e, 'mousedown');
      },
      { signal }
    );

    this.canvas.addEventListener(
      'mousemove',
      (e) => {
        const pos = this.getLogicalPos(e.clientX, e.clientY);
        const ptrType = e.buttons > 0 ? PointerEventType.move : PointerEventType.hover;
        const pointer = e.buttons > 0 ? this._nextPointer - 1 : 0;
        this.dispatchAll(ptrType, pointer, pos, PointerDeviceKind.mouse, e, 'mousemove');
      },
      { signal }
    );

    this.canvas.addEventListener(
      'mouseup',
      (e) => {
        const pos = this.getLogicalPos(e.clientX, e.clientY);
        this.dispatchAll(PointerEventType.up, this._nextPointer - 1, pos, PointerDeviceKind.mouse, e, 'mouseup');
      },
      { signal }
    );

    this.canvas.addEventListener('click', (e) => this.dispatchLegacy('click', e), { signal });
    this.canvas.addEventListener(
      'contextmenu',
      (e) => {
        e.preventDefault();
        this.dispatchLegacy('contextmenu', e);
      },
      { signal }
    );
    this.canvas.addEventListener('wheel', (e) => this.dispatchLegacy('wheel', e), { passive: false, signal });
  }

  private initTouchEvents() {
    const signal = this._abortController.signal;
    this.canvas.addEventListener(
      'touchstart',
      (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          const pointer = this._nextPointer++;
          this._touchPointerMap.set(t.identifier, pointer);
          const pos = this.getLogicalPos(t.clientX, t.clientY);
          this.dispatchPointer(PointerEventType.down, pointer, pos, PointerDeviceKind.touch, e);
        }
      },
      { passive: false, signal }
    );

    this.canvas.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const t = e.changedTouches[i];
          const pointer = this._touchPointerMap.get(t.identifier);
          if (pointer === undefined) continue;
          const pos = this.getLogicalPos(t.clientX, t.clientY);
          this.dispatchPointer(PointerEventType.move, pointer, pos, PointerDeviceKind.touch, e);
        }
      },
      { passive: false, signal }
    );

    const onTouchEnd = (type: PointerEventType) => (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        const pointer = this._touchPointerMap.get(t.identifier);
        if (pointer === undefined) continue;
        const pos = this.getLogicalPos(t.clientX, t.clientY);
        this.dispatchPointer(type, pointer, pos, PointerDeviceKind.touch, e);
        this._touchPointerMap.delete(t.identifier);
      }
    };
    this.canvas.addEventListener('touchend', onTouchEnd(PointerEventType.up), { signal });
    this.canvas.addEventListener('touchcancel', onTouchEnd(PointerEventType.cancel), { signal });
  }

  /** 合并分发：新系统 + 旧系统共用一次坐标计算 */
  private dispatchAll(
    type: PointerEventType,
    pointer: number,
    pos: { x: number; y: number },
    deviceKind: PointerDeviceKind,
    original: MouseEvent | TouchEvent | WheelEvent,
    legacyType: string
  ) {
    this.dispatchPointer(type, pointer, pos, deviceKind, original);
    this.dispatchLegacyWithPos(legacyType, original as MouseEvent, pos);
  }

  private dispatchPointer(
    type: PointerEventType,
    pointer: number,
    pos: { x: number; y: number },
    deviceKind: PointerDeviceKind,
    original: MouseEvent | TouchEvent | WheelEvent
  ) {
    const root = this.getRoot();
    if (!root) return;
    if (type === PointerEventType.down) {
      this.injectBinding(root);
    }
    const event = new CyanPointerEvent(type, pointer, pos.x, pos.y, deviceKind, 0, 1, 0, 0, original);
    this.gestureBinding.handlePointerEvent(event, root);
  }

  private injectBinding(node: RenderNode) {
    if (node instanceof GestureDetectorNode) {
      node._binding = this.gestureBinding;
    }
    for (const child of node.children) this.injectBinding(child);
  }

  /** 旧事件分发（click/contextmenu/wheel 独立走这条路径） */
  private dispatchLegacy(type: string, e: MouseEvent | WheelEvent) {
    const pos = this.getLogicalPos(e.clientX, e.clientY);
    this.dispatchLegacyWithPos(type, e, pos);
  }

  private dispatchLegacyWithPos(type: string, e: MouseEvent | WheelEvent, pos: { x: number; y: number }) {
    const root = this.getRoot();
    if (!root) return;

    const target = this.spatialIndex
      ? this.spatialIndex.hitTestFirst(pos.x, pos.y)
      : root.hitTestLegacy(pos.x - root.x, pos.y - root.y);

    if (type === 'mousemove') {
      this.handleHoverState(target, e as MouseEvent);
    }

    if (!target) return;
    const handlerName = this.handlerMap[type];
    if (!handlerName) return;

    let node: RenderNode | null = target;
    while (node) {
      const handler = node[handlerName] as Function;
      if (typeof handler === 'function') {
        handler.call(node, e);
        break;
      }
      node = node.parent;
    }
  }

  // 获取逻辑坐标
  private getLogicalPos(clientX: number, clientY: number) {
    if (!this._cachedRect) this._updateCache();
    return {
      x: (clientX - this._cachedOffsetX) * this._cachedScaleX,
      y: (clientY - this._cachedOffsetY) * this._cachedScaleY,
    };
  }

  // 更新坐标变换缓存
  private _updateCache() {
    const rect = this.canvas.getBoundingClientRect();
    const style = window.getComputedStyle(this.canvas);
    const bL = parseFloat(style.borderLeftWidth) || 0;
    const bT = parseFloat(style.borderTopWidth) || 0;
    const pL = parseFloat(style.paddingLeft) || 0;
    const pT = parseFloat(style.paddingTop) || 0;
    const pr = window.devicePixelRatio || 1;
    const logW = this.canvas.width / pr;
    const logH = this.canvas.height / pr;
    const cW = rect.width - bL - pL - (parseFloat(style.borderRightWidth) || 0) - (parseFloat(style.paddingRight) || 0);
    const cH =
      rect.height - bT - pT - (parseFloat(style.borderBottomWidth) || 0) - (parseFloat(style.paddingBottom) || 0);
    this._cachedRect = rect;
    this._cachedOffsetX = rect.left + bL + pL;
    this._cachedOffsetY = rect.top + bT + pT;
    this._cachedScaleX = cW > 0 ? logW / cW : 1;
    this._cachedScaleY = cH > 0 ? logH / cH : 1;
  }

  private handleHoverState(currentTarget: RenderNode | null, e: MouseEvent) {
    if (this.lastHoveredNode !== currentTarget) {
      if (this.lastHoveredNode) {
        this.lastHoveredNode._isMouseOver = false;
        this.lastHoveredNode.onMouseLeave?.(e);
      }
      if (currentTarget) {
        currentTarget._isMouseOver = true;
        currentTarget.onMouseEnter?.(e);
      }
      this.lastHoveredNode = currentTarget;
    }
  }

  private initKeyboardEvents() {
    const signal = this._abortController.signal;

    // 确保 canvas 可聚焦
    if (!this.canvas.hasAttribute('tabindex')) {
      this.canvas.setAttribute('tabindex', '0');
    }
    this.canvas.style.outline = 'none';

    // 点击 canvas 时自动聚焦，并将焦点设置到被点击的 focusable 节点
    this.canvas.addEventListener(
      'mousedown',
      (e) => {
        this.canvas.focus();
        const pos = this.getLogicalPos(e.clientX, e.clientY);
        const target = this.spatialIndex
          ? this.spatialIndex.hitTestFirst(pos.x, pos.y)
          : (this.getRoot()?.hitTestLegacy(pos.x - (this.getRoot()?.x ?? 0), pos.y - (this.getRoot()?.y ?? 0)) ?? null);
        this.setFocus(this.findFocusable(target));
      },
      { signal }
    );

    this.canvas.addEventListener(
      'keydown',
      (e) => {
        const cyanEvent = this.toCyanKeyboardEvent(e);
        this.dispatchKeyboardEvent('onKeyDown', cyanEvent);
      },
      { signal }
    );

    this.canvas.addEventListener(
      'keyup',
      (e) => {
        const cyanEvent = this.toCyanKeyboardEvent(e);
        this.dispatchKeyboardEvent('onKeyUp', cyanEvent);
      },
      { signal }
    );
  }

  private toCyanKeyboardEvent(e: KeyboardEvent): CyanKeyboardEvent {
    return {
      key: e.key,
      code: e.code,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      repeat: e.repeat,
    };
  }

  private dispatchKeyboardEvent(handlerName: 'onKeyDown' | 'onKeyUp', event: CyanKeyboardEvent) {
    // 优先分发给焦点节点，沿父链冒泡
    let node: RenderNode | null = this._focusedNode;
    while (node) {
      const handler = node[handlerName];
      if (typeof handler === 'function') {
        handler(event);
        return;
      }
      node = node.parent;
    }
    // 无焦点节点时分发给根节点
    const root = this.getRoot();
    if (root) {
      const handler = root[handlerName];
      if (typeof handler === 'function') {
        handler(event);
      }
    }
  }

  /** 沿父链查找最近的 focusable 节点 */
  private findFocusable(node: RenderNode | null): RenderNode | null {
    while (node) {
      if (node.focusable) return node;
      node = node.parent;
    }
    return null;
  }

  /** 设置焦点节点 */
  setFocus(node: RenderNode | null) {
    if (this._focusedNode === node) return;
    const prev = this._focusedNode;
    this._focusedNode = node;
    if (prev?.onBlur) prev.onBlur();
    if (node?.onFocus) node.onFocus();
  }

  get focusedNode() {
    return this._focusedNode;
  }

  dispose() {
    this._abortController.abort();
  }
}
