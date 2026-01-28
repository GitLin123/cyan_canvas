import React, { useState } from 'react';
import { Rect, Container } from './core/adaptor/reconciler/components';

// 1. 必须使用大写开头的函数组件名
const App = () => {
  const [x, setX] = useState(0);
  const [color, setColor] = useState('yellow');
  const handleClick = () => {
    setColor('red');
  };
  return (
      <Rect 
      x={x} 
      y={50} 
      width={100} 
      height={100} 
      color={color}
      onClick={handleClick} />
  );
};

export default App;