import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import { exec } from 'child_process';

import semverInc from 'semver/functions/inc.js';
import { select } from '@inquirer/prompts';

async function asyncExec(cmd) {
  console.info(cmd);
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`);
        reject();
        return;
      }
      if (stderr) {
        console.error(stderr);
        reject();
        return;
      }
      console.log(stdout);
      resolve();
    });
  });
}

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
        name: `No (next version: ${semverInc(currentVersion, 'prepatch', true, 'beta')})`,
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
const proceed = await select({
  message: 'Do you want to proceed?',
  choices: [
    {
      name: `No`,
      value: false,
    },
    {
      name: `Yes`,
      value: true,
    },
  ],
});

if (proceed) {
  // Update packages
  await asyncExec(
    `npm version ${versionToUse} --workspaces --no-git-tag-version`,
  );

  // Demos
  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/browser--workspace=demos/vanilla`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/browser --workspace=demos/vanilla`,
  );
  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/types--workspace=demos/vanilla`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/types --workspace=demos/vanilla`,
  );

  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/browser--workspace=demos/typescript`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/browser --workspace=demos/typescript`,
  );
  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/types--workspace=demos/typescript`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/types --workspace=demos/typescript`,
  );

  // Packages
  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/core --workspace=packages/browser`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/core --workspace=packages/browser`,
  );
  await asyncExec(
    `npm uninstall --save @web-component-attribute-polyfill/core --workspace=packages/types`,
  );
  await asyncExec(
    `npm install --save @web-component-attribute-polyfill/core --workspace=packages/types`,
  );

  // Final step
  await asyncExec('git add .');

  try {
    await asyncExec(
      `npm version ${versionToUse} --include-workspace-root --force -m "chore: release %s"`,
    );
    // eslint-disable-next-line no-unused-vars
  } catch (e) {
    // nothing to do
  }

  const push = await select({
    message: 'Do you want to push on remote?',
    choices: [
      {
        name: `No`,
        value: false,
      },
      {
        name: `Yes`,
        value: true,
      },
    ],
  });

  if (push) {
    await asyncExec(`git push origin --no-verify`);
    await asyncExec(`git push origin --no-verify --tags`);
  }

  const publish = await select({
    message: 'Do you want to publish on NPM?',
    choices: [
      {
        name: `No`,
        value: false,
      },
      {
        name: `Yes`,
        value: true,
      },
    ],
  });

  if (publish) {
    await asyncExec(`npm run dev:publish`);
  }
}
