import { asyncExec } from './exec.js';

export async function stagedModifiedFiles() {
  await asyncExec('git add .');
}

export async function pushOnOrigin() {
  await asyncExec(`git push origin --force --no-verify`);
  await asyncExec(`git push origin --force --no-verify --tags`);
}
