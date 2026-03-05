# Cyan Engine

**Cyan Engine** 是一个面向浏览器 Canvas 的高性能 UI 渲染引擎。它基于自定义渲染树（RenderNode）和增量渲染管线，提供布局、事件、空间索引与性能监控能力，适合构建高交互、低 DOM 依赖的可视化应用。引擎采用类似 Flutter 的约束布局模型和 React Reconciler 适配层，让开发者既能享受命令式 API 的精细控制，又能使用声明式 JSX 构建复杂 UI。

> **npm 包名**：`@jianlinzhou/cyan_engine`
>
> **当前版本**：0.2.1

---

## 1. 设计目标与核心理念

Cyan Engine 的设计旨在解决现代 Web 应用中 Canvas 渲染面临的三大核心挑战。第一个挑战是 DOM 节点较多时，复杂动画和交互场景下性能波动显著，传统方案难以维持稳定的帧率表现。第二个挑战是纯 Canvas 代码组织成本高昂，开发者需要手动管理布局计算、事件分发和绘制顺序，缺少统一的编程模型。第三个挑战是大型画布场景下需要局部重绘优化、命中测试加速和可观测性支持，传统方案缺乏开箱即用的解决方案。

基于这些问题，Cyan Engine 确立了三个核心目标。第一个目标是建立统一的节点模型，用相同的方式管理布局属性和绘制逻辑，让代码组织更加清晰。第二个目标是引入脏区管理（Dirty Region）和 R-Tree 空间索引，显著降低每帧渲染的计算开销。第三个目标是提供完整的监控模块，帮助开发者快速定位性能瓶颈并进行针对性优化。

---

## 2. 核心特性

Cyan Engine 提供了完整的 UI 渲染能力，涵盖布局、事件、动画、渲染和性能优化等多个维度。

### 2.1 布局系统

引擎采用类似 Flutter 的约束布局模型（BoxConstraints），每个节点都受到父节点传递的约束限制。布局系统支持以下容器类型：

**垂直与水平布局**：ColumnNode 和 RowNode 分别实现垂直和水平方向上的子元素排列，支持主轴对齐（MainAxisAlignment）和交叉轴对齐（CrossAxisAlignment）。主轴对齐包括 Start（起始对齐）、Center（居中对齐）、End（结束对齐）、SpaceBetween（两端对齐）、SpaceAround（等间距对齐）和 SpaceEvenly（完全等间距）六种模式。交叉轴对齐支持 Start、Center、End 和 Stretch（拉伸填满）四种模式。

**堆叠布局**：StackNode 实现子元素的层叠排列，后添加的元素位于上层。支持通过 PositionedNode 对子元素进行绝对定位，可精确控制每个元素的位置和尺寸。

**自动换行**：WrapNode 当子元素超出容器宽度时自动换行排列，适合实现标签云、商品列表等场景。支持 spacing（元素间距）和 runSpacing（行间距）两个参数。

**弹性布局**：FlexNode 实现类似 CSS Flexbox 的弹性盒子模型，支持 flex 属性按比例分配剩余空间。ExpandedNode 作为 Flex 的子节点，自动填满父容器分配的空间。

**其他布局容器**：CenterNode 实现子元素居中显示；PaddingNode 为子元素添加内边距；AlignNode 将子元素定位到父容器的指定位置（支持九宫格定位）；SizedBoxNode 强制设置子元素的宽高；AspectRatioNode 强制子元素保持特定的宽高比；SingleChildScrollViewNode 实现单子元素的滚动容器；TransformNode 支持 2D 变换（平移、旋转、缩放）；ClipRRectNode 实现圆角裁剪；OpacityNode 控制透明度。

### 2.2 事件系统

引擎实现了完整的事件链路，包括命中测试、事件路由和手势竞技场。

**命中测试**：基于 R-Tree 空间索引加速命中测试，支持精确的碰撞检测。每个渲染节点都可以注册事件处理器，事件从根节点向下传播直到被捕获。

