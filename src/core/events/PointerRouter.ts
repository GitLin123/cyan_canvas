/**
 * PointerRouter - 指针事件路由器
 * 用于将指针事件路由到对应的处理函数，支持多指操作和事件冒泡机制
 */

import { CyanPointerEvent, PointerEventType } from './PointerEvent';

type PointerRoute = (event: CyanPointerEvent) => void;

export class PointerRouter {
  private _routes = new Map<number, Set<PointerRoute>>();

  addRoute(pointer: number, route: PointerRoute) {
    if (!this._routes.has(pointer)) this._routes.set(pointer, new Set());
    this._routes.get(pointer)!.add(route);
  }

  removeRoute(pointer: number, route: PointerRoute) {
    this._routes.get(pointer)?.delete(route);
  }

  route(event: CyanPointerEvent) {
    const routes = this._routes.get(event.pointer);
    if (routes) {
      routes.forEach((route) => route(event));
    }
    if (event.type === PointerEventType.up || event.type === PointerEventType.cancel) {
      this._routes.delete(event.pointer);
    }
  }
}
