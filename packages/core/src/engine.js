import {
  isMutationRecordAttributes,
  isMutationRecordChidList,
} from './utils/mutation';
import {
  getDeclaredAttributes,
  hasShadowDom,
  findShadowElements,
  findElementsWithAttr,
} from './utils/dom';
import { Registry } from './utils/registry';

import { instantiateCustomAttribute } from './api/customAttribute.js';
import {
  defineAttribute as defineAttributeApi,
  getRegistry as getCustomAttributeRegistry,
} from './api/defineAttribute.js';

let registryInstance = new Registry();

export function getRegistry() {
  return registryInstance;
}

class CustomAttributeInstance {
  #attributeName;
  #element;
  #connected = false;

  static #ELEMENT_ID_SYMBOL = Symbol('elementID');

  constructor(attributeName, element) {
    this.#attributeName = attributeName;
    this.#element = element;

    if (!this.#element[CustomAttributeInstance.#ELEMENT_ID_SYMBOL]) {
      this.#element[CustomAttributeInstance.#ELEMENT_ID_SYMBOL] =
        crypto.randomUUID();
    }
  }

  isConnected() {
    return this.#connected;
  }

  isElement(element) {
    return this.#element === element;
  }

  toggleConnected() {
    this.#connected = !this.#connected;
  }

  toString() {
    return `CustomAttributeInstance::${this.#attributeName}::${this.#element[CustomAttributeInstance.#ELEMENT_ID_SYMBOL]}`;
  }
}

/**
 * @param {Element} element
 * @returns {{ key: CustomAttributeInstance, customAttributeInstance: CustomAttribute }[]}
 */
function getRegistryEntriesForElement(element) {
  return registryInstance
    .getKeys()
    .filter((key) => key.isElement(element))
    .map((key) => ({
      key,
      customAttributeInstance: registryInstance.get(key),
    }));
}

/**
 * @param {CustomAttributeInstance} key
 */
function appyConnectedCallback(key) {
  if (key.isConnected()) {
    return;
  }

  key.toggleConnected();
  registryInstance.get(key).connectedCallback();
}

/**
 * @param {CustomAttributeInstance} key
 */
function appyDisconnectedCallback(key) {
  if (!key.isConnected()) {
    return;
  }

  key.toggleConnected();
  registryInstance.get(key).disconnectedCallback();
  registryInstance.remove(key);
}

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
 */
function callDisconnectedCallback(mutation) {
  const removedNodes = Array.from(mutation.removedNodes);

  if (!removedNodes.length) {
    return;
  }

  for (const removedNode of removedNodes) {
    getRegistryEntriesForElement(removedNode).forEach(({ key }) => {
      appyDisconnectedCallback(key);
    });

    if (hasShadowDom(removedNode)) {
      // TODO we clean also here
    }
  }
}

/**
 * @param {MutationRecord} mutation
 */
function callConnectedCallback(mutation) {
  const addedNodes = Array.from(mutation.addedNodes);

  if (!addedNodes.length) {
    return;
  }

  const registry = getCustomAttributeRegistry();
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
 * @param {Element} [root=document.body]
 * @returns {stopObserveAttribute}
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

  return () => {
    attributeObserver.disconnect();
  };
}

/**
 * @param {string} attributeName
 * @param {Element} [root=document.body]
 */
function observeAlreadyDeclaredAttr(attrName, root = document.body) {
  const registry = getCustomAttributeRegistry();
  const customAttributeInstance = registry.get(attrName);

  findElementsWithAttr(root, attrName).forEach((element) => {
    observeCustomAttribute(element, attrName, customAttributeInstance);
  });

  if (root.hasAttribute?.(attrName)) {
    observeCustomAttribute(root, attrName, customAttributeInstance);
  }
}

/**
 * @param {Element} [root=document.body]
 */
function observeAlreadyDeclaredAttrs(root = document.body) {
  const registry = getCustomAttributeRegistry();
  const attributeNames = registry.getKeys();

  attributeNames.forEach((attrName) =>
    observeAlreadyDeclaredAttr(attrName, root),
  );
}

/**
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 * @returns {stopObserveAttribute}
 */
export function observeCustomAttribute(element, attributeName, attributeImpl) {
  const key = new CustomAttributeInstance(attributeName, element);

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
 * @param {Element} [root=document.body]
 * @returns {stopObserveAttribute}
 */
export function observeAttributes(root = document.body) {
  const stopObserveElement = observeElement(root);
  observeAlreadyDeclaredAttrs(root);

  return () => {
    stopObserveElement();
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
