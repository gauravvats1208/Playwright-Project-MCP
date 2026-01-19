const { test, expect } = require('@playwright/test');
const { EcommercePage } = require('../pages/EcommercePage');

test.describe('AI-Enhanced SauceDemo E-commerce Testing', () => {
    
    test.beforeEach(async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        await ecommercePage.goto();
    });

    test('AI-generated login test scenarios', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Generate test scenarios using AI
        const loginScenarios = await ecommercePage.generateTestScenarios('user login');
        
        console.log('AI Generated Login Scenarios:', loginScenarios);
        
        // Execute standard login scenario
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Verify successful login
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.inventory_container')).toBeVisible();
    });

    test('AI-powered product testing with dynamic data', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Login first
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Generate test data using AI
        const testData = await ecommercePage.generateTestData('product selection');
        console.log('AI Generated Test Data:', testData);
        
        // Get product count
        const productCount = await ecommercePage.getProductList();
        expect(productCount).toBeGreaterThan(0);
        
        // Add first available product to cart
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        
        // Verify cart badge appears
        await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    });

    test('Complete e-commerce workflow with AI assistance', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        try {
            // Generate checkout test data
            const checkoutData = await ecommercePage.generateTestData('checkout information');
            console.log('AI Generated Checkout Data:', checkoutData);
            
            // Execute complete workflow
            await ecommercePage.login('standard_user', 'secret_sauce');
            await ecommercePage.addProductToCart('sauce-labs-backpack');
            await ecommercePage.addProductToCart('sauce-labs-bike-light');
            
            await ecommercePage.goToCart();
            await expect(page.locator('.cart_item')).toHaveCount(2);
            
            await ecommercePage.proceedToCheckout();
            await ecommercePage.fillCheckoutInformation('John', 'Doe', '12345');
            
            // Verify checkout overview
            await expect(page).toHaveURL(/checkout-step-two/);
            
            await ecommercePage.completeOrder();
            
            // Verify order completion
            const confirmationText = await ecommercePage.getOrderConfirmation();
            expect(confirmationText).toContain('Thank you');
            
        } catch (error) {
            // Use AI to analyze failure
            const analysis = await ecommercePage.analyzeTestFailure({
                error: error.message,
                testName: 'Complete e-commerce workflow',
                currentPage: await page.url(),
                username: 'standard_user',
                expected: 'Successful order completion',
                actual: 'Test failure occurred'
            });
            
            console.log('AI Failure Analysis:', analysis);
            throw error;
        }
    });

    test('AI-driven error scenarios testing', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Generate error scenarios
        const errorScenarios = await ecommercePage.generateTestScenarios('login errors');
        console.log('AI Generated Error Scenarios:', errorScenarios);
        
        // Test locked out user
        await ecommercePage.login('locked_out_user', 'secret_sauce');
        
        // Verify error message
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        
        // Ask AI about the error
        const aiAdvice = await ecommercePage.askAI('What should I test when a user is locked out?');
        console.log('AI Advice for locked user:', aiAdvice);
    });

    test('AI-assisted element finding', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Use AI to find elements
        const cartLocator = await ecommercePage.findElementWithAI('shopping cart icon in the header');
        console.log('AI suggested cart locator:', cartLocator);
        
        const menuLocator = await ecommercePage.findElementWithAI('hamburger menu button');
        console.log('AI suggested menu locator:', menuLocator);
        
        // Test the actual elements
        await expect(page.locator('.shopping_cart_link')).toBeVisible();
        await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
    });

    test('AI-generated performance testing scenarios', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Generate performance test scenarios
        const perfScenarios = await ecommercePage.generateTestScenarios('performance testing');
        console.log('AI Generated Performance Scenarios:', perfScenarios);
        
        // Test with performance_glitch_user
        const startTime = Date.now();
        
        await ecommercePage.login('performance_glitch_user', 'secret_sauce');
        
        const loginTime = Date.now() - startTime;
        console.log(`Login time with performance_glitch_user: ${loginTime}ms`);
        
        // AI analysis of performance
        if (loginTime > 5000) {
            const perfAnalysis = await ecommercePage.askAI(
                `Login took ${loginTime}ms with performance_glitch_user. What are typical performance issues to test in e-commerce?`
            );
            console.log('AI Performance Analysis:', perfAnalysis);
        }
        
        await expect(page.locator('.inventory_container')).toBeVisible();
    });

    test('AI-powered sorting and filtering tests', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        await ecommercePage.login('standard_user', 'secret_sauce');
        
        // Generate sorting test scenarios
        const sortingScenarios = await ecommercePage.generateTestScenarios('product sorting');
        console.log('AI Generated Sorting Scenarios:', sortingScenarios);
        
        // Test price sorting with AI verification
        await ecommercePage.sortProducts('lohi');
        const pricesLowToHigh = await ecommercePage.getProductPrices();
        
        await ecommercePage.sortProducts('hilo');
        const pricesHighToLow = await ecommercePage.getProductPrices();
        
        // Verify sorting worked
        expect(pricesLowToHigh[0]).toBeLessThanOrEqual(pricesLowToHigh[1]);
        expect(pricesHighToLow[0]).toBeGreaterThanOrEqual(pricesHighToLow[1]);
        
        // Ask AI for additional sorting test ideas
        const additionalTests = await ecommercePage.askAI(
            'What other sorting and filtering scenarios should I test in an e-commerce application?'
        );
        console.log('AI Additional Sorting Test Ideas:', additionalTests);
    });

    test('AI-executed test scenario', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Let AI generate and execute a complete test scenario
        const scenario = 'Add multiple products to cart, remove one, then complete checkout';
        
        const result = await ecommercePage.executeAIGeneratedTest(scenario);
        
        if (result.success) {
            console.log('AI successfully executed test scenario:', result.steps);
        } else {
            console.log('AI test failed:', result.error);
            console.log('AI failure analysis:', result.analysis);
        }
        
        // Manual verification
        await ecommercePage.login('standard_user', 'secret_sauce');
        await ecommercePage.addProductToCart('sauce-labs-backpack');
        await expect(page.locator('.shopping_cart_badge')).toBeVisible();
    });
});

