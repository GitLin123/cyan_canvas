# 🟦 Cyan Engine

**Cyan** 是一个高性能、声明式的 Canvas UI 渲染引擎，由 React 驱动。它允许开发者使用熟悉的 React JSX 语法来构建高性能的 Canvas 应用，并提供了一套完整的布局和交互系统。Cyan Engine 专为需要复杂 UI 交互但又不希望引入 DOM 开销的应用场景而设计。

## 🌟 特性

Cyan Engine 提供了丰富的特性，帮助开发者构建现代化的 Canvas 应用：

- **React 驱动**：完整的声明式 UI 开发体验，利用 React 的组件化思想和状态管理机制
- **高性能渲染**：内置双缓冲机制与智能脏检查优化，确保流畅的帧率表现
- **约束布局**：仿 Flutter 的 BoxConstraints 布局模型，支持 Flex 容器（Column、Row、Wrap）、堆叠布局（Stack）以及绝对定位
- **完整事件链路**：支持点击、悬停、滚动、拖拽及右键菜单等丰富交互事件
- **动画系统**：提供 AnimationController、Tween、Curves 等完整的动画支持
- **轻量化**：摆脱沉重的 DOM 树，直接操作 Canvas 像素，适合对性能有严格要求的场景
- **高 DPI 支持**：自动适配 Retina 等高分辨率屏幕，确保文字和图形清晰锐利
- **响应式设计**：支持窗口大小自适应，灵活应对不同设备屏幕

## 🛠️ 技术架构

Cyan Engine 的架构设计参考了现代前端框架的最佳实践，采用分层架构实现关注点分离：

### 核心层架构

```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
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
│  │  Ticker │  │ Layout  │  │  Paint  │  │ Events  │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘ │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Canvas 2D API                          │
└─────────────────────────────────────────────────────────┘
```

### 核心模块说明

| 模块 | 职责 | 关键文件 |
|------|------|----------|
| **Engine** | 渲染管线调度、帧循环管理、脏检查、离屏渲染 | `Engine.ts` |
| **Ticker** | 基于 requestAnimationFrame 的帧循环，FPS 统计 | `ticker.ts` |
| **RenderNode** | 渲染节点基类，布局计算，绘制逻辑 | `RenderNode.ts` |
| **Events** | 事件委托、坐标转换、碰撞检测 | `events/index.ts` |
| **Animation** | 动画控制器、补间动画、缓动曲线 | `animation/` |
| **Reconciler** | 连接 React Fiber 与 Cyan 渲染树 | `adaptor/reconciler/` |

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- React >= 18.0.0
- react-reconciler >= 0.29.0
- TypeScript >= 5.0

### 安装

```bash
npm install @jianlinzhou/cyan_engine
# 或
yarn add @jianlinzhou/cyan_engine
```

### 基础用法

以下示例展示了如何使用 Cyan Engine 构建一个简单的交互式界面：

```tsx
import React, { useState } from 'react';
import { runApp } from './core/adaptor/flutter/runApp';
import { Container, Column, Row, Rect, Text, Circle, Padding } from './core/adaptor/reconciler/components';

const App = () => {
  const [counter, setCounter] = useState(0);
  const [hovered, setHovered] = useState(false);

  return (
    <Container width={800} height={600} color="#f5f5f5">
      <Column mainAxisAlignment="center" crossAxisAlignment="center">
        <Padding padding={40}>
          <Column alignment="center">
            <Text 
              text={`计数器: ${counter}`} 
              fontSize={32} 
              color="#333"
              fontWeight="bold"
            />
            <Padding padding={20}>
              <Rect 
                width={200} 
                height={100} 
                color={hovered ? "#4CAF50" : "#2196F3"}
                borderRadius={12}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={() => setCounter(c => c + 1)}
              >
                <Text 
                  text="点击增加" 
                  fontSize={18} 
                  color="#fff"
                />
              </Rect>
            </Padding>
            <Row>
              <Circle 
                radius={30} 
                color="#FF9800" 
                margin={10}
              />
              <Circle 
                radius={30} 
                color="#9C27B0" 
                margin={10}
              />
              <Circle 
                radius={30} 
                color="#00BCD4" 
                margin={10}
              />
            </Row>
          </Column>
        </Padding>
      </Column>
    </Container>
  );
};

// 启动应用
runApp(<App />);
```

### 事件处理

Cyan Engine 提供了完善的事件系统，支持鼠标和键盘交互：

