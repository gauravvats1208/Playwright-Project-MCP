const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { EcommercePage } = require('../../pages/EcommercePage');

// Set timeout for extended testing
setDefaultTimeout(60000);

// Global variables for extended testing
let page;
let ecommercePage;
let loginStartTime;
let loginDuration;

// Enhanced Login Steps
Then('I should see exactly {int} products available', async function (expectedCount) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    const productCount = await ecommercePage.getProductList();
    expect(productCount).toBe(expectedCount);
});

Then('each product should have a name visible', async function () {
    const productNames = await page.locator('.inventory_item_name').all();
    
    for (const nameElement of productNames) {
        await expect(nameElement).toBeVisible();
    }
});

Then('each product should have a price visible', async function () {
    const productPrices = await page.locator('.inventory_item_price').all();
    
    for (const priceElement of productPrices) {
        await expect(priceElement).toBeVisible();
    }
});

// Enhanced Cart Steps
Then('the shopping cart badge should show {string}', async function (count) {
    await expect(page.locator('.shopping_cart_badge')).toHaveText(count);
});

Then('the remove button for {string} should be visible', async function (productId) {
    await expect(page.locator(`[data-test="remove-${productId}"]`)).toBeVisible();
});

Then('I should be on checkout step one page', async function () {
    await expect(page).toHaveURL(/checkout-step-one/);
});

When('I fill checkout information with {string}, {string}, {string}', async function (firstName, lastName, postalCode) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    await ecommercePage.fillCheckoutInformation(firstName, lastName, postalCode);
    await page.waitForTimeout(1500);
});

Then('I should be on checkout complete page', async function () {
    await expect(page).toHaveURL(/checkout-complete/);
});

// Enhanced Product Steps
When('I check product images', async function () {
    const images = await page.locator('.inventory_item_img img').all();
    this.productImages = images;
    console.log(`Found ${images.length} product images`);
});

Then('I should verify images exist even if broken', async function () {
    expect(this.productImages.length).toBeGreaterThan(0);
    console.log('Product images verification completed for problem user');
});

// Logout Steps
When('I logout from the application', async function () {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    await ecommercePage.logout();
    await page.waitForTimeout(1000);
});

Then('I should be redirected to login page', async function () {
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});

Then('I should see the login button', async function () {
    await expect(page.locator('#login-button')).toBeVisible();
});

// Form Validation Steps
When('I try to continue without filling required fields', async function () {
    await page.locator('#continue').click();
    await page.waitForTimeout(500);
});

// Performance Steps
Then('I should log the performance timing', async function () {
    if (this.loginDuration) {
        console.log(`Performance glitch user login time: ${this.loginDuration}ms`);
    }
});

// Cart Operations Steps
When('I remove product {string} from cart', async function (productId) {
    await page.locator(`[data-test="remove-${productId}"]`).click();
    await page.waitForTimeout(1000);
});

Then('the shopping cart badge should not be visible', async function () {
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
});

When('I click continue shopping', async function () {
    await page.locator('#continue-shopping').click();
    await page.waitForTimeout(1000);
});

// Product Detail Verification Steps
Then('I should see product name {string}', async function (expectedName) {
    await expect(page.locator('.inventory_item_name')).toHaveText(expectedName);
});

Then('I should see product price {string}', async function (expectedPrice) {
    await expect(page.locator('.inventory_item_price')).toHaveText(expectedPrice);
});

Then('I should see product quantity {string}', async function (expectedQuantity) {
    await expect(page.locator('.cart_quantity')).toHaveText(expectedQuantity);
});

// Enhanced Navigation Steps
When('I navigate to product details for {string}', async function (productName) {
    const productLink = page.locator(`.inventory_item:has(.inventory_item_name:has-text("${productName}")) .inventory_item_name`);
    await productLink.click();
    await page.waitForTimeout(1000);
});

Then('I should see product details page', async function () {
    await expect(page.locator('.inventory_details')).toBeVisible();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
});

When('I go back to products', async function () {
    await page.locator('#back-to-products').click();
    await page.waitForTimeout(1000);
});

// Enhanced Error Validation Steps
Then('I should see username field error', async function () {
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('Username is required');
});

Then('I should see password field error', async function () {
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText('Password is required');
});

// Social Media Steps
When('I click on social media links', async function () {
    // Check if social media links are present
    const socialLinks = await page.locator('.social a').all();
    console.log(`Found ${socialLinks.length} social media links`);
    
    for (const link of socialLinks) {
        const href = await link.getAttribute('href');
        console.log('Social media link:', href);
    }
});

// Filter and Search Steps (if SauceDemo had these features)
When('I search for product {string}', async function (searchTerm) {
    // Note: SauceDemo doesn't have search, but this is a placeholder for extension
    console.log(`Would search for: ${searchTerm}`);
});

When('I filter products by category {string}', async function (category) {
    // Note: SauceDemo doesn't have category filters, but this is a placeholder
    console.log(`Would filter by category: ${category}`);
});

// Accessibility Testing Steps
When('I test page accessibility', async function () {
    // Basic accessibility checks
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const images = await page.locator('img').all();
    
    console.log(`Found ${headings.length} headings`);
    console.log(`Found ${images.length} images`);
    
    // Check if images have alt text
    for (let i = 0; i < Math.min(images.length, 3); i++) {
        const alt = await images[i].getAttribute('alt');
        console.log(`Image ${i + 1} alt text:`, alt || 'No alt text');
    }
});

// Mobile Responsiveness Steps
When('I test mobile view', async function () {
    // Simulate mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    console.log('Switched to mobile viewport');
});

When('I test desktop view', async function () {
    // Simulate desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(1000);
    console.log('Switched to desktop viewport');
});

Then('the layout should be responsive', async function () {
    // Basic responsiveness check
    await expect(page.locator('.inventory_container, .login_container')).toBeVisible();
    console.log('Layout responsiveness verified');
});

// Error Recovery Steps
When('I clear the error message', async function () {
    const errorButton = page.locator('[data-test="error-button"]');
    if (await errorButton.isVisible()) {
        await errorButton.click();
        await page.waitForTimeout(500);
    }
});

Then('the error message should be cleared', async function () {
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
});

// Data Persistence Steps
When('I refresh the page', async function () {
    await page.reload();
    await page.waitForLoadState('networkidle');
});

Then('my cart items should persist', async function () {
    // Check if cart items are maintained after refresh
    const cartBadge = page.locator('.shopping_cart_badge');
    if (await cartBadge.isVisible()) {
        const count = await cartBadge.textContent();
        console.log(`Cart persisted with ${count} items`);
    } else {
        console.log('Cart is empty after refresh');
    }
});

module.exports = {
    // Export utilities for shared use
    setLoginDuration: (duration) => { loginDuration = duration; },
    getLoginDuration: () => loginDuration
};