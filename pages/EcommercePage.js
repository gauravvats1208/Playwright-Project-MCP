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
        return await this.aiAgent.generateTestData(testType);
    }

    async generateTestScenarios(functionality) {
        return await this.aiAgent.generateTestScenarios(functionality);
    }

    async findElementWithAI(description) {
        return await this.aiAgent.suggestLocator(description);
    }

    async analyzeTestFailure(errorDetails) {
        return await this.aiAgent.analyzeTestFailure(errorDetails);
    }

    async executeAIGeneratedTest(scenario) {
        const steps = await this.aiAgent.generateTestSteps(scenario);
        
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
        return await this.aiAgent.askQuestion(question);
    }
}

module.exports = { EcommercePage };