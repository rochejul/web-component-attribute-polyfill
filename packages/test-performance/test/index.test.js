/* eslint-disable jest/expect-expect */
import { benchmark } from 'kelonio';
import { describe, test, beforeAll } from '@jest/globals';
import { CustomAttribute } from '@web-component-attribute-polyfill/core';
import '@web-component-attribute-polyfill/browser';
import { digest } from '@web-component-attribute-polyfill/jest-utils';

describe('performance - index', () => {
  let resolveAttributeChangedCallback;
  let resolveConnectedCallback;
  let resolveDisconnectedCallback;

  class MyOwnAttribute extends CustomAttribute {
    attributeChangedCallback() {
      resolveAttributeChangedCallback?.();
    }

    connectedCallback() {
      resolveConnectedCallback?.();
    }

    disconnectedCallback() {
      resolveDisconnectedCallback?.();
    }
  }

  beforeAll(() => {
    globalThis.customElements.defineAttribute('hx-post', MyOwnAttribute);
  });

  test('connectedCallback performance', async () => {
    await benchmark.record(
      'Performance#connectedCallback',
      async () => {
        // Arrange
        let { promise, resolve } = Promise.withResolvers();
        resolveConnectedCallback = resolve;

        // Act
        const element = document.createElement('div');
        element.setAttribute('hx-post', 'old-value');
        document.body.appendChild(element);

        // Assert
        return promise;
      },
      { iterations: 1_000, meanUnder: 5 },
    );
  }, 1_000);

  test('attributeChangedCallback  performance', async () => {
    await benchmark.record(
      'Performance#attributeChangedCallback',
      async () => {
        // Arrange
        const element = document.createElement('div');
        element.setAttribute('hx-post', 'old-value');
        document.body.appendChild(element);
        await digest();

        let { promise, resolve } = Promise.withResolvers();
        resolveAttributeChangedCallback = resolve;

        // Act
        element.setAttribute('hx-post', 'new-value');

        // Assert
        return promise;
      },
      { iterations: 1_000, meanUnder: 5 },
    );
  }, 1_000);

  test('disconnectedCallback performance', async () => {
    await benchmark.record(
      'Performance#disconnectedCallback',
      async () => {
        // Arrange
        const element = document.createElement('div');
        element.setAttribute('hx-post', 'old-value');
        document.body.appendChild(element);
        await digest();

        let { promise, resolve } = Promise.withResolvers();
        resolveDisconnectedCallback = resolve;

        // Act
        document.body.removeChild(element);
        await digest();

        // Assert
        return promise;
      },
      { iterations: 1_000, meanUnder: 5 },
    );
  }, 500);
});
