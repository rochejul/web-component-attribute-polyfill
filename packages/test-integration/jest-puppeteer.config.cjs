/** @type {import('jest-environment-puppeteer').JestPuppeteerConfig} */
module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
    product: 'chrome',
    acceptInsecureCerts: true,
    args: [
      '--allow-insecure-localhost',
      '--disable-dev-shm-usage',
      '--ignore-certificate-errors',
      '--enable-features=NetworkService',
    ],
  },
  server: {
    command: 'npm start',
    debug: true,
    port: 4444,
  },
  browserContext: 'default',
};
