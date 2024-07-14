import { defineAttribute, observeAttributes } from './engine';
import { CustomAttribute } from './api/customAttribute';

if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
  const customElements = globalThis.customElements;

  customElements.defineAttribute = defineAttribute;
  globalThis.CustomAttribute = CustomAttribute;

  observeAttributes();
}
