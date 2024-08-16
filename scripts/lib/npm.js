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

export async function updateNpmWorkspaceDependecy(
  dependencyName,
  workspace,
  dev = false,
) {
  const saveType = dev ? '--save-dev' : '--save';

  await asyncExec(
    `npm uninstall ${saveType} ${dependencyName} --workspace=${workspace}`,
  );
  await asyncExec(
    `npm install ${saveType} ${dependencyName} --workspace=${workspace}`,
  );
}

export async function publishOnNpmRegistry() {
  await unsafeAsyncExec(`npm run dev:publish`);
}
