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
- [Code of conducts](../../docs/CODE_OF_CONDUCTS.md)
