# Cyan Canvas 重构计划

## 阶段 1：基础抽象（预计减少 300 行代码）

### 1.1 创建 ShapeNode 基类
**文件：** `src/core/nodes/base/ShapeNode.ts`

```typescript
export abstract class ShapeNode extends RenderNode {
  protected _color: string = 'white';
  protected _opacity: number = 1;

  public get color() { return this._color; }
  public set color(v: string) {
    if (this._color === v) return;
    this._color = v;
    this.markNeedsPaint();
  }

  public get opacity() { return this._opacity; }
  public set opacity(v: number) {
    v = Math.max(0, Math.min(1, v));
    if (this._opacity === v) return;
    this._opacity = v;
    this.markNeedsPaint();
  }

  performLayout(constraints: BoxConstraints): Size {
    const width = this._preferredWidth ?? 100;
    const height = this._preferredHeight ?? 100;
    return { width, height };
  }
}
```

**迁移节点：**
- CircleNode → extends ShapeNode
- RectNode → extends ShapeNode
- TriangleNode → extends ShapeNode
- ArrowNode → extends ShapeNode

**预计减少：** ~80 行重复代码

---

### 1.2 创建 SingleChildLayoutNode 基类
**文件：** `src/core/nodes/base/SingleChildLayoutNode.ts`

```typescript
export abstract class SingleChildLayoutNode extends RenderNode {
  protected abstract computeChildConstraints(constraints: BoxConstraints): BoxConstraints;
  protected abstract computeChildPosition(childSize: Size): { x: number; y: number };

  performLayout(constraints: BoxConstraints): Size {
    if (this.children.length === 0) {
      return { width: constraints.minWidth, height: constraints.minHeight };
    }

    const child = this.children[0];
    const childConstraints = this.computeChildConstraints(constraints);
    child.layout(childConstraints);

    const pos = this.computeChildPosition({ width: child.width, height: child.height });
    child.setPosition(pos.x, pos.y);

    return this.computeSize(child, constraints);
  }

  protected computeSize(child: RenderNode, constraints: BoxConstraints): Size {
    return { width: child.width, height: child.height };
  }
}
```

**迁移节点：**
- AlignNode → extends SingleChildLayoutNode
- CenterNode → extends SingleChildLayoutNode
- PaddingNode → extends SingleChildLayoutNode
- SizedBoxNode → extends SingleChildLayoutNode

**预计减少：** ~120 行重复代码

---

### 1.3 创建工具类
**文件：** `src/core/utils/ConstraintUtils.ts`

```typescript
export class ConstraintUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  static applyWidth(value: number, constraints: BoxConstraints): number {
    return this.clamp(value, constraints.minWidth, constraints.maxWidth);
  }

  static applyHeight(value: number, constraints: BoxConstraints): number {
    return this.clamp(value, constraints.minHeight, constraints.maxHeight);
  }

  static deflate(constraints: BoxConstraints, horizontal: number, vertical: number): BoxConstraints {
    return {
      minWidth: Math.max(0, constraints.minWidth - horizontal),
      maxWidth: Math.max(0, constraints.maxWidth - horizontal),
      minHeight: Math.max(0, constraints.minHeight - vertical),
      maxHeight: Math.max(0, constraints.maxHeight - vertical),
    };
  }
}
```

**预计减少：** ~100 行重复代码

---

## 阶段 2：类型系统重构（预计减少 200 行）

### 2.1 创建类型层级
**文件：** `src/core/types/base.ts`

```typescript
export interface BaseNodeProps extends CyanEventHandlers {
  x?: number;
  y?: number;
  opacity?: number;
  visible?: boolean;
}

export interface SizedProps extends BaseNodeProps {
  width?: number;
  height?: number;
  preferredWidth?: number;
  preferredHeight?: number;
}

export interface ShapeProps extends SizedProps {
  color?: string;
  borderRadius?: number;
}

export interface LayoutProps extends SizedProps {
  padding?: number;
  margin?: number;
}
```

**迁移：** 重构 `src/core/types/node.ts` 中的 32 个 Props 类型

**预计减少：** ~150 行重复定义

---

### 2.2 创建 EdgeInsets 类
**文件：** `src/core/types/EdgeInsets.ts`

```typescript
export class EdgeInsets {
  constructor(
    public readonly top: number,
    public readonly right: number,
    public readonly bottom: number,
    public readonly left: number
  ) {}

  static all(value: number): EdgeInsets {
    return new EdgeInsets(value, value, value, value);
  }

  static symmetric(vertical: number, horizontal: number): EdgeInsets {
    return new EdgeInsets(vertical, horizontal, vertical, horizontal);
  }

  get horizontal(): number { return this.left + this.right; }
  get vertical(): number { return this.top + this.bottom; }

  deflateConstraints(constraints: BoxConstraints): BoxConstraints {
    return {
      minWidth: Math.max(0, constraints.minWidth - this.horizontal),
      maxWidth: Math.max(0, constraints.maxWidth - this.horizontal),
      minHeight: Math.max(0, constraints.minHeight - this.vertical),
      maxHeight: Math.max(0, constraints.maxHeight - this.vertical),
    };
  }
}
```

**预计减少：** ~50 行重复代码

---

## 阶段 3：性能优化（预计提升 30-50%）

### 3.1 优化脏区域合并算法
**文件：** `src/core/DirtyRegionManager.ts`

