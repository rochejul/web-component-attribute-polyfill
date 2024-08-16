import { randomUUID } from 'node:crypto';

export function applyPolyfill() {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => randomUUID(),
    },
  });

  if (!Promise.withResolvers) {
    Promise.withResolvers = function withResolvers() {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}
