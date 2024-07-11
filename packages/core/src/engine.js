import { CustomAttribute, instantiateCustomAttribute } from './customAttribute';

const MutationRecordType = {
  attributes: 'attributes',
  childList: 'childList',
};

/**
 * To stop observing the attribute
 * @callback stopOberveAttribute
 */

/**
 * @param {MutationRecord} mutation
 * @returns {boolean}
 */
function isMutationRecordAttributes({ type }) {
  return type === MutationRecordType.attributes;
}

/**
 * @param {MutationRecord} mutation
 * @returns {boolean}
 */
function isMutationRecordChidList({ type }) {
  return type === MutationRecordType.childList;
}

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
 * @returns {stopOberveAttribute}
 */
export function observeElement(customAttributeInstances) {
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver((mutationsList) =>
    elementMutationHandler(mutationsList, customAttributeInstances),
  );

  observer.observe(globalThis.document.body, config);

  return () => {
    observer.disconnect();
  };
}

/**
 *
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttribute} customAttributeInstance
 * @returns {stopOberveAttribute}
 */
function observeAttribute(element, attributeName, customAttributeInstance) {
  const config = {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: [attributeName],
  };

  const observer = new MutationObserver((mutationsList) =>
    attributeMutationHandler(
      mutationsList,
      attributeName,
      customAttributeInstance,
    ),
  );

  observer.observe(element, config);

  return () => {
    observer.disconnect();
  };
}

/**
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttributeImplementation} attributeImpl
 * @returns {stopOberveAttribute}
 */
export function observeCustomAttribute(element, attributeName, attributeImpl) {
  const customAttributeInstance = instantiateCustomAttribute(
    element,
    attributeImpl,
  );

  if (element.isConnected) {
    customAttributeInstance.connectedCallback();
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
