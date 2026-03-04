import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Column,
  Row,
  Text,
  GestureDetector,
  SizedBox,
  Listener,
} from '../core/adaptor/reconciler/components';
import { useEngine, useWindowSize } from '../core/adaptor/reconciler';
import { MainAxisAlignment, CrossAxisAlignment } from '../core/types/enums';

interface RectData {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

function generateRects(count: number, areaW: number, areaH: number): RectData[] {
  const rects: RectData[] = [];
  for (let i = 0; i < count; i++) {
    const w = 10 + Math.random() * 30;
    const h = 10 + Math.random() * 30;
    rects.push({
      id: i,
      x: Math.random() * (areaW - w),
      y: Math.random() * (areaH - h),
      w, h,
      color: `hsl(${Math.random() * 360}, 60%, 65%)`,
    });
  }
  return rects;
}

function bruteForceHitTest(rects: RectData[], px: number, py: number): number[] {
  const hits: number[] = [];
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
      hits.push(r.id);
    }
  }
  return hits;
}

const AREA_W = 600;
const AREA_H = 400;
const COUNT_OPTIONS = [500, 1000, 2000];

const RTreeDemo: React.FC = () => {
  const { width, height } = useWindowSize();
  const engine = useEngine();
  const [count, setCount] = useState(500);
  const [rects, setRects] = useState<RectData[]>(() => generateRects(500, AREA_W, AREA_H));
  const [hitIds, setHitIds] = useState<Set<number>>(new Set());
  const [result, setResult] = useState({ rtreeTime: 0, bruteTime: 0, rtreeHits: 0, bruteHits: 0 });
  const rectsRef = useRef(rects);
  rectsRef.current = rects;

  const handleRegenerate = useCallback((n: number) => {
    setCount(n);
    const newRects = generateRects(n, AREA_W, AREA_H);
    setRects(newRects);
    rectsRef.current = newRects;
    setHitIds(new Set());
    setResult({ rtreeTime: 0, bruteTime: 0, rtreeHits: 0, bruteHits: 0 });
  }, []);

  const handleClick = useCallback((e: any) => {
    const px = e.localX ?? 0;
    const py = e.localY ?? 0;
    const currentRects = rectsRef.current;

    // RTree 查询
    const t0 = performance.now();
    const spatial = engine.spatialIndex;
    const rtreeResults = spatial.queryRegion({
      minX: px - 1, minY: py - 1, maxX: px + 1, maxY: py + 1,
    });
    const rtreeTime = performance.now() - t0;

    // 暴力遍历
    const t1 = performance.now();
    const bruteResults = bruteForceHitTest(currentRects, px, py);
    const bruteTime = performance.now() - t1;

    setHitIds(new Set(bruteResults));
    setResult({
      rtreeTime: +rtreeTime.toFixed(3),
      bruteTime: +bruteTime.toFixed(3),
      rtreeHits: rtreeResults.length,
      bruteHits: bruteResults.length,
    });
  }, [engine]);

  return (
    <Container width={width} height={height} color="#fff">
      <Column mainAxisAlignment={MainAxisAlignment.Start} crossAxisAlignment={CrossAxisAlignment.Start}>
        <Container width={width} height={40} color="#9B59B6">
          <Text fontSize={18} color="#fff">RTree 空间索引对比</Text>
        </Container>
        <Container x={16} y={8}>
          <Column crossAxisAlignment={CrossAxisAlignment.Start}>
            {/* 控制栏 */}
            <Row mainAxisAlignment={MainAxisAlignment.Start}>
              <Text fontSize={13} color="#333">{`节点数: ${count}`}</Text>
              <SizedBox width={16} />
              {COUNT_OPTIONS.map(n => (
                <GestureDetector key={n} onTap={() => handleRegenerate(n)}>
                  <Container
                    width={60} height={28}
                    color={count === n ? '#9B59B6' : '#bbb'}
                    borderRadius={4}
                  >
                    <Text fontSize={11} color="#fff">{`${n}`}</Text>
                  </Container>
                </GestureDetector>
              ))}
            </Row>
            <SizedBox height={8} />
            {/* 结果面板 */}
            <Row mainAxisAlignment={MainAxisAlignment.Start}>
              <Container width={180} height={60} color="#f0f0f0" borderRadius={6}>
                <Column crossAxisAlignment={CrossAxisAlignment.Start}>
                  <Text fontSize={11} color="#333">{`RTree: ${result.rtreeTime}ms (${result.rtreeHits} hits)`}</Text>
                  <Text fontSize={11} color="#333">{`暴力: ${result.bruteTime}ms (${result.bruteHits} hits)`}</Text>
                  <Text fontSize={11} color="#9B59B6">
                    {result.bruteTime > 0
                      ? `加速比: ${(result.bruteTime / Math.max(result.rtreeTime, 0.001)).toFixed(1)}x`
                      : '点击画布测试'}
                  </Text>
                </Column>
              </Container>
            </Row>
            <SizedBox height={8} />
            {/* 画布区域 */}
            <Text fontSize={12} color="#666">点击下方区域进行 hitTest 对比</Text>
            <SizedBox height={4} />
            <Listener onPointerDown={handleClick}>
              <Container width={AREA_W} height={AREA_H} color="#fafafa" borderRadius={4}>
                {rects.map(r => (
                  <Container
                    key={r.id}
                    x={r.x} y={r.y}
                    width={r.w} height={r.h}
                    color={hitIds.has(r.id) ? '#E74C3C' : r.color}
                    opacity={hitIds.has(r.id) ? 1 : 0.6}
                  />
                ))}
              </Container>
            </Listener>
          </Column>
        </Container>
      </Column>
    </Container>
  );
};

export default RTreeDemo;
