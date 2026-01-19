const { test, expect } = require('@playwright/test');
const { EcommercePage } = require('../pages/EcommercePage');

test.describe('SauceDemo Basic E-commerce Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        await ecommercePage.goto();
    });

    test('should login with valid credentials', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Verify successful login
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.inventory_container')).toBeVisible();
        await expect(page.locator('.app_logo')).toContainText('Swag Labs');
    });

    test('should show error for invalid credentials', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('invalid_user', 'wrong_password');
        
        // Verify error message
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    });

    test('should prevent locked out user from logging in', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('locked_out_user', 'secret_sauce');
        
        // Verify locked out error
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    });

    test('should display all products after login', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Verify products are displayed
        const productCount = await ecommercePage.getProductList();
        expect(productCount).toBe(6); // SauceDemo has 6 products
        
        // Verify specific products exist
        await expect(page.locator('.inventory_item').first()).toBeVisible();
        await expect(page.locator('.inventory_item_name').first()).toBeVisible();
        await expect(page.locator('.inventory_item_price').first()).toBeVisible();
    });

    test('should add product to cart', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        
        // Verify cart badge appears with count
        await expect(page.locator('.shopping_cart_badge')).toBeVisible();
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        
        // Verify button text changes
        await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    });

    test('should complete full purchase workflow', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Login and add products
        await ecommercePage.login('standard_user', 'secret_sauce');
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await ecommercePage.addProductToCart('sauce-labs-bike-light');
        
        // Go to cart and verify items
        await ecommercePage.goToCart();
        await expect(page.locator('.cart_item')).toHaveCount(2);
        
        // Proceed to checkout
        await ecommercePage.proceedToCheckout();
        await expect(page).toHaveURL(/checkout-step-one/);
        
        // Fill checkout information
        await ecommercePage.fillCheckoutInformation('John', 'Doe', '12345');
        await expect(page).toHaveURL(/checkout-step-two/);
        
        // Complete order
        await ecommercePage.completeOrder();
        
        // Verify order completion
        await expect(page).toHaveURL(/checkout-complete/);
        const confirmationText = await ecommercePage.getOrderConfirmation();
        expect(confirmationText).toContain('Thank you for your order!');
    });

    test('should sort products by price', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Sort by price low to high
        await ecommercePage.sortProducts('lohi');
        const pricesLowToHigh = await ecommercePage.getProductPrices();
        
        // Verify ascending order
        for (let i = 0; i < pricesLowToHigh.length - 1; i++) {
            expect(pricesLowToHigh[i]).toBeLessThanOrEqual(pricesLowToHigh[i + 1]);
        }
        
        // Sort by price high to low
        await ecommercePage.sortProducts('hilo');
        const pricesHighToLow = await ecommercePage.getProductPrices();
        
        // Verify descending order
        for (let i = 0; i < pricesHighToLow.length - 1; i++) {
            expect(pricesHighToLow[i]).toBeGreaterThanOrEqual(pricesHighToLow[i + 1]);
        }
    });

    test('should handle problem user scenarios', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('problem_user', 'secret_sauce');
        
        // Problem user should still be able to login
        await expect(page).toHaveURL(/inventory/);
        
        // Check if images might be broken (problem_user known issue)
        const images = await page.locator('.inventory_item_img img').all();
        
        // At least verify images exist (even if they might be broken)
        expect(images.length).toBeGreaterThan(0);
        
        // Try to add product (should work despite UI issues)
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        await ecommercePage.logout();
        
        // Verify back to login page
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.locator('#login-button')).toBeVisible();
    });

    test('should validate checkout form', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await ecommercePage.goToCart();
        await ecommercePage.proceedToCheckout();
        
        // Try to continue without filling required fields
        await page.locator('#continue').click();
        
        // Verify error message for missing first name
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
    });

    test('should handle performance with glitch user', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Track login time
        const startTime = Date.now();
        await ecommercePage.login('performance_glitch_user', 'secret_sauce');
        const loginTime = Date.now() - startTime;
        
        // Should still login successfully (though slower)
        await expect(page).toHaveURL(/inventory/);
        
        console.log(`Performance glitch user login time: ${loginTime}ms`);
        
        // Performance glitch user typically takes longer
        // We don't assert on specific time as it varies by system
    });
});

test.describe('SauceDemo Cart Operations', () => {
    
    test.beforeEach(async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        await ecommercePage.goto();
        await ecommercePage.login('standard_user', 'secret_sauce');
    });

    test('should remove item from cart', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Add item then remove it
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        
        // Remove item
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        
        // Cart badge should disappear
        await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });

    test('should continue shopping from cart', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await ecommercePage.goToCart();
        
        // Click continue shopping
        await page.locator('#continue-shopping').click();
        
        // Should return to inventory
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.inventory_container')).toBeVisible();
    });

    test('should display correct cart item details', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await ecommercePage.goToCart();
        
        // Verify item details in cart
        await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
        await expect(page.locator('.inventory_item_price')).toHaveText('$29.99');
        await expect(page.locator('.cart_quantity')).toHaveText('1');
    });
});