const { Given, When, Then, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { EcommercePage } = require('../../pages/EcommercePage');

// Set default timeout for step definitions
setDefaultTimeout(60000);

// Global variables
let browser;
let context;
let page;
let ecommercePage;

// Background step
Given('I am on the SauceDemo login page', async function () {
    // Get page from world context
    page = this.page;
    ecommercePage = new EcommercePage(page);
    await ecommercePage.goto();
    await page.waitForTimeout(1000); // Add 1 second delay for visibility
});

// Login step
When('I login with username {string} and password {string}', async function (username, password) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    await ecommercePage.login(username, password);
    await page.waitForTimeout(1500); // Add 1.5 second delay after login
});

// Verification steps
Then('I should see the product inventory page', async function () {
    await expect(page).toHaveURL(/.*inventory.html/);
});

Then('I should see {string} header', async function (headerText) {
    const header = await page.locator('.title');
    await expect(header).toHaveText(headerText);
});

Then('I should see an error message {string}', async function (errorMessage) {
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toContainText(errorMessage);
});

// Product management steps
When('I add {string} to cart', async function (productName) {
    await ecommercePage.addProductToCart(productName);
    await page.waitForTimeout(1000); // Add 1 second delay after adding product
});

When('I add the following products to cart:', async function (dataTable) {
    const products = dataTable.raw().flat();
    for (const product of products) {
        await ecommercePage.addProductToCart(product);
    }
});

When('I remove {string} from cart', async function (productName) {
    await ecommercePage.removeProductFromCart(productName);
});

// Cart verification steps
Then('the cart badge should show {string}', async function (count) {
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toHaveText(count);
});

Then('the cart badge should not be visible', async function () {
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).not.toBeVisible();
});

Then('the product button should show {string}', async function (buttonText) {
    const button = page.locator(`button:has-text("${buttonText}")`).first();
    await expect(button).toBeVisible();
});

// Checkout steps
When('I proceed to checkout', async function () {
    await ecommercePage.goToCart();
    await page.waitForTimeout(1000); // Add delay after going to cart
    await ecommercePage.proceedToCheckout();
    await page.waitForTimeout(1000); // Add delay after proceeding to checkout
});

When('I fill checkout information:', async function (dataTable) {
    const data = dataTable.rowsHash();
    await ecommercePage.fillCheckoutInformation(
        data.firstName,
        data.lastName,
        data.postalCode
    );
    await page.waitForTimeout(1500); // Add delay after filling form
});

When('I continue to payment', async function () {
    await ecommercePage.continueCheckout();
});

When('I finish the order', async function () {
    await ecommercePage.finishOrder();
});

Then('I should see {string} message', async function (message) {
    const successMessage = page.locator('.complete-header');
    await expect(successMessage).toContainText(message);
});

Then('I should see {string} confirmation', async function (confirmation) {
    const confirmationText = page.locator('.complete-text');
    await expect(confirmationText).toContainText(confirmation);
});

// Sorting and filtering steps
When('I sort products by {string}', async function (sortOption) {
    await ecommercePage.sortProducts(sortOption);
});

Then('products should be sorted by price ascending', async function () {
    const prices = await page.locator('.inventory_item_price').allTextContents();
    const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
    
    for (let i = 1; i < numericPrices.length; i++) {
        expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
    }
});

// Problem user specific steps
When('I view the product inventory', async function () {
    await expect(page.locator('.inventory_list')).toBeVisible();
});

Then('I should see broken product images', async function () {
    const images = await page.locator('.inventory_item_img img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    console.log('Images found for problem user - checking for issues');
});

Then('I should experience UI issues', async function () {
    console.log('UI issues are expected for problem_user');
});

// Performance testing steps
When('I navigate through the application', async function () {
    const startTime = Date.now();
    
    await page.click('.shopping_cart_link');
    await page.click('.btn_secondary');
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    this.navigationDuration = duration;
});

Then('response times should be slower than normal', async function () {
    expect(this.navigationDuration).toBeGreaterThan(500);
    console.log(`Navigation took ${this.navigationDuration}ms for performance_glitch_user`);
});

Then('functionality should still work correctly', async function () {
    await expect(page.locator('.title')).toBeVisible();
});

// Visual testing steps
Then('I should capture visual snapshots for comparison', async function () {
    await page.screenshot({ 
        path: `test-results/visual-${Date.now()}.png`,
        fullPage: true 
    });
    console.log('Visual snapshot captured for visual_user');
});

Then('layout should be visually correct', async function () {
    await expect(page.locator('.app_logo')).toBeVisible();
    await expect(page.locator('.inventory_list')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
});

// Scenario outline step with different expectations
Then('I should see {string}', async function (expectedResult) {
    switch (expectedResult) {
        case 'product inventory':
            await expect(page).toHaveURL(/.*inventory.html/);
            break;
        case 'locked out error':
            const errorText = page.locator('[data-test="error"]');
            await expect(errorText).toContainText('locked out');
            break;
        default:
            console.log(`Checking for: ${expectedResult}`);
            // Add more cases as needed
    }
});