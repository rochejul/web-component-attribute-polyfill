import { applyPolyfill } from '@web-component-attribute-polyfill/jest-utils';
import { beforeEach, afterEach, jest } from '@jest/globals';

applyPolyfill();

const attachShadow = HTMLElement.prototype.attachShadow;

beforeEach(() => {
  jest.resetModules();
  document.body.textContent = '';
});

afterEach(() => {
  HTMLElement.prototype.attachShadow = attachShadow;
});
