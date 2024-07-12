import { defineAttribute } from './defineAttribute';
import { observeAttributes, observeAlreadyDeclaredAttr } from './engine';

if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
  const customElements = globalThis.customElements;
  customElements.defineAttribute = function (attributeName, attributeImpl) {
    defineAttribute(attributeName, attributeImpl);
    observeAlreadyDeclaredAttr(attributeName);
  };

  observeAttributes();
}