**手势识别**：支持多种手势类型的识别和处理。GestureRecognizer 实现 Tap（点击）、LongPress（长按）、Pan（拖拽）、Scale（缩放）等手势识别。GestureArena 协调多个手势识别器，确保一次交互只触发一个手势。

**事件类型**：支持 onClick（点击）、onMouseEnter（鼠标进入）、onMouseLeave（鼠标离开）、onMouseMove（鼠标移动）、onMouseDown（鼠标按下）、onMouseUp（鼠标释放）、onWheel（滚轮滚动）、onContextMenu（右键菜单）等鼠标事件。支持键盘事件（onKeyDown、onKeyUp）。

### 2.3 动画系统

引擎提供完整的动画支持，包括 AnimationController、Tween、Curves 和多个便捷的动画钩子。

**AnimationController**：动画控制器，负责管理动画的播放、暂停、反向和重复。支持 forward（正向播放）、reverse（反向播放）、stop（停止）、repeat（重复播放）和 oscillate（往复动画）方法。可以精确控制动画的持续时间、初始值和缓动曲线。

**Tween**：补间动画，定义动画的起始值和结束值。引擎内置多种 Tween 类型，包括 Tween<number>（数值动画）、ColorTween（颜色动画）、RectTween（矩形动画）等。

**Curves**：缓动曲线，定义动画值随时间变化的规律。引擎内置丰富的缓动曲线，包括 linear（线性）、ease（缓动）、easeIn（缓入）、easeOut（缓出）、easeInOut（缓入缓出）、elasticIn/Out/InOut（弹性曲线）、bounceIn/Out/InOut（弹跳曲线）等。

**动画钩子**：提供 useAnimation（显式动画控制）、useImplicitAnimation（隐式动画，自动响应值变化）和 useCompositeAnimation（组合动画）三个 React 钩子，简化动画的使用。

### 2.4 渲染后端

引擎支持 Canvas 2D 和 WebGL 两种渲染后端，可根据环境自动选择或手动指定。

**Canvas 2D**：基于原生 CanvasRenderingContext2D，适合大多数场景。提供 PaintingContext 抽象，支持绘制矩形、圆形、文本、图片、渐变等。

**WebGL**：基于 WebGL 的高性能渲染后端，适合需要大量图形元素的场景。提供 ShaderManager 管理着色器，支持更高效的批量渲染。

**双缓冲机制**：引擎内置离屏 Canvas 进行绘制，最后合成到主画布，避免闪烁和撕裂。

### 2.5 性能优化

**脏区管理（Dirty Region）**：引擎采用智能的脏检查机制，通过 markNeedsLayout() 和 markNeedsPaint() 标记需要更新的节点。PipelineOwner 收集所有脏节点，在下一帧集中处理。脏区覆盖率超过阈值时自动回退全量重绘。

**空间索引**：基于 R-Tree 实现空间索引，用于命中测试和区域查询。显著加速大量元素场景下的点击检测和范围查询。

**增量渲染**：每帧主要流程包括布局（仅处理脏布局节点）、空间索引重建、脏区收集、绘制和性能记录。通过增量更新避免全量重算。

### 2.6 性能监控

引擎自带监控模块，可用于开发期压测与性能回归。

**监控指标**：FPS（帧率）、FrameTime（帧时间）、Layout（布局耗时）、Paint（绘制耗时）、Dirty Node（脏节点数）、Dirty Region（脏区统计）、Memory（内存趋势与告警）、Hotspot（热点阶段分析）。

**使用方式**：可通过代码调用 Monitor.start/stop/getReport，或在浏览器控制台通过 window.cyan.monitor 访问。

---

## 3. 技术架构

