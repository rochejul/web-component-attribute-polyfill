import {
  defineAttribute,
  observeAttributes,
  CustomAttribute,
} from './engine.js';

if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
  const customElements = globalThis.customElements;

  customElements.defineAttribute = defineAttribute;
  globalThis.CustomAttribute = CustomAttribute;

  observeAttributes();
}
