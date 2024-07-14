import { observeAlreadyDeclaredAttr } from './engine/observe.js';
import { defineAttribute as defineAttributeApi } from './engine/core.js';

export { CustomAttribute } from './engine/core.js';
export { observeAttributes } from './engine/observe.js';

/**
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 */
export function defineAttribute(attributeName, attributeImpl) {
  defineAttributeApi(attributeName, attributeImpl);
  observeAlreadyDeclaredAttr(attributeName);
}