Cyan Engine 采用分层架构实现关注点分离，从上到下分为五层。

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
│                    (或直接使用命令式 API)                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│               React Reconciler Layer                     │
│         (基于 react-reconciler 的 HostConfig)            │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    RenderNode Tree                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Column  │  │   Row    │  │  Stack   │  ...        │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                     Cyan Engine                          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Ticker │  │ Pipeline│  │  Paint  │  │ Events  │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│  │ Monitor │  │ Spatial │  │   DR    │               │
│  └─────────┘  └─────────┘  └─────────┘               │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Rendering Backend (Canvas2D / WebGL)         │
└─────────────────────────────────────────────────────────┘
```

**核心模块说明**

| 模块              | 职责                                          | 关键文件                   |
| ----------------- | --------------------------------------------- | -------------------------- |
| **Engine**        | 渲染管线调度、帧循环管理、脏检查、离屏渲染    | `Engine.ts`                |
| **Ticker**        | 基于 requestAnimationFrame 的帧循环，FPS 统计 | `ticker.ts`                |
| **RenderNode**    | 渲染节点基类，布局计算，绘制逻辑              | `nodes/base/RenderNode.ts` |
| **PipelineOwner** | 渲染管线所有者，脏节点跟踪，批量更新          | `PipelineOwner.ts`         |
| **Events**        | 事件委托、坐标转换、碰撞检测、手势识别        | `events/index.ts`          |
| **Animation**     | 动画控制器、补间动画、缓动曲线、动画钩子      | `animation/`               |
| **SpatialIndex**  | R-Tree 空间索引，加速命中测试和区域查询       | `spatial/RTree.ts`         |
| **DRManager**     | Dirty Region 脏区管理，局部重绘优化           | `DRManager.ts`             |
| **Monitor**       | 性能监控，FPS、耗时、内存统计                 | `monitor.ts`               |
| **Backend**       | 渲染后端，Canvas2D 和 WebGL 实现              | `backend/`                 |
| **Reconciler**    | 连接 React Fiber 与 Cyan 渲染树               | `adaptor/reconciler/`      |

---

## 4. 安装与环境要求

### 4.1 安装

```bash
npm install @jianlinzhou/cyan_engine
# 或
yarn add @jianlinzhou/cyan_engine
```

### 4.2 依赖要求

- **React**：>= 18.0.0
- **react-reconciler**：>= 0.29.0
- **Node.js**：>= 18.0.0
- **TypeScript**：>= 5.0
- **浏览器运行环境**：依赖 window 和 canvas API

---

## 5. 快速开始

Cyan Engine 支持两种使用方式：命令式 API（直接操作节点）和声明式 JSX（使用 React 组件）。

### 5.1 命令式 API

这种方式直接操作渲染节点，适合需要精细控制或不需要 React 的场景。

```typescript
import {
  CyanEngine,
  ColumnNode,
  ContainerNode,
  RectNode,
  TextNode,
  MainAxisAlignment,
  CrossAxisAlignment,
  FontWeight,
} from '@jianlinzhou/cyan_engine';

const engine = new CyanEngine({
  containerId: 'root',
  width: window.innerWidth,
  height: window.innerHeight,
  renderer: 'canvas2d', // 'canvas2d' | 'webgl' | 'auto'
});

// 创建根布局容器
const root = new ColumnNode();
root.mainAxisAlignment = MainAxisAlignment.Center;
root.crossAxisAlignment = CrossAxisAlignment.Center;

// 创建卡片容器
const card = new ContainerNode();
card.preferredWidth = 420;
card.preferredHeight = 220;
card.color = '#f7f8fb';
card.border = 1;
card.borderColor = '#d8dde8';
card.borderRadius = 12;
card.padding = 16;

// 创建标题文本
const title = new TextNode('Hello Cyan Engine');
title.fontSize = 30;
title.fontWeight = FontWeight.W700;
title.color = '#1a1a1a';

// 创建按钮
const button = new RectNode();
button.preferredWidth = 180;
button.preferredHeight = 52;
button.color = '#2563eb';
button.borderRadius = 8;

