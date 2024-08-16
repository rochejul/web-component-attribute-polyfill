import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';

import { observeCustomAttribute } from '../../src/engine/observe.js';
import { getInstancesRegistry } from '../../src/engine/registries.js';

import { CustomAttribute } from '../../src/api/customAttribute.js';
import { defineAttribute } from '../../src/api/defineAttribute';

import { digest } from '@web-component-attribute-polyfill/jest-utils';

describe('core - engine - observe', () => {
  const spyConnectedCallback = jest.fn();
  const spyDisconnectedCallback = jest.fn();
  const spyAttributeChangedCallback = jest.fn();

  class Empty {}

  class MyOwnAttribute extends CustomAttribute {
    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback(name, oldValue, newValue);
      spyAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
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

  class MyOwnAttribute2 {
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

  function MyOwnAttribute3() {}
  MyOwnAttribute3.prototype.attributeChangedCallback = function (
    name,
    oldValue,
    newValue,
  ) {
    spyAttributeChangedCallback.apply(this, [name, oldValue, newValue]);
  };
  MyOwnAttribute3.prototype.connectedCallback = function () {
    spyConnectedCallback.apply(this, []);
  };
  MyOwnAttribute3.prototype.disconnectedCallback = function () {
    spyDisconnectedCallback.apply(this, []);
  };

  const implScenarii = [
    { name: 'with CustomAttribute', impl: MyOwnAttribute },
    { name: 'with classic class', impl: MyOwnAttribute2 },
    { name: 'with es5 class', impl: MyOwnAttribute3 },
  ];

  describe.each(implScenarii)(
    'observeCustomAttribute - $name',
    ({ impl: AttributeImplementation }) => {
      let element;
      let stopObserving;

      beforeEach(() => {
        element = document.createElement('div');
        element.setAttribute('hx-post', 'some-value');

        defineAttribute('hx-post', AttributeImplementation);
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
            AttributeImplementation,
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
            AttributeImplementation,
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
            AttributeImplementation,
          );

          // Assert
          expect(stopObserving).toBeInstanceOf(Function);
        });

        test('it registers the instance only one time', () => {
          // Arrange
          const element = document.createElement('div');
          stopObserving = observeCustomAttribute(
            element,
            'hx-post',
            AttributeImplementation,
          );

          // Act
          observeCustomAttribute(element, 'hx-post', AttributeImplementation);

          // Assert
          expect(getInstancesRegistry().size()).toBe(1);
        });

        test('it does not allow to bind on a template tag', () => {
          // Arrange
          const element = document.createElement('template');
          const t = () => {
            observeCustomAttribute(element, 'hx-post', AttributeImplementation);
          };

          // Act & Assert
          expect(t).toThrow(DOMException);
          expect(t).toThrow(
            `Failed to instantiante the custom attribute "hx-post" on the element: template tags are not allowed`,
          );
        });
      });

      test('it calls the attribute changed callback when the value has changed', async () => {
        // Arrange
        const element = document.createElement('div');
        element.setAttribute('hx-post', 'old-value');

        // Act
        observeCustomAttribute(element, 'hx-post', AttributeImplementation);
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
        observeCustomAttribute(element, 'hx-post', AttributeImplementation);
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
          AttributeImplementation,
        );
        stopObserving();

        element.setAttribute('hx-post', 'some-value');
        await digest();

        // Assert
        expect(spyAttributeChangedCallback).not.toHaveBeenCalled();
      });
    },
  );

  describe('observeCustomAttribute', () => {
    test('it should not fail if not callbacks are provided', async () => {
      // Arrange
      const element = document.createElement('div');
      element.setAttribute('hx-post', 'old-value');

      const t = async () => {
        observeCustomAttribute(element, 'hx-post', Empty);
        element.setAttribute('hx-post', 'some-value');
        await digest();
      };

      // Act & Assert
      expect(t).not.toThrow();
    });
  });
});
