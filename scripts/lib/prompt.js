import { select } from '@inquirer/prompts';

export async function promptConfirm(message) {
  return select({
    message,
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
}