// 添加点击事件
let count = 0;
button.onClick = () => {
  count += 1;
  title.text = `Clicked ${count}`;
};

// 组装节点树
card.add(title);
card.add(button);
root.add(card);

// 启动引擎
engine.root = root;
engine.start();
```

### 5.2 声明式 JSX

这种方式使用类似 Flutter 的 JSX 组件，适合熟悉 React 的开发者。

```tsx
import React, { useState } from 'react';
import { CyanEngine, CyanRenderer } from '@jianlinzhou/cyan_engine';
import { Container, Column, Row, Rect, Text, Padding, Center } from '@jianlinzhou/cyan_engine';
import { MainAxisAlignment, CrossAxisAlignment, FontWeight, TextAlign } from '@jianlinzhou/cyan_engine';

const App = () => {
  const [counter, setCounter] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <Container width={window.innerWidth} height={window.innerHeight} color="#f5f5f5">
      <Column
        width={window.innerWidth}
        height={window.innerHeight}
        mainAxisAlignment={MainAxisAlignment.Center}
        crossAxisAlignment={CrossAxisAlignment.Center}
      >
        <Padding padding={40}>
          <Column crossAxisAlignment={CrossAxisAlignment.Center}>
            <Text
              text={`计数器: ${counter}`}
              fontSize={32}
              color="#333"
              fontWeight={FontWeight.W700}
              textAlign={TextAlign.Center}
            />
            <Padding padding={20}>
              <Rect
                width={200}
                height={100}
                color={hovered ? '#4CAF50' : '#2196F3'}
                borderRadius={12}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setCounter((c) => c + 1)}
              />
              <Center width={200} height={100}>
                <Text text="点击增加" fontSize={18} color="#fff" textAlign={TextAlign.Center} />
              </Center>
            </Padding>
            <Row mainAxisAlignment={MainAxisAlignment.Center}>
              <Circle radius={30} color="#FF9800" />
              <Padding padding={10} />
              <Circle radius={30} color="#9C27B0" />
              <Padding padding={10} />
              <Circle radius={30} color="#00BCD4" />
            </Row>
          </Column>
        </Padding>
      </Column>
    </Container>
  );
};

// 启动应用
const engine = new CyanEngine({
  containerId: 'root',
  width: window.innerWidth,
  height: window.innerHeight,
});
CyanRenderer.render(<App />, engine);
```

---

## 6. 事件处理

Cyan Engine 提供了完善的事件系统，支持鼠标和键盘交互。

### 6.1 鼠标事件

```tsx
import { Rect } from '@jianlinzhou/cyan_engine';

<Rect
  width={200}
  height={100}
  color="#2196F3"
  onClick={() => console.log('点击了矩形')}
  onMouseEnter={() => console.log('鼠标进入')}
  onMouseLeave={() => console.log('鼠标离开')}
  onMouseMove={() => console.log('鼠标移动')}
  onMouseDown={() => console.log('鼠标按下')}
  onMouseUp={() => console.log('鼠标释放')}
  onContextMenu={() => console.log('右键菜单')}
  onWheel={() => console.log('滚轮滚动')}
/>;
```

### 6.2 手势识别

引擎支持 Tap（点击）、LongPress（长按）、Pan（拖拽）等手势。

```tsx
import { GestureDetector, Rect } from '@jianlinzhou/cyan_engine';

<GestureDetector
  onTap={() => console.log('Tap')}
  onLongPress={() => console.log('LongPress')}
  onPan={(details) => console.log('Pan:', details)}
>
  <Rect width={200} height={100} color="#2196F3" />
</GestureDetector>;
```

---

## 7. 动画系统

### 7.1 AnimationController

动画控制器用于控制动画的播放、停止、反向等操作。

```typescript
import { AnimationController, Curves } from '@jianlinzhou/cyan_engine';

const controller = new AnimationController({
  duration: 500,
  curve: Curves.easeInOut,
});

