/**
 * PointerEvent - 统一的指针事件表示
 * 用于将浏览器原生的 MouseEvent、TouchEvent 和 WheelEvent 统一封装成一个 CyanPointerEvent，方便在 CyanCanvas 内部处理各种输入事件
 */

export enum PointerDeviceKind {
  mouse,
  touch,
}

export enum PointerEventType {
  down,
  move,
  up,
  cancel,
  hover,
  scroll,
}

export class CyanPointerEvent {
  constructor(
    public readonly type: PointerEventType,
    public readonly pointer: number,
    public readonly localX: number,
    public readonly localY: number,
    public readonly deviceKind: PointerDeviceKind,
    public readonly buttons: number = 0,
    public readonly pressure: number = 1.0,
    public readonly scrollDeltaX: number = 0,
    public readonly scrollDeltaY: number = 0,
    public readonly original?: MouseEvent | TouchEvent | WheelEvent
  ) {}

  transformed(dx: number, dy: number): CyanPointerEvent {
    return new CyanPointerEvent(
      this.type,
      this.pointer,
      this.localX - dx,
      this.localY - dy,
      this.deviceKind,
      this.buttons,
      this.pressure,
      this.scrollDeltaX,
      this.scrollDeltaY,
      this.original
    );
  }
}
