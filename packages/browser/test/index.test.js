import { describe, test, expect, jest } from '@jest/globals';
import { CustomAttribute } from '@web-component-attribute-polyfill/core';
import { digest } from './jest.utils.js';
import '../src/index.js';

describe('core - index', () => {
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

  test('it exposes on the CustomAttribute class on the global context', () => {
    // Assert
    expect(globalThis.CustomAttribute).toBeDefined();
  });

  test('it exposes on the customElement property the defineAttribute method', () => {
    // Assert
    expect(globalThis.customElements.defineAttribute).toStrictEqual(
      expect.any(Function),
    );
  });

  test('it executes the engine each time we add a new custom attribute on the registry', async () => {
    // Arrange
    const element = document.createElement('div');
    element.setAttribute('hx-post', 'old-value');
    document.body.appendChild(element);

    // Act
    globalThis.customElements.defineAttribute('hx-post', MyOwnAttribute);
    await digest();

    // Assert
    expect(spyConnectedCallback).toHaveBeenCalledTimes(1);
  });
});
