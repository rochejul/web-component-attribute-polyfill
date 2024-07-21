import { exec } from 'child_process';

export async function asyncExec(cmd) {
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