**当前问题：** O(n²) 贪心合并，大量节点时性能下降

**优化方案：** 使用扫描线算法 + 区间树

```typescript
private _mergeRegions(regions: AABB[]): AABB[] {
  if (regions.length <= 1) return [...regions];

  // 1. 按 minX 排序
  regions.sort((a, b) => a.minX - b.minX);

  // 2. 扫描线合并
  const result: AABB[] = [];
  let current = { ...regions[0] };

  for (let i = 1; i < regions.length; i++) {
    const r = regions[i];
    if (this._shouldMerge(current, r)) {
      current = this._union(current, r);
    } else {
      result.push(current);
      current = { ...r };
    }
  }
  result.push(current);

  return result;
}
```

**预计提升：** 合并性能提升 50%（O(n²) → O(n log n)）

---

### 3.2 批量布局更新
**文件：** `src/core/PipelineOwner.ts`

**当前问题：** 每个节点单独触发布局

**优化方案：** 批量收集，一次性处理

```typescript
private _layoutBatch: Set<RenderNode> = new Set();
private _layoutScheduled: boolean = false;

markNeedsLayout(node: RenderNode) {
  this._layoutBatch.add(node);
  if (!this._layoutScheduled) {
    this._layoutScheduled = true;
    Promise.resolve().then(() => this.flushLayout());
  }
}

flushLayout() {
  const nodes = Array.from(this._layoutBatch).sort((a, b) => a.depth - b.depth);
  this._layoutBatch.clear();
  this._layoutScheduled = false;

  for (const node of nodes) {
    if (node.needsLayout) {
      node.layoutWithoutResize();
    }
  }
}
```

**预计提升：** 布局性能提升 30%

---

### 3.3 空间索引增量更新
**文件：** `src/core/spatial/SpatialIndex.ts`

**当前问题：** 每帧完全重建 R-Tree

**优化方案：** 增量更新

```typescript
private _dirtyNodes: Set<RenderNode> = new Set();

markDirty(node: RenderNode) {
  this._dirtyNodes.add(node);
}

rebuild(root: RenderNode) {
  if (this._dirtyNodes.size === 0) return;

  // 只更新脏节点的 AABB
  for (const node of this._dirtyNodes) {
    this._tree.update(node, this._computeBBox(node));
  }
  this._dirtyNodes.clear();
}
```

**预计提升：** 空间索引更新提升 80%

---

## 阶段 4：新特性（保持轻量）

### 4.1 图层系统（+5KB）
**文件：** `src/core/Layer.ts`

```typescript
export class Layer {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  private _dirty: boolean = true;

  constructor(public readonly id: string) {
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d')!;
  }

  paint(root: RenderNode) {
    if (!this._dirty) return;
    // 离屏绘制
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    root.paint(this._ctx);
    this._dirty = false;
  }

  composite(target: CanvasRenderingContext2D, opacity: number = 1) {
    target.globalAlpha = opacity;
    target.drawImage(this._canvas, 0, 0);
    target.globalAlpha = 1;
  }
}
```

**用途：** 支持图层混合、缓存、独立动画

---

### 4.2 对象池（+2KB）
**文件：** `src/core/utils/ObjectPool.ts`

```typescript
export class ObjectPool<T> {
  private _pool: T[] = [];

  constructor(
    private _factory: () => T,
    private _reset: (obj: T) => void,
    private _maxSize: number = 100
  ) {}

  acquire(): T {
    return this._pool.pop() || this._factory();
  }

  release(obj: T) {
    if (this._pool.length < this._maxSize) {
      this._reset(obj);
      this._pool.push(obj);
    }
  }
}
```

**用途：** 减少 GC 压力，提升动画性能

---

### 4.3 简单滤镜（+8KB）
**文件：** `src/core/filters/`

```typescript
export interface Filter {
  apply(ctx: CanvasRenderingContext2D): void;
  reset(ctx: CanvasRenderingContext2D): void;
}

export class BlurFilter implements Filter {
  constructor(public radius: number) {}

  apply(ctx: CanvasRenderingContext2D) {
    ctx.filter = `blur(${this.radius}px)`;
  }

  reset(ctx: CanvasRenderingContext2D) {
    ctx.filter = 'none';
  }
}
```

**用途：** 支持模糊、阴影、色彩调整

---

## 预期效果

| 指标 | 当前 | 优化后 | 提升 |
|------|------|--------|------|
| **代码行数** | ~8000 | ~7400 | -600 行 |
| **包体积** | ~50KB | ~65KB | +15KB (新特性) |
| **布局性能** | 10ms | 7ms | +30% |
| **脏区域合并** | 5ms | 2.5ms | +50% |
| **空间索引** | 3ms | 0.6ms | +80% |
| **单节点更新** | 0.5ms | 0.3ms | +40% |

---

## 实施顺序

1. **Week 1-2：** 阶段 1（基础抽象）
2. **Week 3：** 阶段 2（类型重构）
3. **Week 4-5：** 阶段 3（性能优化）
4. **Week 6：** 阶段 4（新特性，可选）

---

## 风险评估

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 破坏现有 API | 高 | 保持向后兼容，提供迁移指南 |
| 性能回归 | 中 | 每个阶段都做性能基准测试 |
| 引入新 Bug | 中 | 增加单元测试覆盖率到 80% |
| 学习曲线陡峭 | 低 | 保持 Flutter 风格，文档完善 |
