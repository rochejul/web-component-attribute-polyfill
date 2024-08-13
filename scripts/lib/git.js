import { asyncExec, unsafeAsyncExec } from './exec.js';

export async function stagedModifiedFiles() {
  await asyncExec('git add .');
}

export async function pushOnOrigin() {
  await unsafeAsyncExec(`git push origin --force --no-verify`);
  await unsafeAsyncExec(`git push origin --force --no-verify --tags`);
}
