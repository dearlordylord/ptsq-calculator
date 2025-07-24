import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.scrollY for scroll tests
Object.defineProperty(window, 'scrollY', {
  value: 0,
  writable: true,
});

// Mock window.addEventListener for scroll events
const originalAddEventListener = window.addEventListener;
window.addEventListener = vi.fn((event: string, handler: any) => {
  if (event === 'scroll') {
    // Store the handler for manual triggering in tests
    (window as any).__scrollHandler = handler;
  }
  return originalAddEventListener.call(window, event, handler);
});

// Mock window.removeEventListener
window.removeEventListener = vi.fn();