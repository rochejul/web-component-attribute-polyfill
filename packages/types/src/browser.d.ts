declare module '@web-component-attribute-polyfill/browser' {
  import {
    CustomAttribute,
    defineAttribute,
  } from '@web-component-attribute-polyfill/core';

  interface CustomElementRegistryAugmented extends CustomElementRegistry {
    defineAttribute: defineAttribute;
  }

  interface WindowAugmented extends Window {
    CustomAttribute: CustomAttribute;
  }

  export {
    CustomElementRegistryAugmented as CustomElementRegistry,
    WindowAugmented as Window,
  };
}
