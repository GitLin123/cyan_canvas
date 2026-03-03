/**
 * PointerEvent - 统一的指针事件表示
 * 用于将浏览器原生的 MouseEvent、TouchEvent 和 WheelEvent 统一封装成一个 CyanPointerEvent，方便在 CyanCanvas 内部处理各种输入事件
 */

export enum PointerDeviceKind {
  // 鼠标事件
  mouse,
  // 触摸事件
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
    // scrollDeltaX 和 scrollDeltaY 仅在 type 为 scroll 时有意义，表示滚轮滚动的距离，单位为像素
    public readonly scrollDeltaX: number = 0,
    public readonly scrollDeltaY: number = 0,
    // original 用于保存原始的浏览器事件对象，方便在需要时访问更多细节信息
    public readonly original?: MouseEvent | TouchEvent | WheelEvent
  ) {}

  // transformed 方法用于将事件的坐标进行转换，生成一个新的 CyanPointerEvent，适用于事件在不同坐标系之间传递时使用
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
