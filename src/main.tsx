import React from 'react';
import App from './App';
import { CyanEngine } from './core/Engine';
import { CyanRenderer } from './core/adaptor/reconciler';

const engine = (window as any).__CYAN_ENGINE__ || new CyanEngine({
  containerId: 'root',
  width: window.innerWidth,
  height: window.innerHeight,
});
(window as any).__CYAN_ENGINE__ = engine;

CyanRenderer.render(<App />, engine);