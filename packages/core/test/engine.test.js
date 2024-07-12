import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';

import { observeCustomAttribute, observeElement } from '../src/engine.js';
import {
  CustomAttribute,
  instantiateCustomAttribute,
} from '../src/customAttribute.js';
import { getRegistry } from '../src/utils/registry';

import { digest } from './jest.utils.js';

describe('core - engine', () => {
  const spyConnectedCallback = jest.fn();
  const spyDisconnectedCallback = jest.fn();
  const spyAttributeChangedCallback = jest.fn();
  const registry = getRegistry();

  class MyOwnAttribute extends CustomAttribute {
    attributeChangedCallback(name, oldValue, newValue) {
      spyAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
    }

    connectedCallback() {
      spyConnectedCallback.apply(this, []);
    }

    disconnectedCallback() {
      spyDisconnectedCallback.apply(this, []);
    }
  }

  beforeEach(() => {
    document.body.textContent = '';
  });

  afterEach(() => {
    registry.clear();
  });

  describe('observeCustomAttribute', () => {
    describe('when we call it', () => {
      test('when not connected, no handlers were called', () => {
        // Arrange
        const element = document.createElement('div');

        // Act
        observeCustomAttribute(element, 'hx-post', MyOwnAttribute);

        // Assert
        expect(spyConnectedCallback).not.toHaveBeenCalled();
        expect(spyDisconnectedCallback).not.toHaveBeenCalled();
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });

      test('when connected, only connected handler was called', () => {
        // Arrange
        const element = document.createElement('div');
        document.body.appendChild(element);

        // Act
        observeCustomAttribute(element, 'hx-post', MyOwnAttribute);

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
        expect(spyDisconnectedCallback).not.toHaveBeenCalled();
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });

      test('it returns a function', () => {
        // Arrange
        const element = document.createElement('div');

        // Act
        const stopObserving = observeCustomAttribute(
          element,
          'hx-post',
          MyOwnAttribute,
        );

        // Assert
        expect(stopObserving).toBeInstanceOf(Function);
      });
    });

    test('it calls the attribute changed callback when the value has changed', async () => {
      // Arrange
      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // Act
      observeCustomAttribute(element, 'hx-post', MyOwnAttribute);
      element.setAttribute('hx-post', 'some-value');
      await digest();

      // Assert
      expect(spyAttributeChangedCallback).toHaveBeenCalledWith(
        'hx-post',
        'old-value',
        'some-value',
      );
    });

    test('it should not call the attribute changed callback when we execute the returned function', async () => {
      // Arrange
      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // act
      const stopObserving = observeCustomAttribute(
        element,
        'hx-post',
        MyOwnAttribute,
      );
      stopObserving();

      element.setAttribute('hx-post', 'some-value');
      await digest();

      // Assert
      expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
    });
  });

  describe('observeElement', () => {
    let element;
    let customAttributeInstance;
    let stopObserving;

    beforeEach(() => {
      element = document.createElement('div');
      customAttributeInstance = instantiateCustomAttribute(
        element,
        MyOwnAttribute,
      );
    });

    afterEach(() => {
      stopObserving?.();
      stopObserving = null;
    });

    describe('root of body', () => {
      const root = document.body;

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
      });
    });

    describe('subTree of body', () => {
      let root;

      beforeEach(() => {
        root = document.createElement('section');
        document.body.appendChild(root);
      });

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
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

      test('it call the connected callback where we add an element into the DOM', async () => {
        // Arrange
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.appendChild(element);
        await digest();

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
      });

      test('it call the disconnected callback where we remove the element from the DOM', async () => {
        // Arrange
        root.appendChild(element);
        stopObserving = observeElement([customAttributeInstance]);

        // Act
        root.removeChild(element);
        await digest();

        // Assert
        expect(spyDisconnectedCallback).toHaveBeenCalledTimes(1);
      });
    });
  });
});
