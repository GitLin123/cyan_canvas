export type CyanInputEventType =
  | 'click'
  | 'mousedown'
  | 'mouseup'
  | 'mousemove'
  | 'mouseenter'
  | 'mouseleave'
  | 'wheel'
  | 'contextmenu';

export interface CyanEventHandlers {
  onClick?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseEnter?: (e: MouseEvent) => void;
  onMouseLeave?: (e: MouseEvent) => void;
  onWheel?: (e: WheelEvent) => void;
  onContextMenu?: (e: MouseEvent) => void;
}

export type CyanKeyboardEvent = {
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
};