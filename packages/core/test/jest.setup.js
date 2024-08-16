import { applyPolyfill } from '@web-component-attribute-polyfill/jest-utils';
import { beforeEach, afterEach, jest } from '@jest/globals';

import {
  getCustomAttributesRegistry,
  getInstancesRegistry,
} from '../src/engine/registries.js';

applyPolyfill();

const customAttributesRegistry = getCustomAttributesRegistry();
const instancesRegistry = getInstancesRegistry();
const attachShadow = HTMLElement.prototype.attachShadow;

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
