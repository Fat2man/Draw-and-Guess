import { afterEach, afterAll, beforeAll } from 'vitest';
import { config } from '@vue/test-utils';

// Mock canvas and other browser APIs if needed
beforeAll(() => {
  // Mock HTMLCanvasElement's methods that might be called in your components
  HTMLCanvasElement.prototype.getContext = () => ({
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    clearRect: () => {},
  }) as any;
});

// Reset mocks after each test
afterEach(() => {
  // Clean up anything that might affect other tests
});

// Global teardown
afterAll(() => {
  // Any final cleanup
});

// Configure Vue Test Utils
config.global.components = {};