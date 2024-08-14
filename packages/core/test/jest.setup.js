import { randomUUID } from 'node:crypto';
import { beforeEach, afterEach, jest } from '@jest/globals';

import {
  getCustomAttributesRegistry,
  getInstancesRegistry,
} from '../src/engine/registries.js';

const customAttributesRegistry = getCustomAttributesRegistry();
const instancesRegistry = getInstancesRegistry();
const attachShadow = HTMLElement.prototype.attachShadow;

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => randomUUID(),
  },
});

beforeEach(() => {
  jest.resetModules();
  document.body.textContent = '';

  customAttributesRegistry.clear();
  instancesRegistry.clear();
});

afterEach(() => {
  customAttributesRegistry.clear();
  instancesRegistry.clear();
  HTMLElement.prototype.attachShadow = attachShadow;
});
