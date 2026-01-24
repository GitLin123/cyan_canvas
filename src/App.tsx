import React, { useState, useEffect, useRef } from 'react';
import { Rect, Container } from './core/adaptor/reconciler/components';

const App = () => {
  // 1. 定义矩形的 X 坐标状态
  const [posX, setPosX] = useState(0);
  // 2. 使用 Ref 存储速度，避免触发不必要的 React 渲染
  const speed = useRef(2);
  const containerWidth = 400;
  const rectWidth = 100;

  useEffect(() => {
    // 3. 从全局获取引擎实例
    const engine = (window as any).__CYAN_ENGINE__;
    if (!engine) return;

    // 4. 定义每一帧的更新逻辑
    const handleTick = (elapsed: number, delta: number) => {
      setPosX((prevX) => {
        let nextX = prevX + speed.current;

        // 5. 边界检测：碰撞到左右边缘时反转速度
        if (nextX + rectWidth >= containerWidth || nextX <= 0) {
          speed.current *= -1;
          return prevX; // 保持在边界内
        }
        return nextX;
      });
    };

    // 6. 将任务添加到引擎的渲染循环中
    engine.ticker.add(handleTick);
    return () => engine.ticker.remove(handleTick);
  }, []);

  return (
    <Container width={containerWidth} height={200} color="#f0f0f0">
      <Rect
        x={posX}
        y={50}
        width={rectWidth}
        height={100}
        color="royalblue"
      />
    </Container>
  );
};

export default App;