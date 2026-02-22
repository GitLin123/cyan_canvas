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
  GestureDetectorProps,
  ListenerProps,
  ExpandedProps,
  SpacerProps,
  PositionedProps,
  OpacityProps,
  ClipRRectProps,
  TransformProps,
  ConstrainedBoxProps,
  FractionallySizedBoxProps,
  LimitedBoxProps,
  FittedBoxProps,
  OverflowBoxProps,
  OffstageProps,
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
export const GestureDetector = createCyanComponent<GestureDetectorProps>('cyan-gesturedetector');
export const Listener = createCyanComponent<ListenerProps>('cyan-listener');
export const Expanded = createCyanComponent<ExpandedProps>('cyan-expanded');
export const Spacer = createCyanComponent<SpacerProps>('cyan-spacer');
export const Positioned = createCyanComponent<PositionedProps>('cyan-positioned');
export const Opacity = createCyanComponent<OpacityProps>('cyan-opacity');
export const ClipRRect = createCyanComponent<ClipRRectProps>('cyan-cliprrect');
export const Transform = createCyanComponent<TransformProps>('cyan-transform');
export const ConstrainedBox = createCyanComponent<ConstrainedBoxProps>('cyan-constrainedbox');
export const FractionallySizedBox = createCyanComponent<FractionallySizedBoxProps>('cyan-fractionallysizedbox');
export const LimitedBox = createCyanComponent<LimitedBoxProps>('cyan-limitedbox');
export const FittedBox = createCyanComponent<FittedBoxProps>('cyan-fittedbox');
export const OverflowBox = createCyanComponent<OverflowBoxProps>('cyan-overflowbox');
export const Offstage = createCyanComponent<OffstageProps>('cyan-offstage');
