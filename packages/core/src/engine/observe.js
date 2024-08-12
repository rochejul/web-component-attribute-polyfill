import {
  isMutationRecordAttributes,
  isMutationRecordChidList,
} from '../utils/mutation';
import {
  getDeclaredAttributes,
  hasShadowDom,
  findShadowElements,
  findElementsWithAttr,
  isNodeElement,
  isTemplateElement,
} from '../utils/dom';

import { instantiateCustomAttribute } from '../api/customAttribute.js';

import {
  getCustomAttributesRegistry,
  getInstancesRegistry,
  getRegistryEntriesForElement,
} from '../engine/registries.js';
import { CustomAttributeInstance } from '../engine/model.js';

/**
 * @param {CustomAttributeInstance} key
 */
function appyConnectedCallback(key) {
  if (key.isConnected()) {
    return;
  }

  key.toggleConnected();
  getInstancesRegistry().get(key).connectedCallback?.();
}

/**
 * @param {CustomAttributeInstance} key
 */
function appyDisconnectedCallback(key) {
  if (!key.isConnected()) {
    return;
  }

  key.toggleConnected();
  getInstancesRegistry().get(key).disconnectedCallback?.();
  getInstancesRegistry().remove(key);
}

/**
 * To stop observing the attribute
 * @callback stopObserveMutation
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
      customAttributeInstance.attributeChangedCallback?.(
        attributeName,
        mutation.oldValue,
        mutation.target.getAttribute(attributeName),
      );
    }
  }
}

/**
 * @param {MutationRecord} mutation
 */
function callDisconnectedCallback(mutation) {
  const removedNodes = Array.from(mutation.removedNodes).filter(isNodeElement);

  if (!removedNodes.length) {
    return;
  }

  for (const removedNode of removedNodes) {
    getRegistryEntriesForElement(removedNode).forEach(({ key }) => {
      appyDisconnectedCallback(key);
    });
  }
}

/**
 * @param {MutationRecord} mutation
 */
function callConnectedCallback(mutation) {
  const addedNodes = Array.from(mutation.addedNodes).filter(isNodeElement);

  if (!addedNodes.length) {
    return;
  }

  const registry = getCustomAttributesRegistry();
  const attributes = registry.getKeys();

  for (const addedNode of addedNodes) {
    const entries = getRegistryEntriesForElement(addedNode);

    if (entries.length > 0) {
      entries.forEach(({ key }) => appyConnectedCallback(key));
    } else {
      const declaredAttributes = getDeclaredAttributes(addedNode);
      const intersection = declaredAttributes.filter((x) =>
        attributes.includes(x),
      );
      intersection.forEach((attrName) =>
        observeAlreadyDeclaredAttr(attrName, addedNode),
      );
    }

    if (hasShadowDom(addedNode)) {
      observeAttributes(addedNode.shadowRoot);
    }
  }
}

/*
 * @param {MutationRecord[]} mutationsList
 */
function elementMutationHandler(mutationsList) {
  for (const mutation of mutationsList) {
    if (isMutationRecordChidList(mutation)) {
      callDisconnectedCallback(mutation);
      callConnectedCallback(mutation);
    }
  }
}

/**
 * @param {Node} [root=document.body]
 * @returns {stopObserveMutation}
 */
function observeElement(root = document.body) {
  const config = { childList: true, subtree: true };
  const observer = new MutationObserver(elementMutationHandler);
  observer.observe(root, config);

  findShadowElements(root)
    .map(({ shadowRoot }) => shadowRoot)
    .map(observeAttributes);

  return () => {
    observer.disconnect();
  };
}

/**
 *
 * @param {Node} element
 * @param {string} attributeName
 * @param {CustomAttribute} customAttributeInstance
 * @returns {stopObserveMutation}
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

  return () => {
    attributeObserver.disconnect();
  };
}

/**
 * @param {Node} [root=document.body]
 */
function observeAlreadyDeclaredAttrs(root = document.body) {
  const registry = getCustomAttributesRegistry();
  const attributeNames = registry.getKeys();

  attributeNames.forEach((attrName) =>
    observeAlreadyDeclaredAttr(attrName, root),
  );
}

/**
 * @param {string} attributeName
 * @param {Node} [root=document.body]
 */
export function observeAlreadyDeclaredAttr(attrName, root = document.body) {
  const registry = getCustomAttributesRegistry();
  const customAttributeInstance = registry.get(attrName);

  findElementsWithAttr(root, attrName).forEach((element) => {
    observeCustomAttribute(element, attrName, customAttributeInstance);
  });

  if (root.hasAttribute?.(attrName)) {
    observeCustomAttribute(root, attrName, customAttributeInstance);
  }
}

/**
 * @param {Node} element
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 * @returns {stopObserveMutation}
 */
export function observeCustomAttribute(element, attributeName, attributeImpl) {
  const key = new CustomAttributeInstance(attributeName, element);
  const registryInstance = getInstancesRegistry();

  if (isTemplateElement(element)) {
    throw new DOMException(
      `Failed to instantiante the custom attribute "${attributeName}" on the element: template tags are not allowed`,
    );
  }

  if (registryInstance.has(key)) {
    return () => {};
  }

  const customAttributeInstance = instantiateCustomAttribute(
    element,
    attributeImpl,
  );

  registryInstance.put(key, customAttributeInstance);

  if (element.isConnected) {
    appyConnectedCallback(key);
  }

  const stopObserveAttribute = observeAttribute(
    element,
    attributeName,
    customAttributeInstance,
  );

  return () => {
    stopObserveAttribute();
  };
}

/**
 * @param {Node} [root=document.body]
 * @returns {stopObserveMutation}
 */
export function observeAttributes(root = document.body) {
  const stopObserveElement = observeElement(root);
  observeAlreadyDeclaredAttrs(root);

  return () => {
    stopObserveElement();
  };
}
