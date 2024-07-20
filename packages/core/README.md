# @web-component-attribute-polyfill/core

Core logic of the polyfill with the observations of the mutations of the elements and attributes, etc...

## Usage

```js
import {
  defineAttribute,
  enableClosedShadowRoot,
  observeAttributes,
  CustomAttribute,
} from '@web-component-attribute-polyfill/core';

class BorderStylingAttribute extends CustomAttribute {
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.applyColor(newValue);
  }

  connectedCallback() {
    super.connectedCallback();
    this.element.style.padding = '1rem';
    this.element.style.border = '3px solid black';
    this.element.style.borderRadius = '1rem';
    this.applyColor();
  }

  applyColor(styling) {
    if (styling === 'variant') {
      this.element.style.borderColor = 'red';
    } else {
      this.element.style.borderColor = 'black';
    }
  }
}

defineAttribute('border-styling', BorderStylingAttribute);
enableClosedShadowRoot(globalThis); // If we want to be able to look on closed shadow dom

globalThis.addEventListener('DOMContentLoaded', () => {
  observeAttributes();
});
```

## Commands

- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
