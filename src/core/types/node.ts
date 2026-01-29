import { CyanEventHandlers } from "../types/events";
import { MainAxisAlignment, CrossAxisAlignment } from "../types/container";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Size { width: number; height: number; }

export type TriangleProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
} & CyanEventHandlers;

export type ArrowProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
} & CyanEventHandlers;

export type CircleProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
} & CyanEventHandlers;

export type TextProps = {
  text?: string;
  fontSize?: number;
  color?: string;
} & CyanEventHandlers;

export type ImageProps = {
  src: string;
  width?: number;
  height?: number;
} & CyanEventHandlers;

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  flex?: number;
  borderRadius?: number;
} & CyanEventHandlers;

export type ColumnProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
} & CyanEventHandlers;

export type RowProps = {  
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
} & CyanEventHandlers;

export type ContainerProps = {  
  x?: number;
  y?: number;
  color?: string;
  width?: number;
  height?: number;
  padding?: number;
  margin?: number;
  border?: number;
  borderRadius?: number;
  borderColor?: string;
} & CyanEventHandlers;