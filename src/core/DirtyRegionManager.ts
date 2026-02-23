import type { AABB } from './types/geometry';

/**
 * Chrome-style 脏矩形管理器（四叉树加速版）
 *
 * 职责：
 * 1. 收集每帧中所有脏区域（节点变化前的旧 bounds + 变化后的新 bounds）
 * 2. 使用四叉树空间索引加速矩形合并（O(n log n) vs O(n²)）
 * 3. 提供最终的脏矩形列表供 Engine 做局部重绘
 */

const MERGE_THRESHOLD = 64; // 两个矩形间距小于此值时合并（避免过多小矩形）
const QUADTREE_CAPACITY = 8; // 四叉树节点容量
const QUADTREE_MAX_DEPTH = 8; // 四叉树最大深度，防止重叠区域导致无限递归

interface QuadTreeNode {
  bounds: AABB;
  regions: AABB[];
  children: QuadTreeNode[] | null;
}

function createQuadTree(bounds: AABB, regions: AABB[], depth: number = 0): QuadTreeNode {
  const node: QuadTreeNode = { bounds, regions: [], children: null };

  if (regions.length <= QUADTREE_CAPACITY || depth >= QUADTREE_MAX_DEPTH) {
    node.regions = regions;
    return node;
  }

  // 分割为四个子区域
  const midX = (bounds.minX + bounds.maxX) / 2;
  const midY = (bounds.minY + bounds.maxY) / 2;

  const quadrants: AABB[] = [
    { minX: bounds.minX, minY: bounds.minY, maxX: midX, maxY: midY }, // 左上
    { minX: midX, minY: bounds.minY, maxX: bounds.maxX, maxY: midY }, // 右上
    { minX: bounds.minX, minY: midY, maxX: midX, maxY: bounds.maxY }, // 左下
    { minX: midX, minY: midY, maxX: bounds.maxX, maxY: bounds.maxY }, // 右下
  ];

  const childRegions: AABB[][] = [[], [], [], []];

  for (const region of regions) {
    for (let i = 0; i < 4; i++) {
      if (intersects(region, quadrants[i])) {
        childRegions[i].push(region);
      }
    }
  }

  node.children = quadrants.map((q, i) => createQuadTree(q, childRegions[i], depth + 1));
  return node;
}

function intersects(a: AABB, b: AABB): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX &&
         a.minY <= b.maxY && a.maxY >= b.minY;
}

function queryNearby(tree: QuadTreeNode, region: AABB, threshold: number): AABB[] {
  const expanded: AABB = {
    minX: region.minX - threshold,
    minY: region.minY - threshold,
    maxX: region.maxX + threshold,
    maxY: region.maxY + threshold,
  };

  const results: AABB[] = [];
  const stack: QuadTreeNode[] = [tree];

  while (stack.length > 0) {
    const node = stack.pop()!;
    if (!intersects(node.bounds, expanded)) continue;

    if (node.children) {
      stack.push(...node.children);
    } else {
      results.push(...node.regions);
    }
  }

  return results;
}

export class DirtyRegionManager {
  private _regions: AABB[] = [];
  private _fullRepaint: boolean = true; // 首帧强制全量

  /** 标记需要全量重绘（resize、首次渲染等） */
  markFullRepaint() {
    this._fullRepaint = true;
  }

  get isFullRepaint(): boolean {
    return this._fullRepaint;
  }

  /** 添加一个脏区域 */
  addRegion(region: AABB) {
    if (region.maxX <= region.minX || region.maxY <= region.minY) return;
    this._regions.push(region);
  }

  /** 添加节点的世界 AABB 作为脏区域 */
  addNodeBounds(worldX: number, worldY: number, width: number, height: number) {
    this.addRegion({
      minX: worldX,
      minY: worldY,
      maxX: worldX + width,
      maxY: worldY + height,
    });
  }

  /** 获取合并后的脏矩形列表，并清空内部状态 */
  flush(viewportWidth: number, viewportHeight: number): AABB[] | null {
    if (this._fullRepaint) {
      this._fullRepaint = false;
      this._regions.length = 0;
      return null; // null 表示全量重绘
    }

    if (this._regions.length === 0) {
      return []; // 空数组表示无需重绘
    }

    // 合并重叠/相邻矩形
    const merged = this._mergeRegions(this._regions);
    this._regions.length = 0;

    // 裁剪到视口范围
    const clipped: AABB[] = [];
    for (const r of merged) {
      const c: AABB = {
        minX: Math.max(0, Math.floor(r.minX)),
        minY: Math.max(0, Math.floor(r.minY)),
        maxX: Math.min(viewportWidth, Math.ceil(r.maxX)),
        maxY: Math.min(viewportHeight, Math.ceil(r.maxY)),
      };
      if (c.maxX > c.minX && c.maxY > c.minY) {
        clipped.push(c);
      }
    }

    //如果脏区域覆盖面积超过视口 95%，退化为全量重绘（暂时禁用以展示效果）
    const viewportArea = viewportWidth * viewportHeight;
    let dirtyArea = 0;
    for (const r of clipped) {
      dirtyArea += (r.maxX - r.minX) * (r.maxY - r.minY);
    }
    const coverage = dirtyArea / viewportArea;
    if (coverage > 0.95) {
      console.log(`[DirtyRect] Coverage ${(coverage * 100).toFixed(1)}% > 95%, fallback to full repaint`);
      return null;
    }

    return clipped;
  }

  /** 四叉树加速合并：O(n log n) 复杂度 */
  private _mergeRegions(regions: AABB[]): AABB[] {
    if (regions.length <= 1) return [...regions];

    // 计算包围盒
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const r of regions) {
      if (r.minX < minX) minX = r.minX;
      if (r.minY < minY) minY = r.minY;
      if (r.maxX > maxX) maxX = r.maxX;
      if (r.maxY > maxY) maxY = r.maxY;
    }

    const bounds: AABB = { minX, minY, maxX, maxY };
    const tree = createQuadTree(bounds, regions);

    // 使用四叉树查询附近矩形并合并
    const merged = new Set<AABB>();
    const processed = new Set<AABB>();

    for (const region of regions) {
      if (processed.has(region)) continue;

      let current = { ...region };
      let changed = true;

      while (changed) {
        changed = false;
        const nearby = queryNearby(tree, current, MERGE_THRESHOLD);

        for (const candidate of nearby) {
          if (processed.has(candidate)) continue;
          if (this._shouldMerge(current, candidate)) {
            current = this._union(current, candidate);
            processed.add(candidate);
            changed = true;
          }
        }
      }

      merged.add(current);
      processed.add(region);
    }

    return Array.from(merged);
  }

  /** 判断两个矩形是否应该合并（重叠或间距小于阈值） */
  private _shouldMerge(a: AABB, b: AABB): boolean {
    const gapX = Math.max(0, Math.max(a.minX, b.minX) - Math.min(a.maxX, b.maxX));
    const gapY = Math.max(0, Math.max(a.minY, b.minY) - Math.min(a.maxY, b.maxY));
    return gapX <= MERGE_THRESHOLD && gapY <= MERGE_THRESHOLD;
  }

  private _union(a: AABB, b: AABB): AABB {
    return {
      minX: Math.min(a.minX, b.minX),
      minY: Math.min(a.minY, b.minY),
      maxX: Math.max(a.maxX, b.maxX),
      maxY: Math.max(a.maxY, b.maxY),
    };
  }
}
