import React from 'react';
import { 
  RectProps, ColumnProps, RowProps,
  ContainerProps, ImageProps, TextProps,
  TriangleProps, ArrowProps, CircleProps } from '../../types/node';

function createCyanComponent<P = any>(tagName: string) {
  const Comp: React.FC<React.PropsWithChildren<P>> = 
  (props: React.PropsWithChildren<P>) => React.createElement(tagName, props as any);
  return Comp;
}

export const Row = createCyanComponent<RowProps>('cyan-row');
export const Text = createCyanComponent<TextProps>('cyan-text');
export const Rect = createCyanComponent<RectProps>('cyan-rect');
export const Arrow = createCyanComponent<ArrowProps>('cyan-arrow');
export const Image = createCyanComponent<ImageProps>('cyan-image');
export const Circle = createCyanComponent<CircleProps>('cyan-circle');
export const Column = createCyanComponent<ColumnProps>('cyan-column');
export const Triangle = createCyanComponent<TriangleProps>('cyan-triangle');
export const Container = createCyanComponent<ContainerProps>('cyan-container');
