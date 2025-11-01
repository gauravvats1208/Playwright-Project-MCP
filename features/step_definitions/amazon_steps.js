const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { AmazonPage } = require('../../pages/AmazonPage');

Given('I am on the Amazon India homepage', async function () {
  this.amazon = new AmazonPage(this.page);
  await this.amazon.goto();
});

When('I search for {string}', async function (searchTerm) {
  await this.amazon.search(searchTerm);
});


When('I click on the first product result', async function () {
  await this.amazon.clickFirstResult();
});

When('I click on the sign in button', async function () {
  const locators = require('../../pages/amazon-locators.json');
  const accountList = this.page.locator(locators.signInButton);
  await accountList.hover();
  // The sign in button appears in the dropdown after hover
  // Try to click the sign in button in the dropdown
  // If the dropdown sign in button has a different selector, add it to the JSON and use it here
  await accountList.click();
});

When('I login with email {string} and password {string}', async function (email, password) {
  const locators = require('../../pages/amazon-locators.json');
  const emailInput = this.page.locator(locators.emailInput);
  await emailInput.waitFor({ state: 'visible', timeout: 20000 });
  await emailInput.fill(email);
  await this.page.locator(locators.continueButton).click();
  const passwordInput = this.page.locator(locators.passwordInput);
  await passwordInput.waitFor({ state: 'visible', timeout: 20000 });
  await passwordInput.fill(password);
  await this.page.locator(locators.submitSignIn).click();
});

Then('I should see that I am signed in', async function () {
  const greeting = await this.page.locator(require('../../pages/amazon-locators.json').accountGreeting).textContent();
  if (!greeting.match(/Hello|Account|Gaurav/i)) {
    throw new Error('User is not signed in');
  }
});

Then('I should be on the product details page', async function () {
  await expect(this.page).toHaveURL(/amazon\.in/);
});
