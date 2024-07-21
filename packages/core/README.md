<p>
    <a href="https://www.npmjs.com/package/@web-component-attribute-polyfill/core">
    <img src="https://img.shields.io/npm/v/@web-component-attribute-polyfill/core" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@web-component-attribute-polyfill/core">
    <img src="https://packagephobia.now.sh/badge?p=@web-component-attribute-polyfill/core" alt="install size">
  </a>

  <a href="https://github.com/rochejul/web-component-attribute-polyfill/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@web-component-attribute-polyfill/core.svg" alt="license">
  </a>
</p>

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
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
