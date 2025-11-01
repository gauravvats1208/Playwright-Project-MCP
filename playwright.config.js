// playwright.config.js
// Basic Playwright configuration

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    browserName: 'chromium',
    headless: false, // Set to true for headless mode
    screenshot: 'only-on-failure', // Capture screenshots only on test failure
  },
};

module.exports = config;
