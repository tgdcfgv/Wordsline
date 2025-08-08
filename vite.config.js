import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';

export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: 'scripts/main.js', // 主进程文件
    }),
  ],
  build: {
    outDir: 'dist', // 将输出目录修改为 dist
  },
  base: './', // 确保打包后资源路径正确
  
  // 配置 Vite 以处理 .js 文件中的 JSX 语法
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  server: {
    proxy: {
      '/api/dictionary': {
        target: 'https://api.dictionaryapi.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dictionary/, '/api')
      }
    },
    // 开发环境无需CSP头部，避免connect-src限制
  }
});