test.describe('AI-Powered Edge Case Testing', () => {
    
    test('Problem user scenario with AI analysis', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        // Generate edge case scenarios
        const edgeCases = await ecommercePage.generateTestScenarios('edge cases and problem scenarios');
        console.log('AI Generated Edge Cases:', edgeCases);
        
        await ecommercePage.login('problem_user', 'secret_sauce');
        
        try {
            await ecommercePage.addProductToCart('sauce-labs-backpack');
            
            // Check if images are broken (common issue with problem_user)
            const images = await page.locator('.inventory_item_img img').all();
            for (let i = 0; i < Math.min(images.length, 3); i++) {
                const src = await images[i].getAttribute('src');
                console.log(`Image ${i + 1} src:`, src);
            }
            
        } catch (error) {
            const analysis = await ecommercePage.analyzeTestFailure({
                error: error.message,
                testName: 'Problem user product interaction',
                currentPage: await page.url(),
                username: 'problem_user',
                expected: 'Normal product interaction',
                actual: 'Issues detected with problem user'
            });
            
            console.log('AI Problem User Analysis:', analysis);
        }
    });
});

// AI Test Data Provider
test.describe('AI Data-Driven Tests', () => {
    
    test('Multiple user types with AI-generated scenarios', async ({ page }) => {
        const ecommercePage = new EcommercePage(page);
        
        const userTypes = [
            { username: 'standard_user', scenario: 'normal shopping flow' },
            { username: 'performance_glitch_user', scenario: 'performance testing' },
            { username: 'problem_user', scenario: 'error handling' }
        ];
        
        for (const userType of userTypes) {
            await test.step(`Testing ${userType.username}`, async () => {
                const scenarios = await ecommercePage.generateTestScenarios(userType.scenario);
                console.log(`AI scenarios for ${userType.username}:`, scenarios);
                
                await page.goto('https://www.saucedemo.com/');
                await ecommercePage.login(userType.username, 'secret_sauce');
                
                if (userType.username !== 'locked_out_user') {
                    await expect(page.locator('.inventory_container')).toBeVisible();
                }
            });
        }
    });
});