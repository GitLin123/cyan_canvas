import { RowNode } from '../../nodes/RowNode';
import { RectNode } from '../../nodes/RectNode';
import { ColumnNode } from '../../nodes/ColumnNode';
import { ContainerNode } from "../../nodes/ContainerNode";
import { TriangleNode } from '../../nodes/TriangleNode';
import { ArrowNode } from '../../nodes/ArrowNode';
import { CircleNode } from '../../nodes/CircleNode';

export const COMPONENT_MAP: Record<string, any> = {
  'cyan-row': RowNode,
  'cyan-rect': RectNode,
  'cyan-column': ColumnNode,
  'cyan-container': ContainerNode,
  'cyan-triangle': TriangleNode,
  'cyan-arrow': ArrowNode,
  'cyan-circle': CircleNode
};