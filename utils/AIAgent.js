// utils/AIAgent.js

class AIAgent {
    constructor() {
        this.apiUrl = 'https://frwxt5uwb5da2wbtyx4p3wk4qm0sydut.lambda-url.us-east-1.on.aws/agent/a-gaurav-expy-agent/send_message';
        this.apiKey = process.env.AI_AGENT_API_KEY || 'your_api_key_here';
        this.userId = process.env.AI_USER_ID || 'test_user_001';
    }

    async sendMessage(message, conversationId = 'automation_session') {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': this.userId,
                    'x-authentication': `api-key ${this.apiKey}`,
                },
                body: JSON.stringify({
                    "input": {
                        "message": message,
                        "conversationId": conversationId
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`AI Agent API error: ${response.status}`);
            }

            const result = await response.json();
            return this.extractResponse(result);
        } catch (error) {
            console.error('AI Agent Error:', error);
            return { error: error.message, response: null };
        }
    }

    extractResponse(result) {
        // Extract the actual response from the API result
        // Adjust this based on your actual API response structure
        if (result && result.output && result.output.message) {
            return { response: result.output.message, error: null };
        }
        return { response: result, error: null };
    }

    async generateTestData(testType, count = 5) {
        const message = `Generate ${count} realistic ${testType} test data items for SauceDemo e-commerce testing. 
        
        Context: SauceDemo (https://www.saucedemo.com) - demo e-commerce site for testing.
        Available users: standard_user, locked_out_user, problem_user, performance_glitch_user, error_user, visual_user
        Password for all: secret_sauce
        
        Products available:
        - Sauce Labs Backpack ($29.99)
        - Sauce Labs Bike Light ($9.99) 
        - Sauce Labs Bolt T-Shirt ($15.99)
        - Sauce Labs Fleece Jacket ($49.99)
        - Sauce Labs Onesie ($7.99)
        - Test.allTheThings() T-Shirt ($15.99)
        
        Format as JSON array with realistic and diverse data.`;
        
        const result = await this.sendMessage(message, 'test_data_generation');
        return this.parseTestData(result.response);
    }

    async generateTestScenarios(functionality) {
        const message = `Generate comprehensive test scenarios for ${functionality} on SauceDemo e-commerce website. 
        
        Context: SauceDemo is a testing-friendly e-commerce demo site with:
        - Login functionality (multiple user types)
        - Product browsing and filtering
        - Shopping cart operations
        - Checkout process with form validation
        - Different user behaviors (standard, problem, performance issues)
        
        Include positive, negative, and edge cases specific to SauceDemo.
        Format as JSON array with testName, description, steps, and expectedResult.`;
        
        const result = await this.sendMessage(message, 'test_scenarios');
        return this.parseTestScenarios(result.response);
    }

    async analyzeTestFailure(errorDetails) {
        const message = `Analyze this test failure on SauceDemo e-commerce website and suggest solutions:
        
        Error: ${errorDetails.error}
        Test: ${errorDetails.testName}
        Page URL: ${errorDetails.url || 'https://www.saucedemo.com'}
        Browser: ${errorDetails.browser || 'Not specified'}
        
        Context: SauceDemo known issues:
        - problem_user has broken images
        - performance_glitch_user has delays
        - locked_out_user cannot login
        - Some browsers may have compatibility issues
        
        Provide specific troubleshooting steps and alternative approaches.`;
        
        const result = await this.sendMessage(message, 'failure_analysis');
        return this.parseFailureAnalysis(result.response);
    }

    async suggestLocator(elementDescription) {
        const message = `Suggest the best CSS selector or XPath for finding this element on SauceDemo:
        Element: ${elementDescription}
        
        SauceDemo structure context:
        - Login: #user-name, #password, #login-button
        - Products: .inventory_item, .inventory_item_name, [data-test="add-to-cart-*"]
        - Cart: .shopping_cart_link, .cart_item, #checkout
        - Menu: #react-burger-menu-btn, .bm-menu
        - Checkout: #first-name, #last-name, #postal-code, #continue, #finish
        
        Provide the most reliable locator with data-test attributes when available.`;
        
        const result = await this.sendMessage(message, 'locator_suggestion');
        return this.parseLocatorSuggestion(result.response);
    }

    async generateTestSteps(scenario) {
        const message = `Convert this test scenario into executable steps for SauceDemo:
        Scenario: ${scenario}
        
        Available actions:
        - goto (navigate to site)
        - login (username, password)
        - addToCart (product-name)
        - goToCart
        - checkout
        - fillCheckout (firstName, lastName, postalCode)
        - complete
        - verify (expectation)
        
        Return as JSON array of step objects with action and parameters.`;
        
        const result = await this.sendMessage(message, 'step_generation');
        return this.parseTestSteps(result.response);
    }

    async askQuestion(question) {
        const message = `Question: ${question}
        
        Context: SauceDemo testing assistance
        Provide helpful, specific advice for test automation.`;
        
        const result = await this.sendMessage(message, 'qa_assistance');
        return result.response || 'Unable to process question at this time.';
    }

    async generateLocatorSuggestions(elementDescription, pageContext) {
        const message = `Suggest CSS/XPath locators for finding "${elementDescription}" on ${pageContext}. 
        Provide multiple options with priority order. 
        Format as JSON array with locator, type (css/xpath), reliability score.`;
        
        const result = await this.sendMessage(message, 'locator_help');
        return this.parseLocatorSuggestions(result.response);
    }

    parseTestData(response) {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // SauceDemo-specific fallback data
            return {
                users: [
                    { username: 'standard_user', password: 'secret_sauce', type: 'normal' },
                    { username: 'problem_user', password: 'secret_sauce', type: 'problematic' },
                    { username: 'performance_glitch_user', password: 'secret_sauce', type: 'slow' }
                ],
                products: [
                    { name: 'Sauce Labs Backpack', price: 29.99, id: 'sauce-labs-backpack' },
                    { name: 'Sauce Labs Bike Light', price: 9.99, id: 'sauce-labs-bike-light' },
                    { name: 'Sauce Labs Bolt T-Shirt', price: 15.99, id: 'sauce-labs-bolt-t-shirt' }
                ],
                checkoutInfo: {
                    firstName: 'John',
                    lastName: 'Doe',
                    postalCode: '12345'
                }
            };
        } catch (error) {
            console.warn('Failed to parse AI test data, using SauceDemo defaults');
            return {
                users: [{ username: 'standard_user', password: 'secret_sauce' }],
                products: [{ name: 'Sauce Labs Backpack', id: 'sauce-labs-backpack' }]
            };
        }
    }

    parseTestScenarios(response) {
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            return [
                {
                    testName: 'SauceDemo Login Test',
                    description: 'User logs in with valid credentials',
                    steps: ['Navigate to SauceDemo', 'Enter username: standard_user', 'Enter password: secret_sauce', 'Click login'],
                    expectedResult: 'User successfully logged in and sees product inventory'
                },
                {
                    testName: 'Add Product to Cart',
                    description: 'User adds a product to shopping cart',
                    steps: ['Login as standard_user', 'Click add to cart for Sauce Labs Backpack', 'Verify cart badge shows 1'],
                    expectedResult: 'Product added to cart successfully'
                }
            ];
        } catch (error) {
            console.warn('Failed to parse AI scenarios, using SauceDemo defaults');
            return [
                {
                    testName: 'SauceDemo Login Test',
                    description: 'User logs in with valid credentials',
                    steps: ['Navigate to SauceDemo', 'Enter username: standard_user', 'Enter password: secret_sauce', 'Click login'],
                    expectedResult: 'User successfully logged in and sees product inventory'
                },
                {
                    testName: 'Add Product to Cart',
                    description: 'User adds a product to shopping cart',
                    steps: ['Login as standard_user', 'Click add to cart for Sauce Labs Backpack', 'Verify cart badge shows 1'],
                    expectedResult: 'Product added to cart successfully'
                }
            ];
        }
    }

    parseErrorAnalysis(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            return {
                possibleCauses: ['Network timeout', 'Element not found', 'Page load issue'],
                suggestedFixes: ['Increase timeout', 'Update locators', 'Add wait conditions'],
                severity: 'Medium'
            };
        } catch (error) {
            console.warn('Failed to parse AI error analysis');
            return {
                possibleCauses: ['Unknown error'],
                suggestedFixes: ['Manual investigation needed'],
                severity: 'High'
            };
        }
    }

    parseLocatorSuggestions(response) {
        try {
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            return [
                { locator: '[data-testid="element"]', type: 'css', reliability: 9 },
                { locator: '#element-id', type: 'css', reliability: 8 }
            ];
        } catch (error) {
            console.warn('Failed to parse locator suggestions');
            return [];
        }
    }
}

module.exports = { AIAgent };