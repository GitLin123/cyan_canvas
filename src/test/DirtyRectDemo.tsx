import React, { useState, useEffect } from 'react'
import {
  Column,
  Row,
  Text,
  Container,
  Padding,
  Center,
  GestureDetector,
} from '../core/adaptor/reconciler/components'
import { MainAxisAlignment, CrossAxisAlignment, FontWeight } from '../core/types/container'

const COLORS = [
  '#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB',
  '#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC',
  '#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D',
  '#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8',
]

const W = window.innerWidth
const COLS = 8
const CELL = Math.floor((W - 32) / COLS)

/** 可交互方块 - 点击后自动递增计数器 */
const AnimatedCell = ({ index: _index }: { index: number }) => {
  const [count, setCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (!isAnimating) return
    const timer = setInterval(() => {
      setCount(c => c + 1)
    }, 100)
    return () => clearInterval(timer)
  }, [isAnimating])

  return (
    <GestureDetector
      onTap={() => {
        setIsAnimating(v => !v)
      }}
    >
      <Container
        width={CELL - 4}
        height={CELL - 4}
        color={isAnimating ? '#F44336' : '#4CAF50'}
        borderRadius={8}
      >
        <Center>
          <Column width={CELL - 16} mainAxisAlignment={MainAxisAlignment.Center} crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text text={isAnimating ? '⏸' : '▶'} fontSize={16} color="#fff" fontWeight={FontWeight.W700} />
            <Text text={`${count}`} fontSize={20} color="#fff" fontWeight={FontWeight.W700} />
          </Column>
        </Center>
      </Container>
    </GestureDetector>
  )
}

const DirtyRectDemo = () => {
  const [stats, setStats] = useState({ dirtyCount: 0, regionCount: 0, totalCells: 64 })
  const [forceFullRepaint, setForceFullRepaint] = useState(false)

  // 开启 debug 模式
  useEffect(() => {
    const engine = (window as any).__CYAN_ENGINE__
    if (engine) {
      engine.debugDirtyRegions = true

      // 强制全量重绘模式（用于对比）
      if (forceFullRepaint) {
        const originalFlush = engine.pipelineOwner.dirtyRegionManager.flush.bind(
          engine.pipelineOwner.dirtyRegionManager
        )
        engine.pipelineOwner.dirtyRegionManager.flush = () => null // 返回 null 强制全量

        const interval = setInterval(() => {
          setStats({
            dirtyCount: engine.debugStats.dirtyNodeCount,
            regionCount: engine.debugStats.dirtyRegionCount,
            totalCells: 64
          })
        }, 100)

        return () => {
          engine.pipelineOwner.dirtyRegionManager.flush = originalFlush
          engine.debugDirtyRegions = false
          clearInterval(interval)
        }
      }

      // 正常模式统计
      const interval = setInterval(() => {
        setStats({
          dirtyCount: engine.debugStats.dirtyNodeCount,
          regionCount: engine.debugStats.dirtyRegionCount,
          totalCells: 64
        })
      }, 100)

      return () => {
        engine.debugDirtyRegions = false
        clearInterval(interval)
      }
    }
  }, [forceFullRepaint])

  // 生成 8x8 网格：4 个可交互 + 60 个静态
  const rows: React.ReactNode[] = []
  let cellIndex = 0
  const animatedPositions = new Set([9, 18, 45, 54]) // 4 个动画方块

  for (let row = 0; row < 8; row++) {
    const cells: React.ReactNode[] = []
    for (let col = 0; col < COLS; col++) {
      const idx = cellIndex++
      if (animatedPositions.has(idx)) {
        cells.push(
          <Padding key={idx} padding={2}>
            <AnimatedCell index={idx} />
          </Padding>
        )
      } else {
        cells.push(
          <Padding key={idx} padding={2}>
            <Container
              width={CELL - 4}
              height={CELL - 4}
              color={COLORS[idx % COLORS.length]}
              borderRadius={6}
            >
              <Center>
                <Text text={`${idx}`} fontSize={11} color="#666" />
              </Center>
            </Container>
          </Padding>
        )
      }
    }
    rows.push(
      <Row key={row} width={W - 16} mainAxisAlignment={MainAxisAlignment.Start}>
        {cells}
      </Row>
    )
  }

  return (
    <Column width={W} crossAxisAlignment={CrossAxisAlignment.Center}>
      {/* 标题 */}
      <Padding padding={12}>
        <Container width={W - 24} color="#1a1a2e" padding={12} borderRadius={10}>
          <Column width={W - 48}>
            <Text
              text="🔴 Dirty Region Visualizer"
              fontSize={22}
              fontWeight={FontWeight.W700}
              color="#ffffff"
            />
            <Text
              text="Red overlay = repainted area (18% opacity)"
              fontSize={12}
              color="#aaa"
            />
          </Column>
        </Container>
      </Padding>

      {/* 性能统计 + 模式切换 */}
      <Padding padding={12}>
        <Container width={W - 24} color="#2E7D32" padding={10} borderRadius={8}>
          <Column width={W - 48}>
            <Row width={W - 48} mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
              <Column width={(W - 48) / 3}>
                <Text text="Dirty Nodes" fontSize={11} color="#A5D6A7" />
                <Text text={`${stats.dirtyCount}`} fontSize={24} color="#fff" fontWeight={FontWeight.W700} />
              </Column>
              <Column width={(W - 48) / 3}>
                <Text text="Dirty Rects" fontSize={11} color="#A5D6A7" />
                <Text
                  text={stats.regionCount === -1 ? 'FULL' : `${stats.regionCount}`}
                  fontSize={24}
                  color="#fff"
                  fontWeight={FontWeight.W700}
                />
              </Column>
              <Column width={(W - 48) / 3}>
                <Text text="Total Cells" fontSize={11} color="#A5D6A7" />
                <Text text={`${stats.totalCells}`} fontSize={24} color="#fff" fontWeight={FontWeight.W700} />
              </Column>
            </Row>
            <Padding padding={4}>
              <GestureDetector onTap={() => setForceFullRepaint(v => !v)}>
                <Container
                  width={W - 48}
                  height={36}
                  color={forceFullRepaint ? '#D32F2F' : '#388E3C'}
                  borderRadius={6}
                >
                  <Center>
                    <Text
                      text={forceFullRepaint ? '🔴 Full Repaint Mode' : '✅ Dirty Rect Mode'}
                      fontSize={13}
                      color="#fff"
                      fontWeight={FontWeight.W600}
                    />
                  </Center>
                </Container>
              </GestureDetector>
            </Padding>
          </Column>
        </Container>
      </Padding>

      {/* 网格 */}
      <Padding padding={8}>
        <Column width={W - 16}>
          {rows}
        </Column>
      </Padding>

      {/* 说明 */}
      <Padding padding={12}>
        <Container width={W - 24} color="#263238" padding={12} borderRadius={8}>
          <Column width={W - 48}>
            <Text text="How to test:" fontSize={14} fontWeight={FontWeight.W600} color="#80CBC4" />
            <Text text="1. Click green cells (▶) to start animation" fontSize={12} color="#B0BEC5" />
            <Text text="2. Dirty Rect Mode: only animating cells flash red" fontSize={12} color="#B0BEC5" />
            <Text text="3. Click green button to toggle Full Repaint Mode" fontSize={12} color="#B0BEC5" />
            <Text text="4. Full Repaint Mode: entire screen flashes red" fontSize={12} color="#B0BEC5" />
          </Column>
        </Container>
      </Padding>
    </Column>
  )
}

export default DirtyRectDemo
