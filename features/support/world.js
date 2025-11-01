const { setWorldConstructor, setDefaultTimeout, Before } = require('@cucumber/cucumber');
const { chromium } = require('playwright');

class CustomWorld {
  async launchBrowser() {
    this.browser = await chromium.launch({ headless: false });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }
  async closeBrowser() {
    if (this.browser) await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);

Before(async function () {
  await this.launchBrowser();
});

// Optionally, you can add After hook to close browser after each scenario
const { After } = require('@cucumber/cucumber');
After(async function () {
  await this.closeBrowser();
});
