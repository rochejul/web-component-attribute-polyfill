define((function () { 'use strict';

  const MutationRecordType = {
    attributes: 'attributes',
    childList: 'childList',
  };

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
   * @param {Element} element
   * @returns {string[]}
   */
  function getDeclaredAttributes(element) {
    return Array.from(element.attributes).map(({ name }) => name);
  }

  /**
   * @param {Element} element
   * @returns {boolean}
   */
  function hasShadowDom(element) {
    return !!element.shadowRoot;
  }

  /**
   * @param {Element} root
   * @returns {Element[]}
   */
  function findShadowElements(root) {
    const elements = [];
    const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;

      if (hasShadowDom(node)) {
        elements.push(node);
      }
    }

    return elements;
  }

  /**
   * @param {Element} root
   * @param {string} attrName
   * @returns {Element[]}
   */
  function findElementsWithAttr(root, attrName) {
    const elements = [];
    elements.push(...Array.from(root.querySelectorAll(`[${attrName}]`)));

    const shadowElements = findShadowElements(root);
    for (const shadowElement of shadowElements) {
      elements.push(...findElementsWithAttr(shadowElement.shadowRoot, attrName));
    }

    return elements;
  }

  const ELEMENT_SYMBOL = Symbol('element');

  function instantiateCustomAttribute(element, InheritedClass) {
    const instance = new InheritedClass();
    instance[ELEMENT_SYMBOL] = element;
    return instance;
  }

  /**
   * @name CustomAttribute
   */
  class CustomAttribute {
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

  class Registry {
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

  const ATTR_NAME_NAME_ALLOWED_REGEXP = /^[A-Za-z0-9-]*$/;

  function isValidAttributeName(attributeName) {
    return (
      typeof attributeName === 'string' &&
      attributeName.length > 1 &&
      ATTR_NAME_NAME_ALLOWED_REGEXP.test(attributeName) &&
      attributeName.includes('-') &&
      !attributeName.endsWith('-')
    );
  }

  function isValidAttributeImpl(attributeImpl) {
    return typeof attributeImpl === 'function';
  }

  /**
   * @typedef CustomAttributeImplementation
   * @extends CustomAttribute
   */

  let registryInstance$1 = new Registry();

  function getRegistry() {
    return registryInstance$1;
  }

  /**
   * @param {string} attributeName
   * @param {CustomAttributeImplementation} attributeImpl
   */
  function defineAttribute$1(attributeName, attributeImpl) {
    if (arguments.length < 2) {
      throw new TypeError(
        `Failed to execute 'defineAttribute' on 'CustomElementRegistry': 2 arguments required, but only ${arguments.length} present.`,
      );
    }

    if (!isValidAttributeImpl(attributeImpl)) {
      throw new TypeError(
        `Failed to execute 'defineAttribute' on 'CustomElementRegistry': parameter 2 is not of type 'Function'`,
      );
    }

    if (!isValidAttributeName(attributeName)) {
      throw new DOMException(
        `Failed to execute 'defineAttribute' on 'CustomElementRegistry': "${attributeName}" is not a valid custom element name`,
      );
    }

    if (registryInstance$1.has(attributeName)) {
      throw new DOMException(
        `Failed to execute 'defineAttribute' on 'CustomElementRegistry': the name "${attributeName}" has already been used with this registry`,
      );
    }

    registryInstance$1.put(attributeName, attributeImpl);
  }

  let registryInstance = new Registry();

  function getInstancesRegistry() {
    return registryInstance;
  }

  /**
   * @param {Element} element
   * @returns {{ key: CustomAttributeInstance, customAttributeInstance: CustomAttribute }[]}
   */
  function getRegistryEntriesForElement(element) {
    return getInstancesRegistry()
      .getKeys()
      .filter((key) => key.isElement(element))
      .map((key) => ({
        key,
        customAttributeInstance: getInstancesRegistry().get(key),
      }));
  }

  const ELEMENT_ID_SYMBOL = Symbol('elementID');

  class CustomAttributeInstance {
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

  /**
   * @param {CustomAttributeInstance} key
   */
  function appyConnectedCallback(key) {
    if (key.isConnected()) {
      return;
    }

    key.toggleConnected();
    getInstancesRegistry().get(key).connectedCallback();
  }

  /**
   * @param {CustomAttributeInstance} key
   */
  function appyDisconnectedCallback(key) {
    if (!key.isConnected()) {
      return;
    }

    key.toggleConnected();
    getInstancesRegistry().get(key).disconnectedCallback();
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

    const registry = getRegistry();
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
   * @param {Element} element
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
   * @param {Element} [root=document.body]
   */
  function observeAlreadyDeclaredAttrs(root = document.body) {
    const registry = getRegistry();
    const attributeNames = registry.getKeys();

    attributeNames.forEach((attrName) =>
      observeAlreadyDeclaredAttr(attrName, root),
    );
  }

  /**
   * @param {string} attributeName
   * @param {Element} [root=document.body]
   */
  function observeAlreadyDeclaredAttr(attrName, root = document.body) {
    const registry = getRegistry();
    const customAttributeInstance = registry.get(attrName);

    findElementsWithAttr(root, attrName).forEach((element) => {
      observeCustomAttribute(element, attrName, customAttributeInstance);
    });

    if (root.hasAttribute?.(attrName)) {
      observeCustomAttribute(root, attrName, customAttributeInstance);
    }
  }

  /**
   * @param {Element} element
   * @param {string} attributeName
   * @param {CustomAttributeImplementation} attributeImpl
   * @returns {stopObserveMutation}
   */
  function observeCustomAttribute(element, attributeName, attributeImpl) {
    const key = new CustomAttributeInstance(attributeName, element);
    const registryInstance = getInstancesRegistry();

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
   * @returns {stopObserveMutation}
   */
  function observeAttributes(root = document.body) {
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
  function defineAttribute(attributeName, attributeImpl) {
    defineAttribute$1(attributeName, attributeImpl);
    observeAlreadyDeclaredAttr(attributeName);
  }

  if (globalThis.customElements && !globalThis.customElements.defineAttribute) {
    const customElements = globalThis.customElements;

    customElements.defineAttribute = defineAttribute;
    globalThis.CustomAttribute = CustomAttribute;

    observeAttributes();
  }

}));
