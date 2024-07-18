export class Registry {
  #mapping = new Map();

  clear() {
    this.#mapping.clear();
  }

  get(key) {
    return this.#mapping.get(key);
  }

  getKeys() {
    return Array.from(this.#mapping.keys());
  }

  has(key) {
    const hash = key?.toString() ?? key;
    return this.getKeys().find((entry) => entry.toString() === hash);
  }

  remove(key) {
    this.#mapping.delete(key);
  }

  put(key, instance) {
    this.#mapping.set(key, instance);
  }

  size() {
    return this.getKeys().length;
  }
}
