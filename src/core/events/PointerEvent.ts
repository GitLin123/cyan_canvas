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
    public readonly original?: MouseEvent | TouchEvent | WheelEvent,
  ) {}

  transformed(dx: number, dy: number): CyanPointerEvent {
    return new CyanPointerEvent(
      this.type, this.pointer,
      this.localX - dx, this.localY - dy,
      this.deviceKind, this.buttons, this.pressure,
      this.scrollDeltaX, this.scrollDeltaY, this.original,
    );
  }
}
