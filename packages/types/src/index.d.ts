import { CustomAttribute, DefineAttribute } from './api';

declare global {
  interface CustomElementRegistryAugmented extends CustomElementRegistry {
    defineAttribute: DefineAttribute;
  }

  interface WindowAugmented extends Window {
    CustomAttribute: CustomAttribute;
  }
}

export {
  CustomAttribute,
  DefineAttribute,
  CustomElementRegistryAugmented as CustomElementRegistry,
  WindowAugmented as Window,
};
