import { RowNode } from '../../nodes/layout/RowNode';
import { RectNode } from '../../nodes/RectNode';
import { ColumnNode } from '../../nodes/layout/ColumnNode';
import { ContainerNode } from '../../nodes/layout/ContainerNode';
import { TriangleNode } from '../../nodes/TriangleNode';
import { ArrowNode } from '../../nodes/ArrowNode';
import { CircleNode } from '../../nodes/CircleNode';
import { TextNode } from '../../nodes/TextNode';
import { ImageNode } from '../../nodes/ImageNodes';
import { PaddingNode } from '../../nodes/layout/PaddingNode';
import { StackNode } from '../../nodes/layout/StackNode';
import { AlignNode } from '../../nodes/layout/AlignNode';
import { CenterNode } from '../../nodes/layout/CenterNode';
import { SizedBoxNode } from '../../nodes/layout/SizedBoxNode';
import { FlexNode } from '../../nodes/layout/FlexNode';
import { WrapNode } from '../../nodes/layout/WrapNode';
import { SingleChildScrollViewNode } from '../../nodes/layout/SingleChildScrollViewNode';
import { GestureDetectorNode } from '../../nodes/GestureDetectorNode';
import { ListenerNode } from '../../nodes/ListenerNode';
import { ExpandedNode } from '../../nodes/layout/ExpandedNode';
import { SpacerNode } from '../../nodes/layout/SpacerNode';
import { PositionedNode } from '../../nodes/layout/PositionedNode';
import { OpacityNode } from '../../nodes/layout/OpacityNode';
import { ClipRRectNode } from '../../nodes/layout/ClipRRectNode';
import { TransformNode } from '../../nodes/layout/TransformNode';
import { OffstageNode } from '../../nodes/layout/OffstageNode';

export const COMPONENT_MAP: Record<string, any> = {
  'cyan-row': RowNode,
  'cyan-rect': RectNode,
  'cyan-column': ColumnNode,
  'cyan-container': ContainerNode,
  'cyan-triangle': TriangleNode,
  'cyan-arrow': ArrowNode,
  'cyan-circle': CircleNode,
  'cyan-text': TextNode,
  'cyan-image': ImageNode,
  'cyan-padding': PaddingNode,
  'cyan-stack': StackNode,
  'cyan-align': AlignNode,
  'cyan-center': CenterNode,
  'cyan-sizedbox': SizedBoxNode,
  'cyan-flex': FlexNode,
  'cyan-wrap': WrapNode,
  'cyan-singlechildscrollview': SingleChildScrollViewNode,
  'cyan-gesturedetector': GestureDetectorNode,
  'cyan-listener': ListenerNode,
  'cyan-expanded': ExpandedNode,
  'cyan-spacer': SpacerNode,
  'cyan-positioned': PositionedNode,
  'cyan-opacity': OpacityNode,
  'cyan-cliprrect': ClipRRectNode,
  'cyan-transform': TransformNode,
  'cyan-offstage': OffstageNode,
};
