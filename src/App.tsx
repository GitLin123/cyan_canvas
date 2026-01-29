import React, { useState } from 'react';
import { Image, Column, Container, Text } from './core/adaptor/reconciler/components';

const App = () => {
  const [text, setText] = useState('11111111111');

  return (
    <Column>
      <Text text="文章封面图" fontSize={18} />
      <Image
        src="https://youke.xn--y7xa690gmna.cn/s1/2026/01/29/697aca5c27408.webp"
        height={200}
        width={200}
        onClick={() => setText('图片被点击')}
      />
      <Text text={text} color="#666" />
    </Column>
  );
};
export default App;