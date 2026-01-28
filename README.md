# 🟦 Cyan UI Engine

**Cyan** 是一个高性能、声明式的 Canvas UI 渲染引擎，由 React 驱动。它允许开发者使用熟悉的 React JSX 语法来构建高性能的 Canvas 应用，并提供了一套完整的布局和交互系统。

## 🌟 特性

- ⚛️ **React 驱动**: 完整的声明式 UI 开发体验。
- ⚡ **高性能渲染**: 内置双缓冲机制与脏重绘（Dirty Rect）优化。
- 📐 **约束布局**: 仿 Flutter 的 BoxConstraints 布局模型，支持 Flex 容器（Column/Row）。
- 🖱️ **完整事件链路**: 支持点击、悬浮、滚动及右键菜单等交互。
- 📦 **轻量化**: 摆脱沉重的 DOM 树，直接操作 Canvas 像素。

## 🛠️ 技术架构



1. **Reconciler**: 基于 `react-reconciler` 实现的 HostConfig，连接 React Fiber 与 Cyan 渲染树。
2. **Nodes**: 包含 `Rect`, `Container`, `Column`, `Row`, `Text` 等基础渲染节点。
3. **Engine**: 负责 Ticker 调度、布局计算、离屏缓冲区合成及最终绘制。
4. **Events**: 坐标空间转换与碰撞检测（Hit Testing）。

## 🚀 快速开始

### 基础用法

```tsx
import React, { useState } from 'react';
import { Rect, Column, Container, Text } from './core/adaptor/reconciler/components';

const App = () => {
  const [hover, setHover] = useState(false);

  return (
    <Container 
      padding={20} 
      color={hover ? '#1e90ff' : '#70a1ff'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Column>
        <Rect width={100} height={100} color="red" />
        <Text text="Hello Cyan!" color="white" fontSize={20} />
      </Column>
    </Container>
  );
};