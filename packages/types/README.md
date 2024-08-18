<p>
    <a href="https://www.npmjs.com/package/@web-component-attribute-polyfill/types">
    <img src="https://img.shields.io/npm/v/@web-component-attribute-polyfill/types" alt="npm version">
  </a>

  <a href="https://github.com/rochejul/web-component-attribute-polyfill/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@web-component-attribute-polyfill/types.svg" alt="license">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@web-component-attribute-polyfill/types">
    <img src="https://packagephobia.now.sh/badge?p=@web-component-attribute-polyfill/types" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/web-component-attribute-polyfilln">
    <img src="https://snyk.io/test/github/rochejul/web-component-attribute-polyfill/badge.svg?targetFile=packages/types/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/web-component-attribute-polyfill/actions/workflows/node.js.yml">
    <img src="https://github.com/rochejul/web-component-attribute-polyfill/actions/workflows/node.js.yml/badge.svg" alt="Node.js Unit Test">
  </a>
</p>

# @web-component-attribute-polyfill/types

Typescript definition of the polyfill

## Usage

```typescript
import type { AttributeName } from '@web-component-attribute-polyfill/core';
import type {
  Window,
  CustomElementRegistry,
} from '@web-component-attribute-polyfill/browser';

import '@web-component-attribute-polyfill/browser';
import { CustomAttribute } from '@web-component-attribute-polyfill/core';

const window = globalThis.window as unknown as Window;
const customElements = window.customElements as CustomElementRegistry;

class BorderStylingAttribute extends CustomAttribute {
  attributeChangedCallback(
    name: AttributeName,
    oldValue: string,
    newValue: string,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.applyColor(newValue);
  }

  connectedCallback() {
    super.connectedCallback();

    const element = this.element as HTMLElement;

    element.style.padding = '1rem';
    element.style.border = '3px solid black';
    element.style.borderRadius = '1rem';
    this.applyColor();
  }

  applyColor(styling: string = 'default') {
    const element = this.element as HTMLElement;

    if (styling === 'variant') {
      element.style.borderColor = 'red';
    } else {
      element.style.borderColor = 'black';
    }
  }
}

customElements.defineAttribute('border-styling', BorderStylingAttribute);
```

## Commands

- `npm run dev:build`: Generate the typings from Typescrip's definition files
- `npm test`: Ensure we define correclty the definitions

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
