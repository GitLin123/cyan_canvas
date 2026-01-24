import React, { useState } from 'react';
import { Rect, Column, Row, Container } from './core/adaptor/reconciler/components';
import { MainAxisAlignment, CrossAxisAlignment } from './core/types/container';

const App = () => {
  const [a, setA] = useState('pink');
  const [b, setB] = useState('green');
  return (
   <Container x={0} y={0} width={800} height={600} color="lightgray">
      <Row
        x={0}
        y={0}
        width={800}
        height={600}
        mainAxisAlignment={MainAxisAlignment.End}
        crossAxisAlignment={CrossAxisAlignment.Stretch}
      >
        <Rect
          width={120}
          height={120}
          color={a}
          onClick={() => setA((c) => (c === 'red' ? 'blue' : 'red'))}
        />

        <Rect
          width={120}
          height={120}
          color={b}
          onClick={() => setB((c) => (c === 'green' ? 'yellow' : 'green'))}
        />
      </Row>
   </Container>
    
  );
};

export default App;