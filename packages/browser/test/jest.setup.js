import { randomUUID } from 'node:crypto';
import { beforeEach, afterEach, jest } from '@jest/globals';

const attachShadow = HTMLElement.prototype.attachShadow;

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => randomUUID(),
  },
});

beforeEach(() => {
  jest.resetModules();
  document.body.textContent = '';
});

afterEach(() => {
  HTMLElement.prototype.attachShadow = attachShadow;
});
