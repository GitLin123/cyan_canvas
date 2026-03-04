import React, { useState } from 'react';
import { Container, Text, Row, Column, GestureDetector, Rect, Stack, Padding } from './core/adaptor/reconciler/components';
import { useWindowSize } from './core/adaptor/reconciler';
import { FontWeight, TextAlign } from "./core";

const App: React.FC = () => {
  const { width, height } = useWindowSize();

  return (
    <Column width={width} height={height}>
      <Padding padding={16}>
        <Text text="Demo" textAlign={TextAlign.Center} fontSize={22} fontWeight={FontWeight.W600} color="#333" />
      </Padding>
      <Padding padding={16}>
        <Container width={200} height={200} color="#c5c8c8">
          <Column>
            <Text text="Stack布局" textAlign={TextAlign.Center} fontSize={22} fontWeight={FontWeight.W600} color="#333" />

            <Stack>
              <Rect borderRadius={8} width={80} height={80} color="#4df86f" />
              <Rect borderRadius={8} width={60} height={60} color="#4A90D9" />
            </Stack>
          </Column>

        </Container>
      </Padding>
    </Column>
  );
};

export default App;
