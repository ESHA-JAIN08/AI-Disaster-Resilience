import { defineConfig } from 'vite'

export default defineConfig({
  // No plugin needed — vite 8 handles JSX natively
  esbuild: {
    jsx: 'automatic',
  },
})
