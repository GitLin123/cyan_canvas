// main.ts
import { CyanEngine } from './core/Engine';
import { runApp } from './core/adaptor/flutter/runApp';
import { Rect } from './core/adaptor/flutter/basic';

const myCanvas = document.createElement('canvas');
myCanvas.width = 800;
myCanvas.height = 600;
document.body.appendChild(myCanvas);

const engine = new CyanEngine({ canvas: myCanvas });

// 1. 渲染初始布局
const blueRect = new Rect({ width: 100, height: 100, color: 'blue' });
runApp(blueRect, engine);

// 2. 获取渲染树生成的真实 Node
// 这里的 root 实际上就是 blueRect 生成的 RectNode
const rectNode = engine.root!;
let posX = 0;
let dx = 2;

// 3. 启动动画循环
engine.ticker.add((elapsed, delta) => {
  posX += dx;

  // 边界判定
  if (posX + rectNode.width > 400 || posX < 0) {
    dx *= -1;
  }

  // 🚩 直接修改 RenderNode 属性会触发 markNeedsPaint
  rectNode.x = posX;
});

engine.start(); // 启动 Ticker