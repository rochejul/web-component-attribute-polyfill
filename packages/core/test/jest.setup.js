import { randomUUID } from 'node:crypto';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => randomUUID(),
  },
});
