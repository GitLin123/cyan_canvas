import React from 'react';
import {
  RectProps,
  ColumnProps,
  RowProps,
  ContainerProps,
  ImageProps,
  TextProps,
  TriangleProps,
  ArrowProps,
  CircleProps,
  PaddingProps,
  StackProps,
  AlignProps,
  CenterProps,
  SizedBoxProps,
  AspectRatioProps,
  FlexProps,
  WrapProps,
  SingleChildScrollViewProps,
} from '../../types/node';

function createCyanComponent<P = any>(tagName: string) {
  const Comp: React.FC<React.PropsWithChildren<P>> = (props: React.PropsWithChildren<P>) =>
    React.createElement(tagName, props as any);
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

export const Padding = createCyanComponent<PaddingProps>('cyan-padding');
export const Stack = createCyanComponent<StackProps>('cyan-stack');
export const Align = createCyanComponent<AlignProps>('cyan-align');
export const Center = createCyanComponent<CenterProps>('cyan-center');
export const SizedBox = createCyanComponent<SizedBoxProps>('cyan-sizedbox');
export const AspectRatio = createCyanComponent<AspectRatioProps>('cyan-aspectratio');
export const Flex = createCyanComponent<FlexProps>('cyan-flex');
export const Wrap = createCyanComponent<WrapProps>('cyan-wrap');
export const SingleChildScrollView = createCyanComponent<SingleChildScrollViewProps>('cyan-singlechildscrollview');
