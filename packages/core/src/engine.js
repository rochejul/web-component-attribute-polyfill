import { CustomAttribute, instantiateCustomAttribute } from './customAttribute';

/**
 * To stop observing the attribute
 * @callback stopOberveAttribute
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
      mutation.type === 'attributes' &&
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
 *
 * @param {Element} element
 * @param {string} attributeName
 * @param {CustomAttribute} customAttributeInstance
 * @returns {stopOberveAttribute}
 */
function observeAttribute(element, attributeName, customAttributeInstance) {
  const config = { attributes: true, attributeOldValue: true };
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
