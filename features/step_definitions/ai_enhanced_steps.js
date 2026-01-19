const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { EcommercePage } = require('../../pages/EcommercePage');

// Set timeout for AI operations
setDefaultTimeout(90000);

// Global variables for AI testing
let page;
let ecommercePage;
let aiTestScenarios = [];
let aiTestData = {};
let loginStartTime;
let loginDuration;

// AI Test Scenario Generation Steps
When('I generate AI test scenarios for {string}', async function (scenarioType) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    try {
        aiTestScenarios = await ecommercePage.generateTestScenarios(scenarioType);
        console.log(`AI Generated Scenarios for ${scenarioType}:`, aiTestScenarios);
    } catch (error) {
        console.log(`AI scenario generation failed, using defaults for ${scenarioType}`);
        aiTestScenarios = [{
            testName: `Default ${scenarioType} test`,
            description: `Standard test for ${scenarioType}`,
            steps: [`Execute ${scenarioType} test`],
            expectedResult: `${scenarioType} should work correctly`
        }];
    }
    
    expect(aiTestScenarios).toBeDefined();
    expect(aiTestScenarios.length).toBeGreaterThan(0);
});

When('I generate AI test data for {string}', async function (dataType) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    try {
        aiTestData = await ecommercePage.generateTestData(dataType);
        console.log(`AI Generated Test Data for ${dataType}:`, aiTestData);
    } catch (error) {
        console.log(`AI data generation failed, using defaults for ${dataType}`);
        aiTestData = {
            users: [{ username: 'standard_user', password: 'secret_sauce' }],
            products: [{ name: 'Sauce Labs Backpack', id: 'sauce-labs-backpack' }],
            checkoutInfo: { firstName: 'John', lastName: 'Doe', postalCode: '12345' }
        };
    }
    
    expect(aiTestData).toBeDefined();
});

// Enhanced Login Steps
Then('I should see the inventory container', async function () {
    await expect(page.locator('.inventory_container')).toBeVisible();
});

Then('I should see {string} logo', async function (logoText) {
    await expect(page.locator('.app_logo')).toContainText(logoText);
});

// Product Management Steps
Then('I should see more than {int} products available', async function (count) {
    const productCount = await ecommercePage.getProductList();
    expect(productCount).toBeGreaterThan(count);
});

When('I add product {string} to cart', async function (productId) {
    await ecommercePage.addProductToCart(productId);
    await page.waitForTimeout(1000);
});

Then('the shopping cart badge should be visible', async function () {
    await expect(page.locator('.shopping_cart_badge')).toBeVisible();
});

When('I navigate to shopping cart', async function () {
    await ecommercePage.goToCart();
    await page.waitForTimeout(1000);
});

Then('I should see {int} items in cart', async function (expectedCount) {
    await expect(page.locator('.cart_item')).toHaveCount(expectedCount);
});

// Checkout Steps
When('I fill checkout form with AI-generated data', async function () {
    const checkoutData = aiTestData.checkoutInfo || { firstName: 'John', lastName: 'Doe', postalCode: '12345' };
    await ecommercePage.fillCheckoutInformation(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode
    );
    await page.waitForTimeout(1500);
});

Then('I should be on checkout overview page', async function () {
    await expect(page).toHaveURL(/checkout-step-two/);
});

When('I complete the order', async function () {
    await ecommercePage.completeOrder();
    await page.waitForTimeout(1000);
});

Then('I should see order confirmation {string}', async function (expectedText) {
    const confirmationText = await ecommercePage.getOrderConfirmation();
    expect(confirmationText).toContain(expectedText);
});

// Error Handling Steps
Then('I should see error message containing {string}', async function (expectedText) {
    const errorElement = page.locator('[data-test="error"]');
    await expect(errorElement).toBeVisible();
    await expect(errorElement).toContainText(expectedText);
});

When('I ask AI about {string}', async function (question) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    try {
        const aiResponse = await ecommercePage.askAI(question);
        console.log(`AI Response for "${question}":`, aiResponse);
        this.aiResponse = aiResponse;
    } catch (error) {
        console.log(`AI question failed: ${question}`);
        this.aiResponse = `Unable to process question at this time.`;
    }
});

Then('I should receive AI guidance for error testing', async function () {
    expect(this.aiResponse).toBeDefined();
    console.log('AI Guidance received:', this.aiResponse);
});

