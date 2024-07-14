const ELEMENT_SYMBOL = Symbol('element');

export function instantiateCustomAttribute(element, InheritedClass) {
  const instance = new InheritedClass();
  instance[ELEMENT_SYMBOL] = element;
  return instance;
}

/**
 * @name CustomAttribute
 */
export class CustomAttribute {
  /**
   * @param {string} name
   * @param {object|undefined} oldValue
   * @param {object|undefined} newValue
   */
  attributeChangedCallback(/*name, oldValue, newValue*/) {}

  connectedCallback() {}

  disconnectedCallback() {}

  /**
   * @returns {Element}
   */
  get element() {
    return this[ELEMENT_SYMBOL];
  }
}
