import {
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
  jest,
} from '@jest/globals';

import { observeAttributes } from '../src/engine.js';
import { CustomAttribute } from '../src/api/customAttribute.js';
import { defineAttribute } from '../src/api/defineAttribute';

import { digest } from './jest.utils.js';

describe('core - engine', () => {
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

  describe('observeAttributes', () => {
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
    });
  });
});
