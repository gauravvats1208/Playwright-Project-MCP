// utils/AIAgent.js
try {
    const envLoader = require('./envLoader');
    envLoader.config();
} catch (error) {
    console.warn('Environment loader not available, using system environment variables only');
}

const { TEST_USERS, getUserCredentials, getAllUsers } = require('../config/testUsers');

class AIAgent {
    constructor() {
        this.apiUrl = 'https://frwxt5uwb5da2wbtyx4p3wk4qm0sydut.lambda-url.us-east-1.on.aws/agent/a-gaurav-expy-agent/send_message';
        this.apiKey = process.env.FAB_API_KEY || process.env.OPENAI_API_KEY || '';
        this.userId = process.env.AI_USER_ID || 'test_user_001';
    }

    // Method to get request body structure
    getRequestBodyStructure(message, conversationId = 'automation_session') {
        return {
            "input": {
                "message": message,
                "conversationId": conversationId,
                "persistent": true,
                "expyId": "a-gaurav-expy-agent",
                "source": "automation",
                "messages": [
                    {
                        "role": "user",
                        "content": message,
                        "payload": {
                            "type": "text",
                            "data": message,
                            "content": message
                        }
                    }
                ]
            }
        };
    }

    async sendMessage(message, conversationId = 'automation_session') {
        try {
            const requestBody = {
                "input": {
                    "message": message,
                    "conversationId": conversationId,
                    "persistent": true,
                    "expyId": "a-gaurav-expy-agent",
                    "source": "automation",
                    "messages": [
                        {
                            "role": "user",
                            "content": message,
                            "payload": {
                                "type": "text",
                                "data": message,
                                "content": message
                            }
                        }
                    ]
                }
            };

            console.log('AI API Request:', {
                url: this.apiUrl,
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': this.userId,
                    'x-authentication': `api-key ${this.apiKey.substring(0, 10)}...` // Only show first 10 chars for security
                },
                body: requestBody
            });

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-user-id': this.userId,
                    'x-authentication': `api-key ${this.apiKey}`,
                },
                body: JSON.stringify(requestBody)
            });

            console.log('AI API Response Status:', response.status);

            if (!response.ok) {
                // Get detailed error response
                const errorText = await response.text();
                console.log('AI API Error Response:', errorText);
                throw new Error(`AI Agent API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('AI API Success Response:', result);
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
        Available users: ${Object.keys(TEST_USERS).join(', ')}
        Password for all: ${TEST_USERS.standard_user.password}
        
        Products available:
        - Sauce Labs Backpack ($29.99)
        - Sauce Labs Bike Light ($9.99) 
        - Sauce Labs Bolt T-Shirt ($15.99)
        - Sauce Labs Fleece Jacket ($49.99)
        - Sauce Labs Onesie ($7.99)
        - Test.allTheThings() T-Shirt ($15.99)
        
        Format as JSON array with realistic and diverse data.`;

        const result = await this.sendMessage(message, 'test_data_generation');
        return this.parseTestData(result.response, testType);
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

    parseTestData(response, testType = 'general') {
        try {
            // Try to extract JSON from response
            const jsonMatch = response.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            // Return contextual fallback data based on test type
            return this.getContextualFallbackData(testType);
        } catch (error) {
            console.warn('Failed to parse AI test data, using SauceDemo defaults');
            return this.getContextualFallbackData(testType);
        }
    }

    getContextualFallbackData(testType) {
        switch (testType.toLowerCase()) {
            case 'user':
            case 'user login':
            case 'login':
                return getAllUsers();
                
            case 'product':
            case 'product selection':
            case 'products':
                return [
                    { name: 'Sauce Labs Backpack', price: 29.99, id: 'sauce-labs-backpack' },
                    { name: 'Sauce Labs Bike Light', price: 9.99, id: 'sauce-labs-bike-light' },
                    { name: 'Sauce Labs Bolt T-Shirt', price: 15.99, id: 'sauce-labs-bolt-t-shirt' }
                ];
                
            case 'checkout':
            case 'checkout information':
            case 'billing':
                return [
                    { firstName: 'John', lastName: 'Doe', postalCode: '12345' },
                    { firstName: 'Jane', lastName: 'Smith', postalCode: '67890' },
                    { firstName: 'Bob', lastName: 'Johnson', postalCode: '54321' }
                ];
                
            default:
                // For general or unknown types, return minimal mixed data
                return {
                    users: [getUserCredentials('standard_user')],
                    products: [{ name: 'Sauce Labs Backpack', id: 'sauce-labs-backpack' }],
                    checkoutInfo: { firstName: 'John', lastName: 'Doe', postalCode: '12345' }
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
                    steps: [`Login as ${TEST_USERS.standard_user.username}`, `Click add to cart for Sauce Labs Backpack`, `Verify cart badge shows 1`],
                    expectedResult: 'Product added to cart successfully'
                }
            ];
        } catch (error) {
            console.warn('Failed to parse AI scenarios, using SauceDemo defaults');
            return [
                {
                    testName: 'SauceDemo Login Test',
                    description: 'User logs in with valid credentials',
                    steps: [`Navigate to SauceDemo`, `Enter username: ${TEST_USERS.standard_user.username}`, `Enter password: ${TEST_USERS.standard_user.password}`, `Click login`],
                    expectedResult: 'User successfully logged in and sees product inventory'
                },
                {
                    testName: 'Add Product to Cart',
                    description: 'User adds a product to shopping cart',
                    steps: [`Login as ${TEST_USERS.standard_user.username}`, `Click add to cart for Sauce Labs Backpack`, `Verify cart badge shows 1`],
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