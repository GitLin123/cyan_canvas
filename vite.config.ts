import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, 'dist'),
    lib: {
      entry: resolve(__dirname, 'src/core/index.ts'), // 指向你的导出入口
      name: 'CyanEngine',
      fileName: 'cyan-engine',
    },
    rollupOptions: {
      // 确保外部化处理那些你不希望打包进库的依赖
      external: ['react', 'react-reconciler'],
      output: {
        globals: {
          react: 'React',
          'react-reconciler': 'ReactReconciler',
        },
      },
    },
  },
});