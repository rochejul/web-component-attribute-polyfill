import { asyncExec, unsafeAsyncExec } from './exec.js';

export async function updateNpmVersion(versionToUse) {
  await unsafeAsyncExec(
    `npm version ${versionToUse} --include-workspace-root --force -m "chore: release %s"`,
  );
}

export async function updateNpmPackages(versionToUse) {
  await asyncExec(
    `npm version ${versionToUse} --workspaces --no-git-tag-version`,
  );
}

export async function updateNpmWorkspaceDependecy(dependencyName, workspace) {
  await asyncExec(
    `npm uninstall --save ${dependencyName} --workspace=${workspace}`,
  );
  await asyncExec(
    `npm install --save ${dependencyName} --workspace=${workspace}`,
  );
}

export async function publishOnNpmRegistry() {
  await asyncExec(`npm run dev:publish`);
}
