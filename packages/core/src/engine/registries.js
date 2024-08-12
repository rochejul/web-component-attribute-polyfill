import { Registry } from '../utils/registry';
export { getRegistry as getCustomAttributesRegistry } from '../api/defineAttribute.js';

let registryInstance = new Registry();

/**
 * @returns {Registry}
 */
export function getInstancesRegistry() {
  return registryInstance;
}

/**
 * @param {Node} element
 * @returns {{ key: CustomAttributeInstance, customAttributeInstance: CustomAttribute }[]}
 */
export function getRegistryEntriesForElement(element) {
  return getInstancesRegistry()
    .getKeys()
    .filter((key) => key.isElement(element))
    .map((key) => ({
      key,
      customAttributeInstance: getInstancesRegistry().get(key),
    }));
}
