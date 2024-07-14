import { randomUUID } from 'node:crypto';
import { beforeEach, afterEach } from '@jest/globals';

import {
  getCustomAttributesRegistry,
  getInstancesRegistry,
} from '../src/engine/registries.js';

const customAttributesRegistry = getCustomAttributesRegistry();
const instancesRegistry = getInstancesRegistry();

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => randomUUID(),
  },
});

beforeEach(() => {
  document.body.textContent = '';

  customAttributesRegistry.clear();
  instancesRegistry.clear();
});

afterEach(() => {
  customAttributesRegistry.clear();
  instancesRegistry.clear();
});
