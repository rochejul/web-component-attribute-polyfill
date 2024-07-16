import {
  defineAttribute,
  observeAttributes,
  CustomAttribute,
} from '@web-component-attribute-polyfill/core';

if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
  const customElements = globalThis.customElements;

  customElements.defineAttribute = defineAttribute;
  globalThis.CustomAttribute = CustomAttribute;

  observeAttributes();
}
