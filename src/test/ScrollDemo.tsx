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
    <Column width={w} height={h}>
      {/* 标题 */}
      <Padding padding={16}>
        <Column width={w - 32}>
          <Text
            text="🎯 滚动功能演示"
            fontSize={28}
            color="#1a1a1a"
            fontWeight={FontWeight.W700}
            textAlign={TextAlign.Center}
          />
          <Text
            text="使用鼠标滚轮或键盘箭头键来滚动内容"
            fontSize={14}
            color="#888"
            textAlign={TextAlign.Center}
            lineHeight={1.5}
          />
        </Column>
      </Padding>

      {/* 竖直滚动演示 - Column */}
      <Padding padding={16}>
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
              text="竖直滚动 - Column 容器"
              fontSize={18}
              fontWeight={FontWeight.W600}
              color="#333"
            />
            <Text
              text="内容超出高度限制时，使用滚轮或↑↓箭头键滚动"
              fontSize={12}
              color="#666"
              lineHeight={1.5}
            />
          </Column>
        </Container>
      </Padding>

      {/* Column 滚动容器 - 固定高度，内容超出 */}
      <Padding padding={16}>
        <Container
          width={w - 32}
          height={300}
          color="#f5f5f5"
          border={2}
          borderColor="#4ECDC4"
          borderRadius={8}
          padding={12}
        >
          <Column width={w - 80} height={276}>
            {/* 生成大量内容 */}
            {Array.from({ length: 15 }).map((_, i) => (
              <Padding key={`col-item-${i}`} padding={4}>
                <Row width={w - 100} mainAxisAlignment={MainAxisAlignment.Start}>
                  <Container
                    width={40}
                    height={40}
                    color={`hsl(${(i * 24) % 360}, 70%, 60%)`}
                    borderRadius={4}
                  />
                  <Padding padding={8}>
                    <Center width={200} height={40}>
                      <Text
                        text={`Item ${i + 1} - 向下滚动查看更多内容...`}
                        fontSize={12}
                        color="#333"
                      />
                    </Center>
                  </Padding>
                </Row>
              </Padding>
            ))}
          </Column>
        </Container>
      </Padding>

      {/* 水平滚动演示 - Row */}
      <Padding padding={16}>
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
      </Padding>

      {/* Row 滚动容器 - 固定宽度，内容超出 */}
      <Padding padding={16}>
        <Container
          width={w - 32}
          height={120}
          color="#f5f5f5"
          border={2}
          borderColor="#FF6B6B"
          borderRadius={8}
          padding={12}
        >
          <Row width={w - 80} height={96}>
            {/* 生成大量内容 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <Padding key={`row-item-${i}`} padding={4}>
                <Container
                  width={100}
                  height={88}
                  color={`hsl(${(i * 30) % 360}, 80%, 65%)`}
                  borderRadius={8}
                />
              </Padding>
            ))}
          </Row>
        </Container>
      </Padding>

      {/* 提示信息 */}
      <Padding padding={16}>
        <Container
          width={w - 32}
          color="#fff8e1"
          padding={16}
          borderRadius={8}
          border={1}
          borderColor="#ffd54f"
        >
          <Column width={w - 64}>
            <Text
              text="💡 使用提示"
              fontSize={14}
              fontWeight={FontWeight.W600}
              color="#f57f17"
            />
            <Text
              text="• 鼠标滚轮：上下滚动内容"
              fontSize={12}
              color="#666"
              lineHeight={1.6}
            />
            <Text
              text="• Shift+滚轮：左右滚动内容（某些浏览器）"
              fontSize={12}
              color="#666"
              lineHeight={1.6}
            />
            <Text
              text="• 方向键（↑↓←→）：精确控制滚动"
              fontSize={12}
              color="#666"
              lineHeight={1.6}
            />
            <Text
              text="• 空格键：快速向下滚动"
              fontSize={12}
              color="#666"
              lineHeight={1.6}
            />
          </Column>
        </Container>
      </Padding>

      {/* 底部空间 */}
      <Padding padding={16}>
        <Text
          text="✅ 滚动功能演示完成"
          fontSize={14}
          textAlign={TextAlign.Center}
          color="#4ECDC4"
        />
      </Padding>
    </Column>
  );
};

export default ScrollDemo;
