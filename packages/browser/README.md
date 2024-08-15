<p>
    <a href="https://www.npmjs.com/package/@web-component-attribute-polyfill/browser">
    <img src="https://img.shields.io/npm/v/@web-component-attribute-polyfill/browser" alt="npm version">
  </a>

  <a href="https://packagephobia.now.sh/result?p=@web-component-attribute-polyfill/browser">
    <img src="https://packagephobia.now.sh/badge?p=@web-component-attribute-polyfill/browser" alt="install size">
  </a>

  <a href="https://snyk.io/test/github/rochejul/web-component-attribute-polyfill">
    <img src="https://snyk.io/test/github/rochejul/web-component-attribute-polyfill/badge.svg?targetFile=packages/browser/package.json" alt="Known Vulnerabilities">
  </a>

  <a href="https://github.com/rochejul/web-component-attribute-polyfill/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@web-component-attribute-polyfill/browser.svg" alt="license">
  </a>
</p>

# @web-component-attribute-polyfill/browser

Package to load the polyfill into a browser

## Usage

Ensure to import the polyfill, through an import:

```js
import * as polyfill from '@web-component-attribute-polyfill/browser';
```

Or from the HTML `script` tag:

```html
<script defer="defer" src="./node_modules/@web-component-attribute-polyfill/browser/build/bundle.js">
```

You could find in the [build folder](./build/) various targets

## Commands

- `npm run dev:build`: Bundle the package for various targets
- `npm run dev:linting`: Lint files
- `npm test`: Run tests
- `npm run test:coverage`: Run tests and see coverage reports

## Contributing

- [Guidelines](../../docs/GUIDELINES.md)
- [Contributing](../../docs/CONTRIBUTING.md)
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