```tsx
<Rect
  width={200}
  height={100}
  color="blue"
  onClick={(e) => console.log('点击了矩形', e.clientX, e.clientY)}
  onMouseEnter={(e) => console.log('鼠标进入')}
  onMouseLeave={(e) => console.log('鼠标离开')}
  onMouseMove={(e) => console.log('鼠标移动', e.clientX, e.clientY)}
  onMouseDown={(e) => console.log('鼠标按下')}
  onMouseUp={(e) => console.log('鼠标释放')}
  onContextMenu={(e) => console.log('右键菜单')}
  onWheel={(e) => console.log('滚轮滚动', e.deltaY)}
/>
```

### 动画效果

利用内置的动画系统创建流畅的交互体验：

```tsx
import { useAnimation } from './core/animation/useAnimation';

const AnimatedBox = () => {
  const animation = useAnimation({
    duration: 300,
    curve: 'easeInOut',
  });

  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
    if (!expanded) {
      animation.forward();
    }else {
      animation.reverse();
    }
  };

  return (
    <Rect
      width={animation.value * 200 + 50}
      height={100}
      color="orange"
      onClick={handleClick}
    />
  );
};
```

## 📐 布局系统

### 约束布局（BoxConstraints）

Cyan Engine 采用类似 Flutter 的约束布局模型，每个节点都受到父节点传递的约束限制：

```typescript
interface BoxConstraints {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
```

### 布局容器

| 组件 | 说明 | 关键属性 |
|------|------|----------|
| **Column** | 垂直布局容器 | `mainAxisAlignment`, `crossAxisAlignment`, `spacing` |
| **Row** | 水平布局容器 | `mainAxisAlignment`, `crossAxisAlignment`, `spacing` |
| **Stack** | 堆叠布局，后进先出 | `alignment` |
| **Wrap** | 自动换行布局 | `spacing`, `runSpacing`, `alignment` |
| **Flex** |弹性布局基础组件 | `direction`, `flex`, `mainAxisAlignment` |
| **Center** | 居中布局 | - |
| **Padding** | 内边距 | `padding` |
| **Align** | 对齐定位 | `alignment` |
| **SizedBox** | 固定尺寸 | `width`, `height` |
| **AspectRatio** | 宽高比限制 | `aspectRatio` |

### 对齐方式

```tsx
// 主轴对齐 (mainAxisAlignment)
<Row mainAxisAlignment="start">    /* 开始对齐 */
<Row mainAxisAlignment="center">   /* 居中 */
<Row mainAxisAlignment="end">      /* 结束对齐 */
<Row mainAxisAlignment="spaceBetween"> /* 两端对齐 */
<Row mainAxisAlignment="spaceAround">  /* 等间距 */
<Row mainAxisAlignment="spaceEvenly">  /* 完全等间距 */

// 交叉轴对齐 (crossAxisAlignment)
<Column crossAxisAlignment="start">   /* 开始对齐 */
<Column crossAxisAlignment="center">  /* 居中 */
<Column crossAxisAlignment="end">     /* 结束对齐 */
<Column crossAxisAlignment="stretch"> /* 拉伸填满 */
```

## 📦 组件库

### 基础图形

| 组件 | 说明 |
|------|------|
| **Rect** | 矩形，支持圆角和颜色 |
| **Circle** | 圆形 |
| **Triangle** | 三角形 |
| **Arrow** | 箭头 |
| **Text** | 文本渲染 |
| **Image** | 图片加载与显示 |

### 容器组件

| 组件 | 说明 |
|------|------|
| **Container** | 通用容器，支持背景、边框、圆角等 |
| **SingleChildScrollView** | 单子元素滚动容器 |

## 🎨 样式属性

### 通用样式

```tsx
<Rect
  width={200}
  height={100}
  x={50}
  y={100}
  color="#FF5722"
  alpha={0.8}
  borderRadius={8}
  border={{ width: 2, color: '#333' }}
  visible={true}
/>
```

### 文本样式

```tsx
<Text
  text="Hello Cyan"
  fontSize={24}
  fontFamily="Arial, sans-serif"
  fontWeight="bold"
  color="#333"
  textAlign="center"
/>
```

## ⚡ 性能优化

### 性能监控

Cyan Engine 内置了性能监控面板，可以实时查看关键指标：

```typescript
const engine = new CyanEngine({
  canvas: myCanvas,
  // 启用性能面板（默认开启）
});

// 性能面板显示内容
// - FPS: 当前帧率
// - Layout: 布局计算耗时
// - Paint: 绘制耗时
// - DirtyRects: 脏矩形数量
// - Resolution: 画布分辨率
```

### 性能最佳实践

为了获得最佳性能，建议遵循以下实践：

