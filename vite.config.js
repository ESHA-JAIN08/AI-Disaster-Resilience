import { defineConfig } from 'vite'

export default defineConfig({
  base: '/AI-Disaster-Resilience/',
  // No plugin needed - vite 8 handles JSX natively
  esbuild: {
    jsx: 'automatic',
  },
})
