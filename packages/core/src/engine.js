import { instantiateCustomAttribute } from './customAttribute';
import {
  isMutationRecordAttributes,
  isMutationRecordChidList,
} from './utils/mutation';
import { hasShadowDom, findElementsWithAttr } from './utils/dom';
import { getRegistry } from './utils/registry';

/**
 * To stop observing the attribute
 * @callback stopObserveAttribute
 */

/**
 * @param {MutationRecord[]} mutationsList
 * @param {string} attributeName
 * @param {CustomAttribute} customAttributeInstance
 */
function attributeMutationHandler(
  mutationsList,
  attributeName,
  customAttributeInstance,
) {
  for (const mutation of mutationsList) {
    if (
      isMutationRecordAttributes(mutation) &&
      mutation.attributeName === attributeName
    ) {
      customAttributeInstance.attributeChangedCallback(
        attributeName,
        mutation.oldValue,
        mutation.target.getAttribute(attributeName),
      );
    }
  }
}

/**
 * @param {MutationRecord} mutation
 * @param {CustomAttribute[]} customAttributeInstances
 */
function callDisconnectedCallback(mutation, customAttributeInstances) {
  const removedNodes = Array.from(mutation.removedNodes);

  if (!removedNodes.length || !customAttributeInstances.length) {
    return;
  }

  for (const customAttributeInstance of customAttributeInstances) {
    if (removedNodes.includes(customAttributeInstance.element)) {
      customAttributeInstance.disconnectedCallback();
    }
  }
}

/**
 * @param {MutationRecord} mutation
 * @param {CustomAttribute[]} customAttributeInstances
 */
function callConnectedCallback(mutation, customAttributeInstances) {
  const addedNodes = Array.from(mutation.addedNodes);

  if (!addedNodes.length || !customAttributeInstances.length) {
    return;
  }

  for (const customAttributeInstance of customAttributeInstances) {
    if (addedNodes.includes(customAttributeInstance.element)) {
      customAttributeInstance.connectedCallback();
    }
  }

  for (const addedNode of addedNodes.filter(hasShadowDom)) {
    observeElement(customAttributeInstances, addedNode.shadowRoot);
  }
}

/**
 * @param {MutationRecord[]} mutationsList
 * @param {CustomAttribute[]} customAttributeInstances
 */
function elementMutationHandler(mutationsList, customAttributeInstances) {
  for (const mutation of mutationsList) {
    if (isMutationRecordChidList(mutation)) {
      callDisconnectedCallback(mutation, customAttributeInstances);
      callConnectedCallback(mutation, customAttributeInstances);
    }
  }
}

/**
 * @param {CustomAttribute[]} customAttributeInstances
 * @param {Element} root
 */
function shadowElementTreeWalker(customAttributeInstances, root) {
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;

    if (hasShadowDom(node)) {
      observeElement(customAttributeInstances, node.shadowRoot);
    }
  }
}

/**
 * @param {CustomAttribute[]} customAttributeInstances
 * @param {Element} [root=document.body]
 * @returns {stopObserveAttribute}
 */
export function observeElement(customAttributeInstances, root = document.body) {
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutationsList) =>
    elementMutationHandler(mutationsList, customAttributeInstances),
  );

  shadowElementTreeWalker(customAttributeInstances, root);
  observer.observe(root, config);

  return () => {
    observer.disconnect();
  };
}

export function observeAlreadyDeclaredAttr(attrName, root = document.body) {
  const registry = getRegistry();
  findElementsWithAttr(root, attrName).forEach((element) => {
    observeCustomAttribute(element, attrName, registry.get(attrName));
  });
}

/**
 * @param {Element} [root=document.body]
 * @returns {stopObserveAttribute}
 */
export function observeAttributes(root = document.body) {
  const registry = getRegistry();
  const config = {
    attributes: true,
  };

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        isMutationRecordAttributes(mutation) &&
        registry.has(mutation.attributeName)
      ) {
        observeCustomAttribute(
          mutation.target,
          mutation.attributeName,
          registry.get(mutation.attributeName),
        );
      }
    }
  });

  observer.observe(root, config);

  return () => {
    observer.disconnect();
  };
}

/**
 *
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttribute} customAttributeInstance
 * @returns {stopObserveAttribute}
 */
function observeAttribute(element, attributeName, customAttributeInstance) {
  const config = {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [attributeName],
  };

  const attributeObserver = new MutationObserver((mutationsList) => {
    attributeMutationHandler(
      mutationsList,
      attributeName,
      customAttributeInstance,
    );
  });

  attributeObserver.observe(element, config);

  // TODO aslo need a treeWalker

  return () => {
    attributeObserver.disconnect();
  };
}

/**
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 * @returns {stopObserveAttribute}
 */
export function observeCustomAttribute(element, attributeName, attributeImpl) {
  const customAttributeInstance = instantiateCustomAttribute(
    element,
    attributeImpl,
  );

  if (element.isConnected) {
    customAttributeInstance.connectedCallback();
  }

  const stopObserveElement = observeElement([customAttributeInstance], element);
  const stopObserveAttribute = observeAttribute(
    element,
    attributeName,
    customAttributeInstance,
  );

  return () => {
    stopObserveAttribute();
    stopObserveElement();
  };
}
