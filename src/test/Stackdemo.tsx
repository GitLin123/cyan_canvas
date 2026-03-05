import React from "react";
import { Container, Column, Text, Row, Rect, Stack, Padding, Opacity, Transform } from "../core/adaptor/reconciler/components";
import { CrossAxisAlignment, FontWeight, MainAxisAlignment, TextDirection } from "../core/types/enums";
export const Stackdemo = () => {
  const CARD_W = 600;
  return (
    <Padding padding={12}>
      <Container width={CARD_W} height={700} color="#fff" padding={16} borderRadius={10} border={1} borderColor="#e0e0e0">
        <Column width={CARD_W - 32} crossAxisAlignment={CrossAxisAlignment.Center}>
          <Text text="Stack布局" fontSize={20} fontWeight={FontWeight.W700} color="#333" />
          <Padding padding={8} />
          <Row mainAxisAlignment={MainAxisAlignment.Center}>
            <Stack height={200}>
              <Rect borderRadius={8} width={100} height={100} color="#FF6B6B" />
              <Rect borderRadius={8} width={80} height={80} color="#667eea" />
              <Rect borderRadius={8} width={60} height={60} color="#4ECDC4" />
            </Stack>
          </Row>
          <Text text="Opacity" fontSize={20} fontWeight={FontWeight.W700} color="#333" />
          <Padding padding={8} />
          <Row mainAxisAlignment={MainAxisAlignment.Center}>
            <Opacity opacity={0.3}>
              <Stack height={200} textDirection={TextDirection.Rtl}>
                <Rect borderRadius={8} width={100} height={100} color="#FF6B6B" />
                <Rect borderRadius={8} width={80} height={80} color="#667eea" />
                <Rect borderRadius={8} width={60} height={60} color="#4ECDC4" />
              </Stack>
            </Opacity>
          </Row>
          <Text text="Transform变换" fontSize={20} fontWeight={FontWeight.W700} color="#333" />
          <Padding padding={8} />
          <Row mainAxisAlignment={MainAxisAlignment.Center}>
            <Transform
            >
              <Stack height={200} textDirection={TextDirection.Rtl}>
                <Rect borderRadius={8} width={100} height={100} color="#FF6B6B" />
                <Rect borderRadius={8} width={80} height={80} color="#667eea" />
                <Rect borderRadius={8} width={60} height={60} color="#4ECDC4" />
              </Stack>
            </Transform>
          </Row>
        </Column>
      </Container>
    </Padding>
  )
}