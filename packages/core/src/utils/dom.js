/**
 * @param {Element} element
 * @returns {string[]}
 */
export function getDeclaredAttributes(element) {
  return Array.from(element.attributes).map(({ name }) => name);
}

/**
 * @param {Element} element
 * @returns {boolean}
 */
export function hasShadowDom(element) {
  return !!element.shadowRoot;
}

/**
 * @param {Element} root
 * @returns {Element[]}
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
 * @param {Element} root
 * @param {string} attrName
 * @returns {Element[]}
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
