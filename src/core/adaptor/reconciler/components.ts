import React from 'react';
import { MainAxisAlignment, CrossAxisAlignment } from '../../types/container';

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  onClick?: (e: MouseEvent) => void;
};

export type ColumnProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  onClick?: (e: MouseEvent) => void;
};

export type RowProps = {  
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  mainAxisAlignment?: MainAxisAlignment;
  crossAxisAlignment?: CrossAxisAlignment;
  onClick?: (e: MouseEvent) => void;
};

export type ContainerProps = {  
  x?: number;
  y?: number;
  color?: string;
  width?: number;
  height?: number;
  onClick?: (e: MouseEvent) => void;
};

function createCyanComponent<P = any>(tagName: string) {
  const Comp: React.FC<React.PropsWithChildren<P>> = (props: React.PropsWithChildren<P>) =>
    React.createElement(tagName, props as any);
  return Comp;
}

export const Rect = createCyanComponent<RectProps>('cyan-rect');
export const Column = createCyanComponent<ColumnProps>('cyan-column');
export const Row = createCyanComponent<RowProps>('cyan-row');
export const Container = createCyanComponent<ContainerProps>('cyan-container');