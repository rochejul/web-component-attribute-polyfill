import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';

import { observeCustomAttribute } from '../../src/engine/observe.js';

import { CustomAttribute } from '../../src/api/customAttribute.js';
import { defineAttribute } from '../../src/api/defineAttribute';

import { digest } from '../jest.utils.js';

describe('core - engine - observe', () => {
  const spyConnectedCallback = jest.fn();
  const spyDisconnectedCallback = jest.fn();
  const spyAttributeChangedCallback = jest.fn();

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

  describe('observeCustomAttribute', () => {
    let element;
    let stopObserving;

    beforeEach(() => {
      element = document.createElement('div');
      element.setAttribute('hx-post', 'some-value');

      defineAttribute('hx-post', MyOwnAttribute);
    });

    afterEach(() => {
      stopObserving?.();
      stopObserving = null;
    });

    describe('when we call it', () => {
      test('when not connected, no handlers were called', () => {
        // Arrange
        const element = document.createElement('div');

        // Act
        stopObserving = observeCustomAttribute(
          element,
          'hx-post',
          MyOwnAttribute,
        );

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
        stopObserving = observeCustomAttribute(
          element,
          'hx-post',
          MyOwnAttribute,
        );

        // Assert
        expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
        expect(spyDisconnectedCallback).not.toHaveBeenCalled();
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });

      test('it returns a function', () => {
        // Arrange
        const element = document.createElement('div');

        // Act
        stopObserving = observeCustomAttribute(
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

    test('it calls the attribute changed callback when the attribute is added', async () => {
      // Arrange
      const element = document.createElement('div');

      // Act
      observeCustomAttribute(element, 'hx-post', MyOwnAttribute);
      element.setAttribute('hx-post', 'some-value');
      await digest();

      // Assert
      expect(spyAttributeChangedCallback).toHaveBeenCalledWith(
        'hx-post',
        null,
        'some-value',
      );
    });

    test('it should not call the attribute changed callback when we execute the returned function', async () => {
      // Arrange
      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      // act
      stopObserving = observeCustomAttribute(
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
});
