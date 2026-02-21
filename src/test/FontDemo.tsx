import React from 'react';
import { Column, Row, Text, Padding } from '../core/adaptor/reconciler/components';
import { FontWeight, FontStyle, TextAlign } from '../core/types/container';

const fontWeights = [
  FontWeight.W100,
  FontWeight.W300,
  FontWeight.W400,
  FontWeight.W500,
  FontWeight.W700,
  FontWeight.W900,
];

const fontStyles = [FontStyle.Normal, FontStyle.Italic];
const textAligns = [TextAlign.Left, TextAlign.Center, TextAlign.Right];

export default function FontDemo() {
  return (
    <Column width={600} height={800}>
      <Padding padding={20}>
        <Text text="字体 FontWeight 测试" fontSize={24} color="#222" />
      </Padding>
      {fontWeights.map((fw, idx) => (
        <Padding key={fw} padding={8}>
          <Text
            text={`FontWeight: ${fw}`}
            fontSize={20}
            color="#333"
            fontWeight={fw}
          />
        </Padding>
      ))}
      <Padding padding={20}>
        <Text text="字体 FontStyle 测试" fontSize={24} color="#222" />
      </Padding>
      {fontStyles.map((fs, idx) => (
        <Padding key={fs} padding={8}>
          <Text
            text={`FontStyle: ${fs}`}
            fontSize={20}
            color="#333"
            fontStyle={fs}
          />
        </Padding>
      ))}
      <Padding padding={20}>
        <Text text="文本对齐 TextAlign 测试" fontSize={24} color="#222" />
      </Padding>
      {textAligns.map((ta, idx) => (
        <Padding key={ta} padding={8}>
          <Text
            text={`TextAlign: ${ta}`}
            fontSize={20}
            color="#333"
            width={400}
            textAlign={ta}
          />
        </Padding>
      ))}
    </Column>
  );
}