1. **避免频繁的状态更新**：将多个相关状态合并为单一状态，减少渲染次数
2. **使用 key 优化列表**：在渲染列表时为每个项指定唯一的 key
3. **合理使用布局嵌套**：避免过深的布局嵌套层次
4. **图片预加载**：对于需要动态加载的图片，提前进行预加载处理
5. **动画优化**：使用 transform 而非修改 x、y 属性进行动画
6. **事件委托**：大量相似元素使用事件委托而非每个元素单独绑定

### 脏检查策略

引擎采用智能的脏检查机制来决定是否需要重新渲染：

- 当 UI 状态发生变化时，通过 `markNeedsPaint()` 标记需要重绘
- 引擎级别的 `_isDirty` 标志控制是否执行完整的渲染管线
- 对于复杂场景，可以考虑引入局部脏矩形检查来优化性能

## 🔧 进阶用法

### 自定义渲染节点

通过继承 RenderNode 创建自定义渲染组件：

```typescript
import { RenderNode } from '../core/RenderNode';
import { BoxConstraints, Size } from '../core/types/container';

class CustomShapeNode extends RenderNode {
  private _shapeType: 'star' | 'heart' = 'star';

  performLayout(constraints: BoxConstraints): Size {
    const width = Math.min(constraints.maxWidth, this._preferredWidth ?? 100);
    const height = Math.min(constraints.maxHeight, this._preferredHeight ?? 100);
    return { width, height };
  }

  paintSelf(ctx: CanvasRenderingContext2D): void {
    // 自定义绘制逻辑
    ctx.fillStyle = '#FF5722';
    // 绘制星形或其他形状
  }
}
```

### 与现有 React 生态集成

Cyan Engine 可以与现有的 React 生态系统无缝集成：

```tsx
import { useRef, useEffect } from 'react';
import { CyanEngine } from '@jianlinzhou/cyan_engine';

const CanvasApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<CyanEngine | null>(null);

  useEffect(() => {
    if (canvasRef.current && !engineRef.current) {
      engineRef.current = new CyanEngine({
        canvas: canvasRef.current,
      });
      engineRef.current.start();
    }

    return () => {
      engineRef.current?.stop();
    };
  }, []);

  return <canvas ref={canvasRef} />;
};
```

## 📁 项目结构

```
cyan_canvas/
├── src/
│   ├── core/                    # 核心引擎代码
│   │   ├── Engine.ts            # 渲染引擎主类
│   │   ├── RenderNode.ts        # 渲染节点基类
│   │   ├── ticker.ts            # 帧循环管理器
│   │   ├── monitor.ts           # 性能监控
│   │   ├── animation/           # 动画系统
│   │   │   ├── Animation.ts
│   │   │   ├── AnimationController.ts
│   │   │   ├── Tween.ts
│   │   │   ├── Curves.ts
│   │   │   └── useAnimation.ts
│   │   ├── events/              # 事件系统
│   │   │   ├── index.ts
│   │   │   └── ScrollEventManager.ts
│   │   ├── nodes/               # 内置渲染节点
│   │   │   ├── RectNode.ts
│   │   │   ├── TextNode.ts
│   │   │   ├── ImageNodes.ts
│   │   │   ├── CircleNode.ts
│   │   │   └── layout/          # 布局容器
│   │   │       ├── ColumnNode.ts
│   │   │       ├── RowNode.ts
│   │   │       ├── StackNode.ts
│   │   │       ├── FlexNode.ts
│   │   │       └── ...
│   │   ├── types/               # TypeScript 类型定义
│   │   │   ├── node.ts
│   │   │   ├── container.ts
│   │   │   └── events.ts
│   │   └── adaptor/             # React 适配器
│   │       ├── reconciler/      # React Reconciler 实现
│   │       └── flutter/         # Flutter 风格 API
│   └── test/                    # 测试代码
├── dist/                        # 编译输出
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🤝 贡献指南

欢迎为 Cyan Engine 贡献代码！请遵循以下步骤：

1. **Fork** 本仓库
2. 创建您的特性分支：`git checkout -b feature/amazing-feature`
3. 提交您的更改：`git commit -m 'Add some amazing feature'`
4. 推送分支：`git push origin feature/amazing-feature`
5. 开启 **Pull Request**

### 开发环境设置

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

# 运行测试
npm test
```

## 📄 许可证

本项目基于 MIT 许可证开源，详情请查看 LICENSE 文件。

## 🙏 致谢

Cyan Engine 的设计参考了以下优秀项目：

- **Flutter**：优秀的声明式 UI 框架，布局系统设计灵感来源
- **React**：组件化思想和虚拟 DOM 协调算法
- **Pixi.js**：Canvas 渲染性能优化的参考
- **Konva.js**：Canvas 事件系统设计的参考

---

<p align="center">
  <strong>Cyan Engine</strong> · 构建高性能 Canvas 应用
</p>
