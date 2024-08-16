import { readFileSync } from 'fs';
import { resolve, join } from 'path';

import semverInc from 'semver/functions/inc.js';
import { select } from '@inquirer/prompts';

import { stagedModifiedFiles, pushOnOrigin } from './lib/git.js';
import {
  updateNpmPackages,
  updateNpmWorkspaceDependecy,
  updateNpmVersion,
  publishOnNpmRegistry,
} from './lib/npm.js';
import { promptConfirm } from './lib/prompt.js';

const __dirname = import.meta.dirname;
const packageJsonFilePath = resolve(join(__dirname, '../package.json'));
const packageJSON = JSON.parse(readFileSync(packageJsonFilePath));
const currentVersion = packageJSON.version;
let versionToUse;

console.info('Current project version:', currentVersion);

if (currentVersion.includes('-beta.')) {
  versionToUse = await select({
    message: 'Do you want to release?',
    choices: [
      {
        name: `No (next version: ${semverInc(currentVersion, 'prerelease', true, 'beta')})`,
        value: semverInc(currentVersion, 'prepatch', true, 'beta'),
      },
      {
        name: `Yes (next version: ${currentVersion.split('-')[0]})`,
        value: currentVersion.split('-')[0],
      },
    ],
  });
} else {
  versionToUse = await select({
    message: 'What kind of bump do you want to do?',
    choices: [
      {
        name: `Major (next version: ${semverInc(currentVersion, 'major')})`,
        value: semverInc(currentVersion, 'major'),
      },
      {
        name: `Major beta (next version: ${semverInc(currentVersion, 'premajor', true, 'beta')})`,
        value: semverInc(currentVersion, 'premajor', true, 'beta'),
      },
      {
        name: `Minor (next version: ${semverInc(currentVersion, 'minor')})`,
        value: semverInc(currentVersion, 'minor'),
      },
      {
        name: `Minor beta (next version: ${semverInc(currentVersion, 'preminor', true, 'beta')})`,
        value: semverInc(currentVersion, 'preminor', true, 'beta'),
      },
      {
        name: `Patch (next version: ${semverInc(currentVersion, 'patch')})`,
        value: semverInc(currentVersion, 'patch'),
      },
      {
        name: `Patch beta (next version: ${semverInc(currentVersion, 'prepatch', true, 'beta')})`,
        value: semverInc(currentVersion, 'prepatch', true, 'beta'),
      },
    ],
  });
}

console.info('Next project version:', versionToUse);
const proceed = await promptConfirm('Do you want to proceed?');

if (proceed) {
  // Update packages
  await updateNpmPackages(versionToUse);

  // Demos
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/browser',
    'demos/vanilla',
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/types',
    'demos/vanilla',
  );

  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/browser',
    'demos/typescript',
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/types',
    'demos/typescript',
  );

  // Packages
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/core',
    'packages/browser',
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/jest-utils',
    'packages/browser',
    true,
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/jest-utils',
    'packages/core',
    true,
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/core',
    'packages/types',
  );
  await updateNpmWorkspaceDependecy(
    '@web-component-attribute-polyfill/browser',
    'packages/types',
  );

  // Final step
  await stagedModifiedFiles();
  await updateNpmVersion(versionToUse);

  const push = await promptConfirm('Do you want to push on remote?');

  if (push) {
    await pushOnOrigin();
  }

  const publish = await promptConfirm('Do you want to publish on NPM?');

  if (publish) {
    await publishOnNpmRegistry();
  }
}