// 播放动画
await controller.forward();

// 反向播放
await controller.reverse();

// 重复播放
await controller.repeat(3);

// 往复动画
await controller.oscillate(2);

// 停止动画
controller.stop();
```

### 7.2 动画钩子

```tsx
import { useAnimation, useImplicitAnimation, Curves } from '@jianlinzhou/cyan_engine';

// 显式动画控制
const { controller, animatedValue } = useAnimation(0, 100, {
  duration: 300,
  curve: Curves.easeInOut,
});

// 隐式动画（自动响应值变化）
const animatedWidth = useImplicitAnimation(targetWidth, {
  duration: 200,
  curve: Curves.easeOut,
});
```

### 7.3 缓动曲线

```typescript
import { Curves } from '@jianlinzhou/cyan_engine';

// 常用曲线
Curves.linear; // 线性
Curves.ease; // 缓动
Curves.easeIn; // 缓入
Curves.easeOut; // 缓出
Curves.easeInOut; // 缓入缓出

// 弹性曲线
Curves.easeInBack;
Curves.easeOutBack;
Curves.easeInOutBack;

// 弹性曲线
Curves.elasticIn;
Curves.elasticOut;
Curves.elasticInOut;

// 弹跳曲线
Curves.bounceIn;
Curves.bounceOut;
Curves.bounceInOut;
```

---

## 8. 布局系统详解

### 8.1 约束布局（BoxConstraints）

```typescript
interface BoxConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
```

### 8.2 布局容器一览

| 组件                      | 说明           | 关键属性                                       |
| ------------------------- | -------------- | ---------------------------------------------- |
| **Column**                | 垂直布局容器   | mainAxisAlignment, crossAxisAlignment, spacing |
| **Row**                   | 水平布局容器   | mainAxisAlignment, crossAxisAlignment, spacing |
| **Stack**                 | 堆叠布局       | alignment                                      |
| **Wrap**                  | 自动换行布局   | spacing, runSpacing, alignment                 |
| **Flex**                  | 弹性布局       | direction, flex                                |
| **Expanded**              | 弹性填充       | flex                                           |
| **Center**                | 居中布局       | -                                              |
| **Padding**               | 内边距         | padding                                        |
| **Align**                 | 对齐定位       | alignment                                      |
| **SizedBox**              | 固定尺寸       | width, height                                  |
| **AspectRatio**           | 宽高比限制     | aspectRatio                                    |
| **SingleChildScrollView** | 滚动容器       | scrollDirection                                |
| **Positioned**            | 绝对定位       | left, right, top, bottom                       |
| **Transform**             | 2D 变换        | transform                                      |
| **ClipRRect**             | 圆角裁剪       | borderRadius                                   |
| **Opacity**               | 透明度         | opacity                                        |
| **Offstage**              | 隐藏但保留布局 | visible                                        |

### 8.3 对齐方式

```tsx
import { Row, Column } from '@jianlinzhou/cyan_engine'
import { MainAxisAlignment, CrossAxisAlignment } from '@jianlinzhou/cyan_engine'

// 主轴对齐
<Row mainAxisAlignment={MainAxisAlignment.Start}>
<Row mainAxisAlignment={MainAxisAlignment.Center}>
<Row mainAxisAlignment={MainAxisAlignment.End}>
<Row mainAxisAlignment={MainAxisAlignment.SpaceBetween}>
<Row mainAxisAlignment={MainAxisAlignment.SpaceAround}>
<Row mainAxisAlignment={MainAxisAlignment.SpaceEvenly}>

