import React from 'react';
import { MainAxisAlignment, CrossAxisAlignment } from '../../types/container';
import { CyanEventHandlers } from '../../types/events';

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

function createCyanComponent<P = any>(tagName: string) {
  const Comp: React.FC<React.PropsWithChildren<P>> = (props: React.PropsWithChildren<P>) =>
    React.createElement(tagName, props as any);
  return Comp;
}

export const Rect = createCyanComponent<RectProps>('cyan-rect');
export const Column = createCyanComponent<ColumnProps>('cyan-column');
export const Row = createCyanComponent<RowProps>('cyan-row');
export const Container = createCyanComponent<ContainerProps>('cyan-container');

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

export const Text = createCyanComponent<TextProps>('cyan-text');
export const Triangle = createCyanComponent<TriangleProps>('cyan-triangle');
export const Arrow = createCyanComponent<ArrowProps>('cyan-arrow');
export const Circle = createCyanComponent<CircleProps>('cyan-circle');