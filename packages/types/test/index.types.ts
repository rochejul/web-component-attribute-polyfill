import type {
  Window,
  CustomElementRegistry,
} from '@web-component-attribute-polyfill/browser';

import { CustomAttribute } from '@web-component-attribute-polyfill/core';

const window = globalThis.window as unknown as Window;
const { defineAttribute } = window.customElements as CustomElementRegistry;

class MyCustomAttribute {}

class AnotherCustomAttribute extends CustomAttribute {}

function Es5Constructor() {}
Es5Constructor.prototype.connectedCallback();
Es5Constructor.prototype.disconnectedCallback();
Es5Constructor.prototype.attributeChangedCallback();

defineAttribute('xhr-post', CustomAttribute);
defineAttribute('xhr-get', MyCustomAttribute);
defineAttribute('xhr-put', Es5Constructor);
defineAttribute('xhr-delete', AnotherCustomAttribute);
