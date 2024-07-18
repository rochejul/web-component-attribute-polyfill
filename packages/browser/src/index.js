import {
  defineAttribute,
  enableClosedShadowRoot,
  observeAttributes,
  CustomAttribute,
} from '@web-component-attribute-polyfill/core';

if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
  const customElements = globalThis.customElements;

  customElements.defineAttribute = defineAttribute;
  globalThis.CustomAttribute = CustomAttribute;

  enableClosedShadowRoot(globalThis);
  observeAttributes();

  globalThis.addEventListener('DOMContentLoaded', () => {
    observeAttributes();
  });
}
