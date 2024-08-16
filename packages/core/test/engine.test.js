import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';

import {
  observeAttributes,
  defineAttribute,
  enableClosedShadowRoot,
} from '../src/engine.js';
import { CustomAttribute } from '../src/api/customAttribute.js';

import { digest } from '@web-component-attribute-polyfill/jest-utils';

describe('core - engine', () => {
  const spyConnectedCallback = jest.fn();
  const spyDisconnectedCallback = jest.fn();
  const spyAttributeChangedCallback = jest.fn();

  class Empty {}

  class MyOwnAttribute extends CustomAttribute {
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      spyAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
      this.element.setAttribute(
        'data-test',
        `${name}::${oldValue}::${newValue}`,
      );
    }

    connectedCallback() {
      super.connectedCallback();
      spyConnectedCallback.apply(this, []);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      spyDisconnectedCallback.apply(this, []);
    }
  }

  describe('observeAttributes', () => {
    let element;
    let stopObserving;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      defineAttribute('hx-post', MyOwnAttribute);
      defineAttribute('hx-empty', Empty);
    });

    afterEach(() => {
      stopObserving?.();
      stopObserving = null;
    });

    describe('root of body', () => {
      const root = document.body;

      test('it call the connected callback where we already added element in DOM', async () => {
        // Arrange
        root.appendChild(element);

        // Act
        stopObserving = observeAttributes();
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeAttributes();

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the attribute changed callback where we modify the attribute', async () => {
        // Arrange
        root.appendChild(element);

        stopObserving = observeAttributes();
        await digest();

        // Act
        element.setAttribute('hx-post', 'some-value');
        await digest();

        // Assert
        expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);
        expect(element.getAttribute('data-test')).toBe(
          'hx-post::old-value::some-value',
        );
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeAttributes();

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it does not fail when the implementation does not provide the callbacks', async () => {
        // Arrange
        element = document.createElement('div');
        element.setAttribute('hx-get', 'old-value');

        root.appendChild(element);

        const t = async () => {
          stopObserving = observeAttributes();
          await digest();

          element.setAttribute('hx-post', 'some-value');
          await digest();

          root.removeChild(element);
          await digest();
        };

        // Act && Assert
        expect(t).not.toThrow();
      });
    });

    describe('subTree of body', () => {
      let root;

      beforeEach(() => {
        root = document.createElement('section');
        document.body.appendChild(root);
      });

      test('it call the connected callback where we already added element in DOM', async () => {
        // Arrange
        root.appendChild(element);

        // Act
        stopObserving = observeAttributes();
        await digest();
        root;
        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeAttributes();

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the attribute changed callback where we modify the attribute', async () => {
        // Arrange
        element.setAttribute('hx-post', 'old-value');
        root.appendChild(element);

        stopObserving = observeAttributes();
        await digest();

        // Act
        element.setAttribute('hx-post', 'some-value');
        await digest();

        // Assert
        expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);
        expect(element.getAttribute('data-test')).toBe(
          'hx-post::old-value::some-value',
        );
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeAttributes();

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it does not fail when the implementation does not provide the callbacks', async () => {
        // Arrange
        element = document.createElement('div');
        element.setAttribute('hx-get', 'old-value');

        root.appendChild(element);

        const t = async () => {
          stopObserving = observeAttributes();
          await digest();

          element.setAttribute('hx-post', 'some-value');
          await digest();

          root.removeChild(element);
          await digest();
        };

        // Act && Assert
        expect(t).not.toThrow();
      });
    });

    describe('from shadow dom (open mode)', () => {
      let root;

      beforeEach(() => {
        root = document.createElement('section');
        document.body.appendChild(root);

        root.attachShadow({ mode: 'open' });
        root = root.shadowRoot;
      });

      test('it call the connected callback where we already added element in DOM', async () => {
        // Arrange
        root.appendChild(element);

        // Act
        stopObserving = observeAttributes();
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeAttributes(root);

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the attribute changed callback where we modify the attribute', async () => {
        // Arrange
        element.setAttribute('hx-post', 'old-value');
        root.appendChild(element);

        stopObserving = observeAttributes();
        await digest();

        // Act
        element.setAttribute('hx-post', 'some-value');
        await digest();

        // Assert
        expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);
        expect(element.getAttribute('data-test')).toBe(
          'hx-post::old-value::some-value',
        );
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeAttributes();

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it does not fail when the implementation does not provide the callbacks', async () => {
        // Arrange
        element = document.createElement('div');
        element.setAttribute('hx-get', 'old-value');

        root.appendChild(element);

        const t = async () => {
          stopObserving = observeAttributes();
          await digest();

          element.setAttribute('hx-post', 'some-value');
          await digest();

          root.removeChild(element);
          await digest();
        };

        // Act && Assert
        expect(t).not.toThrow();
      });
    });
  });

  describe('enableClosedShadowRoot', () => {
    test('when we use it, we are able to deal with closed shadow root', async () => {
      // Arrange
      enableClosedShadowRoot(globalThis);
      defineAttribute('hx-post', MyOwnAttribute);

      const root = document.createElement('section');
      document.body.appendChild(root);

      const shadowRoot = root.attachShadow({ mode: 'closed' });

      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // Act
      shadowRoot.appendChild(element);
      await digest();

      element.setAttribute('hx-post', 'some-value');
      await digest();

      shadowRoot.removeChild(element);
      await digest();

      // Assert
      expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(1);
      expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
    });

    test('otherwise, we are in an open shadow and we then only returns the shadow root (no observation binding)', async () => {
      // Arrange
      enableClosedShadowRoot(globalThis);
      defineAttribute('hx-post', MyOwnAttribute);

      let root = document.createElement('section');
      document.body.appendChild(root);

      root.attachShadow({ mode: 'open' });
      root = root.shadowRoot;

      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // Act
      root.appendChild(element);
      await digest();

      element.setAttribute('hx-post', 'some-value');
      await digest();

      root.removeChild(element);
      await digest();

      // Assert
      expect(spyConnectedCallback).toHaveBeenCalledTimes(0);
      expect(spyAttributeChangedCallback).toHaveBeenCalledTimes(0);
      expect(spyDisconnectedCallback).toHaveBeenCalledTimes(0);
    });
  });
});
