// Test.ts
import { CyanEngine } from '../core/Engine';
import { RectNode } from '../core/nodes/RectNode'; // 假设你已实现的矩形节点

export function runStressTest(canvas: HTMLCanvasElement) {
  const engine = new CyanEngine({ canvas });
  
  const nodes: RectNode[] = [];
  const sceneWidth = canvas.width / (window.devicePixelRatio || 1);
  const sceneHeight = canvas.height / (window.devicePixelRatio || 1);

  for (let i = 0; i < 100; i++) {
    const rect = new RectNode(
      `hsl(${Math.random() * 360}, 50%, 50%)`, // 随机颜色
      20, 20
    );
    rect.x = Math.random() * (sceneWidth - 20);
    rect.y = Math.random() * (sceneHeight - 20);
    
    // 模拟交互：点击任何一个矩形都会变色
    rect.onClick = () => {
      rect.color = 'white'; 
      console.log('触发局部更新');
    };

    nodes.push(rect);
  }

  // 假设你的 Engine.ts 支持设置一个包含多个子节点的根节点
  // 如果没有 Container，可以先手动把它们加到一个 RootNode 里
  const root = nodes[0]; // 简化示例，实际建议用 ContainerNode
  nodes.slice(1).forEach(n => root.add(n)); 

  engine.root = root;
  engine.start();

  // 2. 自动化压力测试：每隔 100ms 随机改变一个节点的颜色
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * nodes.length);
    const target = nodes[randomIndex];
    
    // 改变颜色会触发 markNeedsPaint
    target.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
  }, 100);
}