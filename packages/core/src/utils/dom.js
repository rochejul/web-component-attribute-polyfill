const ATTRIBUTE_NAME_REGEXP = /^[a-zA-Z0-9](([a-zA-Z0-9\\-])*[a-zA-Z0-9])?$/;

/**
 * @param {Node} element
 * @returns {string[]}
 */
export function getDeclaredAttributes(element) {
  return Array.from(element.attributes).map(({ name }) => name);
}

/**
 * @param {Node} element
 * @returns {boolean}
 */
export function hasShadowDom(element) {
  return !!element.shadowRoot;
}

/**
 * @param {Node} root
 * @returns {Node[]}
 */
export function findShadowElements(root) {
  const elements = [];
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (hasShadowDom(node)) {
      elements.push(node);
    }
  }

  return elements;
}

/**
 * @param {Node} root
 * @param {string} attrName
 * @returns {Node[]}
 */
export function findElementsWithAttr(root, attrName) {
  const elements = [];
  elements.push(...Array.from(root.querySelectorAll(`[${attrName}]`)));

  const shadowElements = findShadowElements(root);
  for (const shadowElement of shadowElements) {
    elements.push(...findElementsWithAttr(shadowElement.shadowRoot, attrName));
  }

  return elements;
}

/**
 * @param {Node} element
 * @returns {boolean}
 */
export function isNodeElement(element) {
  return element.nodeType === Node.ELEMENT_NODE;
}

/**
 * @param {Node} element
 * @returns {boolean}
 */
export function isTemplateElement(element) {
  return element.tagName === 'TEMPLATE';
}

/**
 * @param {string} attributeName
 * @returns {boolean}
 */
export function isValidAttributeName(attributeName) {
  return !!(attributeName && ATTRIBUTE_NAME_REGEXP.test(attributeName));
}
