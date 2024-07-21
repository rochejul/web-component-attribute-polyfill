import type {
  Window,
  CustomElementRegistry,
} from '@web-component-attribute-polyfill/browser';

class MyCustomAttribute {}

const window = globalThis.window as unknown as Window;
const { defineAttribute } = window.customElements as CustomElementRegistry;

// THROWS Expected 2 arguments, but got 0
defineAttribute();

// THROWS Expected 2 arguments, but got 1
defineAttribute(undefined);

// THROWS Expected 2 arguments, but got 1
defineAttribute(null);

// THROWS Expected 2 arguments, but got 1
defineAttribute(55);

defineAttribute('xhr-post', undefined);
defineAttribute('xhr-get', null);

// THROWS Argument of type 'string' is not assignable to parameter of type 'NonNullable<AttributeImplType>'
defineAttribute('xhr-put', '');

defineAttribute(undefined, MyCustomAttribute);
defineAttribute(null, MyCustomAttribute);
defineAttribute('', MyCustomAttribute);
defineAttribute('xhr delete', MyCustomAttribute);
defineAttribute('xhr-delete-', MyCustomAttribute);
defineAttribute('-xhr-delete', MyCustomAttribute);
defineAttribute('data-delete', MyCustomAttribute);
