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
import { AspectRatioNode } from '../../nodes/layout/AspectRatioNode';
import { FlexNode } from '../../nodes/layout/FlexNode';
import { WrapNode } from '../../nodes/layout/WrapNode';
import { SingleChildScrollViewNode } from '../../nodes/layout/SingleChildScrollViewNode';

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
  'cyan-aspectratio': AspectRatioNode,
  'cyan-flex': FlexNode,
  'cyan-wrap': WrapNode,
  'cyan-singlechildscrollview': SingleChildScrollViewNode,
};
