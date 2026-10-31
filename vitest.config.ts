import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts', 'factory/**/*.test.ts'],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
