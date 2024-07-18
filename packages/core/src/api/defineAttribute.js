import { Registry } from '../utils/registry.js';
import { isValidAttributeName } from '../utils/dom.js';

/**
 * @param {string} attributeName
 * @returns {boolean}
 */
function isValidCustomAttributeName(attributeName) {
  return (
    isValidAttributeName(attributeName) && !attributeName.startsWith('data-')
  );
}

function isValidAttributeImpl(attributeImpl) {
  return typeof attributeImpl === 'function';
}

/**
 * @typedef CustomAttributeImplementation
 * @extends CustomAttribute
 */

let registryInstance = new Registry();

export function getRegistry() {
  return registryInstance;
}

/**
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 */
export function defineAttribute(attributeName, attributeImpl) {
  if (arguments.length < 2) {
    throw new TypeError(
      `Failed to execute 'defineAttribute' on 'CustomElementRegistry': 2 arguments required, but only ${arguments.length} present.`,
    );
  }

  if (!isValidAttributeImpl(attributeImpl)) {
    throw new TypeError(
      `Failed to execute 'defineAttribute' on 'CustomElementRegistry': parameter 2 is not of type 'Function'`,
    );
  }

  if (!isValidCustomAttributeName(attributeName)) {
    throw new DOMException(
      `Failed to execute 'defineAttribute' on 'CustomElementRegistry': "${attributeName}" is not a valid custom element name`,
    );
  }

  if (registryInstance.has(attributeName)) {
    throw new DOMException(
      `Failed to execute 'defineAttribute' on 'CustomElementRegistry': the name "${attributeName}" has already been used with this registry`,
    );
  }

  registryInstance.put(attributeName, attributeImpl);
}