// 交叉轴对齐
<Column crossAxisAlignment={CrossAxisAlignment.Start}>
<Column crossAxisAlignment={CrossAxisAlignment.Center}>
<Column crossAxisAlignment={CrossAxisAlignment.End}>
<Column crossAxisAlignment={CrossAxisAlignment.Stretch}>
```

---

## 9. 组件库

### 9.1 基础图形

| 组件         | 说明                 |
| ------------ | -------------------- |
| **Rect**     | 矩形，支持圆角和颜色 |
| **Circle**   | 圆形                 |
| **Triangle** | 三角形               |
| **Arrow**    | 箭头                 |
| **Text**     | 文本渲染             |
| **Image**    | 图片加载与显示       |

### 9.2 容器组件

| 组件                      | 说明                                   |
| ------------------------- | -------------------------------------- |
| **Container**             | 通用容器，支持背景、边框、圆角、渐变等 |
| **SingleChildScrollView** | 单子元素滚动容器                       |

---

## 10. 样式属性

### 10.1 通用样式

```tsx
import { Rect } from '@jianlinzhou/cyan_engine';

<Rect
  width={200}
  height={100}
  x={50}
  y={100}
  color="#FF5722"
  alpha={0.8}
  borderRadius={8}
  border={2}
  borderColor="#333"
  visible={true}
/>;
```

### 10.2 文本样式

```tsx
import { Text } from '@jianlinzhou/cyan_engine';
import { FontWeight, TextAlign } from '@jianlinzhou/cyan_engine';

<Text
  text="Hello Cyan"
  fontSize={24}
  fontFamily="Arial, sans-serif"
  fontWeight={FontWeight.W700}
  color="#333"
  textAlign={TextAlign.Center}
  lineHeight={1.5}
  maxLines={2}
  opacity={0.8}
/>;
```

---

## 11. 性能监控

### 11.1 代码方式

```typescript
import { Monitor, MonitorLevel } from '@jianlinzhou/cyan_engine';

Monitor.start(MonitorLevel.Standard);

// ...进行交互/动画操作

const report = Monitor.getReport();
console.table(report);

