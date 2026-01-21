const fs = require('fs');
const path = require('path');
const { AIAgent } = require('../utils/AIAgent');
const { getUserTypes } = require('../config/testUsers');

const locators = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'ecommerce-locators.json'), 'utf-8')
);

class EcommercePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.aiAgent = new AIAgent();
    }

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login(username, password) {
        await this.page.locator(locators.usernameInput).fill(username);
        await this.page.locator(locators.passwordInput).fill(password);
        await this.page.locator(locators.loginButton).click();
    }

    async getProductList() {
        await this.page.waitForSelector(locators.productsContainer);
        return await this.page.locator(locators.productItem).count();
    }

    async addProductToCart(productName) {
        const productLocator = `[data-test="add-to-cart-${productName.toLowerCase().replace(/\s+/g, '-')}"]`;
        await this.page.locator(productLocator).click();
    }

    async goToCart() {
        await this.page.locator(locators.cartButton).click();
    }

    async proceedToCheckout() {
        await this.page.locator(locators.checkoutButton).click();
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.page.locator(locators.firstNameInput).fill(firstName);
        await this.page.locator(locators.lastNameInput).fill(lastName);
        await this.page.locator(locators.postalCodeInput).fill(postalCode);
        await this.page.locator(locators.continueButton).click();
    }

    async completeOrder() {
        await this.page.locator(locators.finishButton).click();
    }

    async getOrderConfirmation() {
        await this.page.waitForSelector(locators.orderComplete);
        return await this.page.locator(locators.orderCompleteText).textContent();
    }

    async sortProducts(sortType) {
        await this.page.locator(locators.sortDropdown).selectOption(sortType);
    }

    async getProductPrices() {
        await this.page.waitForSelector(locators.productPrice);
        const priceElements = await this.page.locator(locators.productPrice).all();
        const prices = [];
        
        for (const element of priceElements) {
            const priceText = await element.textContent();
            prices.push(parseFloat(priceText.replace('$', '')));
        }
        
        return prices;
    }

    async logout() {
        await this.page.locator(locators.menuButton).click();
        await this.page.locator(locators.logoutLink).click();
    }

    async removeProductFromCart(productName) {
        const productCard = this.page.locator('.inventory_item').filter({ hasText: productName });
        await productCard.locator('button:has-text("Remove")').click();
    }

    async continueCheckout() {
        await this.page.locator('[data-test="continue"]').click();
    }

    async finishOrder() {
        await this.page.locator('[data-test="finish"]').click();
    }

    // AI-Enhanced Methods
    async generateTestData(testType) {
        const prompt = `Generate ${testType} test data for SauceDemo e-commerce testing. 
        Available products: Sauce Labs Backpack, Sauce Labs Bike Light, Sauce Labs Bolt T-Shirt, 
        Sauce Labs Fleece Jacket, Sauce Labs Onesie, Test.allTheThings() T-Shirt.
        Include realistic user data and scenarios.`;
        
        return await this.aiAgent.generateTestData(prompt);
    }

    async generateTestScenarios(functionality) {
        const prompt = `Generate comprehensive test scenarios for ${functionality} functionality 
        on SauceDemo e-commerce website. Include positive, negative, and edge cases.
        Available users: ${getUserTypes().join(', ')}.`;
        
        return await this.aiAgent.generateTestScenarios(prompt);
    }

    async findElementWithAI(description) {
        const prompt = `Find the best CSS selector or locator for: "${description}" 
        on SauceDemo website. The site has standard e-commerce elements like products, 
        cart, checkout, login forms, etc.`;
        
        return await this.aiAgent.suggestLocator(prompt);
    }

    async analyzeTestFailure(errorDetails) {
        const prompt = `Analyze this test failure on SauceDemo e-commerce site:
        Error: ${errorDetails.error}
        Test: ${errorDetails.testName}
        Page: ${errorDetails.currentPage}
        User: ${errorDetails.username}
        Expected: ${errorDetails.expected}
        Actual: ${errorDetails.actual}`;
        
        return await this.aiAgent.analyzeFailure(prompt);
    }

    async executeAIGeneratedTest(scenario) {
        const prompt = `Execute this test scenario on SauceDemo: "${scenario}". 
        Provide step-by-step instructions using available methods in this class.`;
        
        const steps = await this.aiAgent.generateTestSteps(prompt);
        
        try {
            for (const step of steps) {
                await this.executeTestStep(step);
            }
            return { success: true, steps };
        } catch (error) {
            const analysis = await this.analyzeTestFailure({
                error: error.message,
                testName: scenario,
                currentPage: await this.page.url(),
                username: 'AI-generated test',
                expected: 'Successful execution',
                actual: 'Test failure'
            });
            return { success: false, error: error.message, analysis };
        }
    }

    async executeTestStep(step) {
        // Parse and execute individual test steps
        switch (step.action) {
            case 'goto':
                await this.goto();
                break;
            case 'login':
                await this.login(step.username, step.password);
                break;
            case 'addToCart':
                await this.addProductToCart(step.productName);
                break;
            case 'goToCart':
                await this.goToCart();
                break;
            case 'checkout':
                await this.proceedToCheckout();
                break;
            case 'fillCheckout':
                await this.fillCheckoutInformation(step.firstName, step.lastName, step.postalCode);
                break;
            case 'complete':
                await this.completeOrder();
                break;
            case 'verify':
                await this.verifyExpectation(step.expectation);
                break;
            default:
                console.log(`Unknown step action: ${step.action}`);
        }
    }

    async verifyExpectation(expectation) {
        // Implement verification logic based on expectation type
        if (expectation.type === 'url') {
            const currentUrl = await this.page.url();
            if (!currentUrl.includes(expectation.value)) {
                throw new Error(`Expected URL to contain '${expectation.value}', but got '${currentUrl}'`);
            }
        } else if (expectation.type === 'text') {
            const element = await this.page.locator(expectation.selector).textContent();
            if (!element.includes(expectation.value)) {
                throw new Error(`Expected text to contain '${expectation.value}', but got '${element}'`);
            }
        }
    }

    async askAI(question) {
        const { COMMON_PASSWORD } = require('../config/testUsers');
        const prompt = `Question about SauceDemo e-commerce testing: ${question}
        Context: SauceDemo is a demo shopping site with login, product browsing, cart, and checkout functionality.
        Available test users: ${getUserTypes().join(', ')}.
        All users have password: ${COMMON_PASSWORD}`;
        
        return await this.aiAgent.askQuestion(prompt);
    }
}

module.exports = { EcommercePage };