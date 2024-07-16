# Guidelines

## Ide: Vscode

The project was provided with [Vscode](https://code.visualstudio.com/) and then contains some configuration to deal with [NPM's workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

We could find some configuration to run the Vscode's [jest plugin](https://github.com/jest-community/vscode-jest) and [jest-runner plugin](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner), [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [typescript](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next), to use their debugger mode, coverage, build, etc...

Ensure to have these plugins and you will have for free the same env with everything configured

## Workspaces

The project uses the [NPM's workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).
It means you have to use the NPM's command to deal with workspaces

### New package

If you need to create the new package, run the following command at the rood of the project:

```bash
npm init -w ./packages/a
```

The new package will be declared with the same project's version, will be declared in the ` package-lock.json` file, etc...

If this package needs ` jest`, ensure in the ` vscode.settings.json` to update the config:

```json
"jest.virtualFolders": [{ "name": "core", "rootPath": "packages/core" }]
```

### Add a dependency between packages

If you need to add a common dependency, please on the root of the project:

```bash
npm install --save-dev mydep
```

### Link a package on another package

If you need a package on another one, please on the root of the project:

```bash
npm install --save @web-component-attribute-polyfill/core --workspace=packages/browse
```