Monitor.stop();
```

### 11.2 浏览器控制台方式

```typescript
window.cyan.monitor.start('detailed');
window.cyan.monitor.getReport();
window.cyan.monitor.stop();
```

### 11.3 监控指标

- **FPS**：当前帧率
- **FrameTime**：帧时间
- **Layout**：布局计算耗时
- **Paint**：绘制耗时
- **Dirty Node**：脏节点数量
- **Dirty Region**：脏区统计
- **Memory**：内存趋势与告警
- **Hotspot**：热点阶段分析

---

## 12. 渲染管线

每帧主要流程：

1. **Layout**：仅处理脏布局节点（增量布局）
2. **SpatialIndex rebuild**：布局后更新世界坐标索引
3. **DirtyRegion flush**：收集合并脏区
4. **Paint**：全量或局部重绘
5. **Monitor record**：记录本帧性能数据

优化策略：

- 脏区覆盖率超过阈值自动回退全量重绘
- R-Tree 用于命中测试与区域查询
- 命中路径按真实 hitTest 校验，避免仅 bbox 命中导致误触

---

## 13. 导出 API

### 13.1 核心

- `CyanEngine`
- `RenderNode`
- `PipelineOwner`
- `Monitor`
- `MonitorLevel`

### 13.2 节点类型

**基础节点**：

- `TextNode`
- `ImageNode`
- `RectNode`
- `CircleNode`
- `TriangleNode`
- `ArrowNode`
- `ListenerNode`
- `GestureDetectorNode`

**布局节点**：

- `ColumnNode`
- `RowNode`
- `ContainerNode`
- `PaddingNode`
- `CenterNode`
- `AlignNode`
- `FlexNode`
- `ExpandedNode`
- `SizedBoxNode`
- `AspectRatioNode`
- `StackNode`
- `PositionedNode`
- `WrapNode`
- `SpacerNode`
- `SingleChildScrollViewNode`
- `OffstageNode`
- `TransformNode`
- `ClipRRectNode`
- `OpacityNode`

### 13.3 动画

- `Animation`
- `AnimationController`
- `Tween`
- `Curves`
- `Curve`
- `Interval`
- `CompositeAnimation`
- `useAnimation`
- `useImplicitAnimation`
- `useCompositeAnimation`

### 13.4 事件

- `EventManager`
- `GestureBinding`
- `GestureRecognizer`
- `GestureArena`
- `PointerRouter`
- `HitTestResult`
- `PointerEvent`

### 13.5 后端

- `RenderingBackend`
- `PaintingContext`
- `Canvas2DRenderingBackend`
- `Canvas2DPaintingContext`
- `WebGLRenderingBackend`
- `WebGLPaintingContext`

### 13.6 工具

- `SpatialIndex`
- `RTree`
- `DRManager`

### 13.7 类型

- 常用枚举（MainAxisAlignment、CrossAxisAlignment、BoxFit、FontWeight、TextAlign 等）
- 类型定义（BoxConstraints、Size、Offset、Rect 等）

---

## 14. 项目结构

```
cyan_canvas/
├── src/
│   ├── core/                    # 核心引擎代码
│   │   ├── Engine.ts            # 渲染引擎主类
│   │   ├── RenderNode.ts        # 渲染节点基类
│   │   ├── PipelineOwner.ts     # 渲染管线所有者
│   │   ├── Ticker.ts            # 帧循环管理器
│   │   ├── DRManager.ts         # 脏区管理器
│   │   ├── monitor.ts           # 性能监控
│   │   ├── animation/           # 动画系统
│   │   │   ├── Animation.ts
│   │   │   ├── AnimationController.ts
│   │   │   ├── Tween.ts
│   │   │   ├── Curves.ts
│   │   │   ├── Curve.ts
│   │   │   ├── Interval.ts
│   │   │   ├── CompositeAnimation.ts
│   │   │   ├── CurvedAnimation.ts
│   │   │   ├── useAnimation.ts
│   │   │   ├── useImplicitAnimation.ts
│   │   │   └── useCompositeAnimation.ts
│   │   ├── events/              # 事件系统
│   │   │   ├── index.ts
│   │   │   ├── GestureBinding.ts
│   │   │   ├── GestureRecognizer.ts
│   │   │   ├── GestureArena.ts
│   │   │   ├── PointerRouter.ts
│   │   │   ├── PointerEvent.ts
│   │   │   └── HitTestResult.ts
│   │   ├── spatial/             # 空间索引
│   │   │   ├── SpatialIndex.ts
│   │   │   └── RTree.ts
│   │   ├── backend/            # 渲染后端
│   │   │   ├── RenderingBackend.ts
│   │   │   ├── PaintingContext.ts
│   │   │   ├── Canvas2DRenderingBackend.ts
│   │   │   ├── Canvas2DPaintingContext.ts
│   │   │   └── webgl/
│   │   │       ├── WebGLRenderingBackend.ts
│   │   │       ├── WebGLPaintingContext.ts
│   │   │       ├── ShaderManager.ts
│   │   │       └── MatrixStack.ts
│   │   ├── nodes/              # 渲染节点
│   │   │   ├── base/
│   │   │   │   ├── RenderNode.ts
│   │   │   │   ├── ShapeNode.ts
│   │   │   │   └── SingleChildLayoutNode.ts
│   │   │   ├── RectNode.ts
│   │   │   ├── TextNode.ts
│   │   │   ├── ImageNodes.ts
│   │   │   ├── CircleNode.ts
│   │   │   ├── TriangleNode.ts
│   │   │   ├── ArrowNode.ts
│   │   │   ├── ListenerNode.ts
│   │   │   ├── GestureDetectorNode.ts
│   │   │   └── layout/          # 布局容器
│   │   │       ├── ColumnNode.ts
│   │   │       ├── RowNode.ts
│   │   │       ├── StackNode.ts
│   │   │       ├── PositionedNode.ts
│   │   │       ├── FlexNode.ts
│   │   │       ├── ExpandedNode.ts
│   │   │       ├── WrapNode.ts
│   │   │       ├── CenterNode.ts
│   │   │       ├── PaddingNode.ts
│   │   │       ├── AlignNode.ts
│   │   │       ├── SizedBoxNode.ts
│   │   │       ├── AspectRatioNode.ts
│   │   │       ├── ContainerNode.ts
│   │   │       ├── SingleChildScrollViewNode.ts
│   │   │       ├── SpacerNode.ts
│   │   │       ├── OffstageNode.ts
│   │   │       ├── TransformNode.ts
│   │   │       ├── ClipRRectNode.ts
│   │   │       └── OpacityNode.ts
│   │   ├── types/              # 类型定义
│   │   │   ├── node.ts
│   │   │   ├── container.ts
│   │   │   ├── events.ts
│   │   │   ├── animation.ts
│   │   │   ├── enums.ts
│   │   │   ├── constraints.ts
│   │   │   ├── geometry.ts
│   │   │   ├── decorations.ts
│   │   │   └── base-props.ts
│   │   ├── adaptor/            # React 适配器
│   │   │   └── reconciler/      # React Reconciler 实现
│   │   │       ├── index.ts
│   │   │       ├── hostConfig.ts
│   │   │       ├── nodes.ts
│   │   │       ├── components.ts
│   │   │       └── hooks.ts
│   │   └── utils/              # 工具函数
│   │       └── ConstraintUtils.ts
│   └── test/                   # 测试和演示代码
├── dist/                       # 编译输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 15. 包大小分析

