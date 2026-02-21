import React from 'react'
import { Column, Row, Rect, Text, Padding } from '../core/adaptor/reconciler/components'
import { MainAxisAlignment } from '../core/types/container'

/**
 * MainAxisAlignment 完整演示
 * 展示 Column 和 Row 的所有 6 种对齐方式
 */
const AlignmentDemo = () => {
  const alignments = [
    { name: 'Start', value: MainAxisAlignment.Start },
    { name: 'Center', value: MainAxisAlignment.Center },
    { name: 'End', value: MainAxisAlignment.End },
    { name: 'SpaceBetween', value: MainAxisAlignment.SpaceBetween },
    { name: 'SpaceAround', value: MainAxisAlignment.SpaceAround },
    { name: 'SpaceEvenly', value: MainAxisAlignment.SpaceEvenly },
  ]

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']

  return (
    <Column>
      {/* Title */}
      <Padding padding={20}>
        <Column width={window.innerWidth - 40}>
          <Text text="MainAxisAlignment 完整演示" fontSize={28} color="#000" />
          <Text text="6 种对齐方式测试" fontSize={14} color="#666" />
        </Column>
      </Padding>

      {/* Column 对齐演示 */}
      <Padding padding={20}>
        <Column width={window.innerWidth - 40}>
          <Text text="Column 对齐方式（纵向）" fontSize={16} color="#333" />

          {alignments.map((align, idx) => (
            <Padding key={`col-${idx}`} padding={10}>
              <Column width={window.innerWidth - 60}>
                <Text text={align.name} fontSize={12} color="#666" />
                <Column width={300} height={150} mainAxisAlignment={align.value}>
                  {colors.map((color, i) => (
                    <Rect key={`col-rect-${i}`} width={50} height={40} color={color} />
                  ))}
                </Column>
              </Column>
            </Padding>
          ))}
        </Column>
      </Padding>

      {/* Row 对齐演示 */}
      <Padding padding={20}>
        <Column width={window.innerWidth - 40}>
          <Text text="Row 对齐方式（横向）" fontSize={16} color="#333" />

          {alignments.map((align, idx) => (
            <Padding key={`row-${idx}`} padding={10}>
              <Column width={window.innerWidth - 60}>
                <Text text={align.name} fontSize={12} color="#666" />
                <Row width={300} height={80} mainAxisAlignment={align.value}>
                  {colors.map((color, i) => (
                    <Rect key={`row-rect-${i}`} width={40} height={50} color={color} />
                  ))}
                </Row>
              </Column>
            </Padding>
          ))}
        </Column>
      </Padding>

      {/* 说明文档 */}
      <Padding padding={20}>
        <Column width={window.innerWidth - 40}>
          <Text text="对齐方式说明" fontSize={14} color="#333" />
          <Text text="• Start: 子项靠向开头" fontSize={12} color="#666" />
          <Text text="• Center: 子项居中对齐" fontSize={12} color="#666" />
          <Text text="• End: 子项靠向结尾" fontSize={12} color="#666" />
          <Text text="• SpaceBetween: 两端对齐，子项间均匀分布" fontSize={12} color="#666" />
          <Text text="• SpaceAround: 子项周围均等空间（边缘是中间的一半）" fontSize={12} color="#666" />
          <Text text="• SpaceEvenly: 全部均等空间（包括边缘）" fontSize={12} color="#666" />
        </Column>
      </Padding>
    </Column>
  )
}

export default AlignmentDemo
