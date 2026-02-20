import React, { useState, useEffect } from 'react'
import { Rect, Column, Container } from './core/adaptor/reconciler/components'

const App = () => {


  return (
    <Container width={1000} height={800} color="#cc6c6c">
      <Rect x={100} y={100} width={50} height={50} color="#77d14a" />
      <Rect x={200} y={200} width={50} height={50} color="#603dec" />
    </Container>
  )
}
export default App
