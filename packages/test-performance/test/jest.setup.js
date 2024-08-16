import { applyPolyfill } from '@web-component-attribute-polyfill/jest-utils';
import { beforeEach, jest } from '@jest/globals';

applyPolyfill();

beforeEach(() => {
  jest.resetModules();
  document.body.textContent = '';
});
