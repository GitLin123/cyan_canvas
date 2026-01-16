import React, { useEffect, useRef } from 'react';
import { CyanEngine } from './core/Engine';
import { RectNode } from './core/nodes/RectNode';
import { CrossAxisAlignment, MainAxisAlignment } from './core/types/container';
import { ColumnNode } from './core/nodes/ColumnNode';

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new CyanEngine({ canvas: canvasRef.current });


    const row = new ColumnNode();
    row.crossAxisAlignment = CrossAxisAlignment.Center;
    row.mainAxisAlignment = MainAxisAlignment.Center;
    engine.root = row;

    const icon = new RectNode('blue', 40, 40); // 固定宽度
    icon.flex = 0;
    const searchBar = new RectNode('green', 10, 60); 


    const button = new RectNode('red', 80, 40); // 固定宽度

    row.add(icon);
    row.add(searchBar);
    row.add(button);

    
    // 启动引擎
    engine.markNeedsPaint();
    engine.start();

    return () => engine.stop();
  }, []);

  return <canvas ref={canvasRef} style={{ width: '800px', height: '600px', background: '#000' }} />;
};
export default App;