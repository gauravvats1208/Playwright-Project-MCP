// pages/AmazonPage.js

const fs = require('fs');
const path = require('path');

const locators = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'amazon-locators.json'), 'utf-8')
);

class AmazonPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://www.amazon.in/');
    }

    async search(term) {
        const searchBox = this.page.locator(locators.searchBox);
        await searchBox.fill(term);
        await searchBox.press('Enter');
    }

    async clickFirstResult() {
        const firstResult = this.page.locator(locators.firstResult).first();
        await firstResult.waitFor({ state: 'visible', timeout: 20000 });
        await firstResult.click();
    }

    async login(email, password) {
        // Click sign in button
        await this.page.locator(locators.signInButton).click();
        // Fill email and continue
        await this.page.locator(locators.emailInput).fill(email);
        await this.page.locator(locators.continueButton).click();
        // Fill password and sign in
        await this.page.locator(locators.passwordInput).fill(password);
        await this.page.locator(locators.submitSignIn).click();
    }

}

module.exports = { AmazonPage };
