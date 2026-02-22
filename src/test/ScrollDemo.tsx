import React, { useState, useEffect } from 'react';
import { Column, Row, Rect, Text, Container, Padding, Center } from '../core/adaptor/reconciler/components';
import { MainAxisAlignment, TextAlign, FontWeight } from '../core/types/container';

/**
 * 滚动功能演示
 * 展示 Column/Row/Container 在溢出时的滚动支持
 */
const ScrollDemo = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const w = windowSize.width;
  const h = windowSize.height;
  return (
    <Container
      width={w - 32}
      color="#fff"
      padding={16}
      borderRadius={8}
      border={1}
      borderColor="#e0e0e0"
    >
      <Column width={w - 64}>
        <Text
          text="水平滚动 - Row 容器"
          fontSize={18}
          fontWeight={FontWeight.W600}
          color="#333"
        />
        <Text
          text="内容超出宽度限制时，使用滚轮（Shift+滚轮）或←→箭头键滚动"
          fontSize={12}
          color="#666"
          lineHeight={1.5}
        />
      </Column>
    </Container>

  );
};

export default ScrollDemo;
