// example.spec.js
// Example Playwright test


const { test, expect } = require('@playwright/test');
const { AmazonPage } = require('../pages/AmazonPage');

test('basic test', async ({ page }) => {
    const amazon = new AmazonPage(page);
    await amazon.goto();
    await amazon.search('Wifi extender');
    await amazon.clickFirstResult();
    await expect(page).toHaveURL(/amazon\.in/);

});
