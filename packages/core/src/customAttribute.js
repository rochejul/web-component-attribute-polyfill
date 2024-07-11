const ELEMENT_SYMBOL = Symbol('element');

export function instantiateCustomAttribute(element, InheritedClass) {
  const instance = new InheritedClass();
  instance[ELEMENT_SYMBOL] = element;
  return instance;
}

export class CustomAttribute {
  attributeChangedCallback(name, oldValue, newValue) {}

  connectedCallback() {}

  disconnectedCallback() {}

  get element() {
    return this[ELEMENT_SYMBOL];
  }
}