| 文件                | 大小   | 说明           |
| ------------------- | ------ | -------------- |
| cyan-engine.js      | 136 KB | ES Module 格式 |
| cyan-engine.umd.cjs | 97 KB  | UMD 格式       |

与其他 Canvas 库对比：

| 库              | 近似大小   |
| --------------- | ---------- |
| **Cyan Engine** | **~97 KB** |
| Konva.js        | ~120 KB    |
| Pixi.js         | ~300 KB    |
| Fabric.js       | ~200 KB    |

---

## 16. 适用场景

**推荐场景**：

- 可视化工作台 / 图形编辑器
- 画布类 BI 看板
- 大量节点的交互式 UI
- 游戏化中后台组件
- 需要高性能动画的数据可视化

**不建议场景**：

- 以 SEO 为主的页面
- 强依赖浏览器原生表单语义与辅助能力的页面

---

## 17. 本地开发

```bash
# 克隆仓库
git clone https://github.com/your-username/cyan_canvas.git
cd cyan_canvas

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 演示入口

- `src/main.tsx` - 应用入口
- `src/App.tsx` - 主应用组件
- `src/test/LayoutDemo.tsx` - 布局容器演示
- `src/test/ComponentsDemo.tsx` - 组件演示
- `src/test/AnimationDemo.tsx` - 动画演示

---

## 18. 性能最佳实践

1. **避免频繁的状态更新**：将多个相关状态合并为单一状态，减少渲染次数
2. **使用 key 优化列表**：在渲染列表时为每个项指定唯一的 key
3. **合理使用布局嵌套**：避免过深的布局嵌套层次
4. **图片预加载**：对于需要动态加载的图片，提前进行预加载处理
5. **动画优化**：使用 transform 而非修改 x、y 属性进行动画
6. **事件委托**：大量相似元素使用事件委托而非每个元素单独绑定

---

## 19. 许可证

MIT License

---

## 20. 致谢

Cyan Engine 的设计参考了以下优秀项目：

- **Flutter**：优秀的声明式 UI 框架，布局系统设计灵感来源
- **React**：组件化思想和虚拟 DOM 协调算法
- **Pixi.js**：Canvas 渲染性能优化的参考
- **Konva.js**：Canvas 事件系统设计的参考

---

<p align="center">
  <strong>Cyan Engine</strong> · 构建高性能 Canvas 应用
</p>
