## 这是一个实验的 CyanCanvas库的测试项目
# 正在逐步开发CyanCanvas库中...
第一阶段：核心基础设施 (基础设施与底层绘制)
	目标：建立最基础的 RenderObject 和 Canvas 渲染循环。
	• [√] 初始化项目环境：配置 TS + Vite + Vitest（测试框架），搭建 TSX 编译环境。
	• [√] 建立渲染循环 (Ticker)：实现基于 requestAnimationFrame 的调度器，管理帧率。
	• [] 抽象基础节点 RenderNode：
		○ 定义 paint(ctx) 方法。
		○ 实现基础的属性系统（Transform, Alpha, Color）。
	• [ ] 构建双缓冲系统：确保所有绘制指令先在离屏 Canvas 或缓冲中准备好，再统一上屏，防止闪烁。
	
第二阶段：布局引擎 (核心大脑)
	目标：实现像 Flutter 一样的自动布局，摆脱绝对坐标。
	• [ ] 实现约束系统 (BoxConstraints)：编写 min/max 宽高的传递逻辑。
	• [ ] 布局算法开发：
		○ 实现 performLayout：递归计算子节点大小。
		○ 开发首个布局组件：Flex (Row/Column)。
	• [ ] 坐标空间转换：实现全局坐标与局部坐标的转换工具函数（处理嵌套缩放与旋转）。
	
第三阶段：声明式 API 层 (开发者体验)
	目标：让开发者能用 JSX 和 Hooks 写代码。
	• [ ] VNode 结构定义：设计轻量级的虚拟节点对象。
	• [ ] 实现协调器 (Reconciler)：
		○ 编写 Diff 算法：对比新旧 VNode 树。
		○ 映射机制：将 VNode 转换为持久化的 RenderNode。
	• [ ] 状态 Hooks 实现：构建简单的 useState 和 useEffect。
	
第四阶段：交互与性能优化 (引擎深度)
	目标：让引擎具备高性能和复杂的交互能力。
	• [ ] 点击测试 (Hit Testing)：
		○ 实现 R-Tree 空间索引，提升海量元素下的查询效率。
		○ 编写 isPointInPath 判定逻辑。
	• [ ] 重绘边界 (Repaint Boundary)：实现局部 Layer 缓存（位图化）。
	• [ ] 脏矩形管理 (Dirty Rect)：
		○ 建立脏区域收集机制。
		○ 实现 ctx.clip() 局部重绘逻辑，优化 CPU 占用。
		
第五阶段：工程化与生态
	目标：使其成为一个可用的库。
	• [ ] 内置组件库：Rect, Image, Text, ScrollView。
	• [ ] 文档与 Demo：编写类似 Figma 基础功能的示例。

