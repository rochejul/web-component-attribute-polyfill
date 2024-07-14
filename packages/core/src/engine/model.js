const ELEMENT_ID_SYMBOL = Symbol('elementID');

export class CustomAttributeInstance {
  #attributeName;
  #element;
  #connected = false;

  constructor(attributeName, element) {
    this.#attributeName = attributeName;
    this.#element = element;

    if (!this.#element[ELEMENT_ID_SYMBOL]) {
      this.#element[ELEMENT_ID_SYMBOL] = crypto.randomUUID();
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
    return `CustomAttributeInstance::${this.#attributeName}::${this.#element[ELEMENT_ID_SYMBOL]}`;
  }
}
