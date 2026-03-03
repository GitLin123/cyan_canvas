import React from 'react'
import {
  SizedBox, Container, Row, Column, Text, Center,
  GestureDetector, Expanded,
} from './components'
import { CrossAxisAlignment, FontWeight } from '../../types/enums'

// ========== Gap ==========
export interface GapProps {
  size: number
}

export const Gap: React.FC<GapProps> = ({ size }) => (
  <SizedBox width={size} height={size} />
)

// ========== Card ==========
export interface CardProps {
  width?: number
  padding?: number
  borderRadius?: number
  color?: string
  borderColor?: string
  border?: number
  children?: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  width,
  padding = 16,
  borderRadius = 10,
  color = '#fff',
  borderColor = '#e0e0e0',
  border = 1,
  children,
}) => (
  <Container
    width={width}
    color={color}
    padding={padding}
    borderRadius={borderRadius}
    border={border}
    borderColor={borderColor}
  >
    {children}
  </Container>
)

// ========== ListTile ==========
export interface ListTileProps {
  leading?: React.ReactNode
  title: string
  subtitle?: string
  trailing?: React.ReactNode
  titleFontSize?: number
  subtitleFontSize?: number
  titleColor?: string
  subtitleColor?: string
  height?: number
  width?: number
}

export const ListTile: React.FC<ListTileProps> = ({
  leading,
  title,
  subtitle,
  trailing,
  titleFontSize = 15,
  subtitleFontSize = 12,
  titleColor = '#333',
  subtitleColor = '#999',
  height = 56,
  width,
}) => (
  <Row height={height} width={width} crossAxisAlignment={CrossAxisAlignment.Center}>
    {leading}
    {leading && <SizedBox width={12} height={1} />}
    <Expanded>
      <Column>
        <Text text={title} fontSize={titleFontSize} color={titleColor} />
        {subtitle && (
          <>
            <SizedBox width={1} height={4} />
            <Text text={subtitle} fontSize={subtitleFontSize} color={subtitleColor} />
          </>
        )}
      </Column>
    </Expanded>
    {trailing && <SizedBox width={12} height={1} />}
    {trailing}
  </Row>
)

// ========== TextButton ==========
export interface TextButtonProps {
  text: string
  onTap: () => void
  color?: string
  textColor?: string
  fontSize?: number
  fontWeight?: FontWeight
  width?: number
  height?: number
  borderRadius?: number
}

export const TextButton: React.FC<TextButtonProps> = ({
  text,
  onTap,
  color = '#667eea',
  textColor = '#fff',
  fontSize = 14,
  fontWeight,
  width = 120,
  height = 40,
  borderRadius = 20,
}) => (
  <GestureDetector onTap={onTap}>
    <Container width={width} height={height} color={color} borderRadius={borderRadius}>
      <Center>
        <Text text={text} fontSize={fontSize} color={textColor} fontWeight={fontWeight} />
      </Center>
    </Container>
  </GestureDetector>
)
