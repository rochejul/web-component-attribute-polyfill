import { observeAlreadyDeclaredAttr } from './engine/observe.js';
import { defineAttribute as defineAttributeApi } from './engine/core.js';
import { observeAttributes } from './engine/observe.js';

export { CustomAttribute } from './engine/core.js';
export { observeAttributes } from './engine/observe.js';

/**
 * @param {global} context
 */
export function enableClosedShadowRoot(context) {
  const attachShadow = context.HTMLElement.prototype.attachShadow;
  context.HTMLElement.prototype.attachShadow = function (option) {
    // option is required and the property"mode" is required also
    const shadowRoot = attachShadow.call(this, option);

    if (option.mode === 'closed') {
      observeAttributes(shadowRoot);
    }

    return shadowRoot;
  };
}

/**
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 */
export function defineAttribute(attributeName, attributeImpl) {
  defineAttributeApi(attributeName, attributeImpl);
  observeAlreadyDeclaredAttr(attributeName);
}
