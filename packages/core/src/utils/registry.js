class Registry {
  #attributes = {};

  clear() {
    this.#attributes = {};
  }

  get(name) {
    return this.#attributes[name];
  }

  put(name, instance) {
    this.#attributes[name] = instance;
  }

  size() {
    return Object.keys(this.#attributes).length;
  }
}

let registryInstance = new Registry();

export function getRegistry() {
  return registryInstance;
}
