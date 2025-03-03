import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['node_modules/**', 'dist/**', '**/*.d.ts'],
      enabled: true,
      clean: true,
      cleanOnRerun: true
    },
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});