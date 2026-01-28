import React, { useState } from 'react';
import { Rect, Column, Container, Text } from './core/adaptor/reconciler/components';

const App = () => {
  const [size, setSize] = useState(20);

  return (
    <Container
      padding={20}
      color='pink'
    >
      <Column>
        <Rect width={100} height={100} color="blue" />
        <Text text="Hello Cyan!" color="black" 
        fontSize={size} onMouseEnter={() => setSize(40)}
        onMouseLeave={()=> setSize(20)}/>
      </Column>
    </Container>
  );
};
export default App;