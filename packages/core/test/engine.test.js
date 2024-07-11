import { jest } from '@jest/globals';

import { observeCustomAttribute } from '../src/engine.js';
import { CustomAttribute } from '../src/customAttribute.js';
import { getRegistry } from '../src/utils/registry';

import { digest } from './jest.utils.js';

describe('Core - engine', () => {
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

        // Assert
        observeCustomAttribute(element, 'hx-post', MyOwnAttribute);

        // Arrange
        expect(spyConnectedCallback).not.toHaveBeenCalled();
        expect(spyDisconnectedCallback).not.toHaveBeenCalled();
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });

      test('when connected, only connected handler was called', () => {
        // Arrange
        const element = document.createElement('div');
        document.body.appendChild(element);

        // Assert
        observeCustomAttribute(element, 'hx-post', MyOwnAttribute);

        // Arrange
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
        expect(spyDisconnectedCallback).not.toHaveBeenCalled();
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });

      test('it returns a function', () => {
        // Arrange
        const element = document.createElement('div');

        // Assert
        const instance = observeCustomAttribute(
          element,
          'hx-post',
          MyOwnAttribute,
        );

        // Arrange
        expect(instance).toBeInstanceOf(Function);
      });
    });

    test('it calls the attribute changed callback when the value has changed', async () => {
      // Arrange
      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // Assert
      observeCustomAttribute(element, 'hx-post', MyOwnAttribute);
      element.setAttribute('hx-post', 'some-value');
      await digest();

      // Arrange
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

      // Assert
      const stopObserving = observeCustomAttribute(
        element,
        'hx-post',
        MyOwnAttribute,
      );
      stopObserving();

      element.setAttribute('hx-post', 'some-value');
      await digest();

      // Arrange
      expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
    });
  });
});
