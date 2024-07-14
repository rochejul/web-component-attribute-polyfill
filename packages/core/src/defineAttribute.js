import { Registry } from './utils/registry';

const ATTR_NAME_NAME_ALLOWED_REGEXP = /^[A-Za-z0-9-]*$/;

function isValidAttributeName(attributeName) {
  return (
    typeof attributeName === 'string' &&
    attributeName.length > 1 &&
    ATTR_NAME_NAME_ALLOWED_REGEXP.test(attributeName) &&
    attributeName.includes('-') &&
    !attributeName.endsWith('-')
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

  if (!isValidAttributeName(attributeName)) {
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