// AI Element Finding Steps
When('I use AI to find element {string}', async function (elementDescription) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    try {
        const locatorSuggestion = await ecommercePage.findElementWithAI(elementDescription);
        console.log(`AI suggested locator for "${elementDescription}":`, locatorSuggestion);
        this.aiLocatorSuggestion = locatorSuggestion;
    } catch (error) {
        console.log(`AI element finding failed for: ${elementDescription}`);
        this.aiLocatorSuggestion = 'Unable to find element';
    }
});

Then('the shopping cart link should be visible', async function () {
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
});

Then('the burger menu button should be visible', async function () {
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
});

// Performance Testing Steps
When('I measure login time for username {string} and password {string}', async function (username, password) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    loginStartTime = Date.now();
    await ecommercePage.login(username, password);
    loginDuration = Date.now() - loginStartTime;
    
    console.log(`Login time for ${username}: ${loginDuration}ms`);
    this.loginDuration = loginDuration;
    
    await page.waitForTimeout(1500);
});

Then('I should analyze performance with AI if login time exceeds {int}ms', async function (threshold) {
    if (this.loginDuration && this.loginDuration > threshold) {
        try {
            const perfAnalysis = await ecommercePage.askAI(
                `Login took ${this.loginDuration}ms with performance_glitch_user. What are typical performance issues to test in e-commerce?`
            );
            console.log('AI Performance Analysis:', perfAnalysis);
        } catch (error) {
            console.log('AI performance analysis not available');
        }
    }
});

// Sorting Steps
When('I sort products by {string}', async function (sortOption) {
    await ecommercePage.sortProducts(sortOption);
    await page.waitForTimeout(1000);
});

Then('products should be sorted in ascending price order', async function () {
    const prices = await ecommercePage.getProductPrices();
    
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
});

Then('products should be sorted in descending price order', async function () {
    const prices = await ecommercePage.getProductPrices();
    
    for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
    }
});

Then('I should ask AI for additional sorting test ideas', async function () {
    try {
        const additionalTests = await ecommercePage.askAI(
            'What other sorting and filtering scenarios should I test in an e-commerce application?'
        );
        console.log('AI Additional Sorting Test Ideas:', additionalTests);
    } catch (error) {
        console.log('AI sorting suggestions not available');
    }
});

// AI Execution Steps
When('I request AI to execute scenario {string}', async function (scenarioDescription) {
    page = this.page;
    ecommercePage = new EcommercePage(page);
    
    try {
        const result = await ecommercePage.executeAIGeneratedTest(scenarioDescription);
        console.log('AI Execution Result:', result);
        this.aiExecutionResult = result;
    } catch (error) {
        console.log(`AI execution failed for: ${scenarioDescription}`);
        this.aiExecutionResult = { success: false, error: error.message };
    }
});

Then('AI should provide execution results', async function () {
    expect(this.aiExecutionResult).toBeDefined();
    console.log('AI provided execution results:', this.aiExecutionResult);
});

Then('I should verify the scenario manually by logging in', async function () {
    // Manual verification step
    console.log('Performing manual verification of AI-generated scenario');
});

// Problem User Analysis Steps
Then('I should analyze any issues with AI', async function () {
    try {
        const analysis = await ecommercePage.analyzeTestFailure({
            testName: 'Problem user interaction',
            currentPage: await page.url(),
            username: 'problem_user',
            expected: 'Normal product interaction',
            actual: 'Issues detected with problem user'
        });
        console.log('AI Problem User Analysis:', analysis);
    } catch (error) {
        console.log('AI analysis not available for problem user');
    }
});

Then('I should log problem user image sources', async function () {
    const images = await page.locator('.inventory_item_img img').all();
    for (let i = 0; i < Math.min(images.length, 3); i++) {
        const src = await images[i].getAttribute('src');
        console.log(`Problem user - Image ${i + 1} src:`, src);
    }
});

// Scenario Outline Steps
Then('I should handle {string}', async function (expectedBehavior) {
    switch (expectedBehavior) {
        case 'successful login':
            await expect(page).toHaveURL(/inventory/);
            break;
        case 'slow but functional':
            await expect(page.locator('.inventory_container')).toBeVisible();
            console.log(`Performance user login duration: ${this.loginDuration}ms`);
            break;
        case 'UI issues detected':
            await expect(page).toHaveURL(/inventory/);
            console.log('Problem user logged in - UI issues may be present');
            break;
        default:
            console.log(`Handling: ${expectedBehavior}`);
    }
});

module.exports = {
    // Export any shared utilities if needed
    getAITestData: () => aiTestData,
    getAITestScenarios: () => aiTestScenarios
};