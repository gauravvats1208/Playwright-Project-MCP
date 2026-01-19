# 🤖 AI-Enhanced Test Automation Framework

This project demonstrates AI-powered test automation using **SauceDemo** - a safe, public e-commerce demo site perfect for learning test automation.

## 🎯 Why SauceDemo?

- ✅ **Testing-friendly** - Designed specifically for automation practice
- ✅ **No anti-bot protection** - Won't block automated tests
- ✅ **Realistic e-commerce features** - Login, products, cart, checkout
- ✅ **Multiple test users** - Different behaviors for comprehensive testing
- ✅ **Stable and reliable** - Consistent performance for automation
- ✅ **Free to use** - No accounts or payments required

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment (copy and customize)
cp .env.example .env

# Run basic tests
npm run test:basic

# Run AI-enhanced tests
npm run test:ai

# Run with visual interface
npm run test:ui
```

## 📁 Project Structure

```
MCPProject/
├── pages/
│   ├── EcommercePage.js          # Main page object for SauceDemo
│   └── ecommerce-locators.json   # Element locators
├── utils/
│   └── AIAgent.js                # AI integration helper
├── tests/
│   ├── basic-ecommerce.spec.js   # Standard Playwright tests
│   └── ai-enhanced-ecommerce.spec.js # AI-powered tests
└── config/
    └── .env.example              # Environment configuration
```

## 🤖 AI Features

### 1. **Smart Test Data Generation**
```javascript
const testData = await ecommercePage.generateTestData('checkout information');
// AI generates realistic user data for forms
```

### 2. **Intelligent Test Scenarios**
```javascript
const scenarios = await ecommercePage.generateTestScenarios('login errors');
// AI creates comprehensive test cases you might miss
```

### 3. **Automated Failure Analysis**
```javascript
const analysis = await ecommercePage.analyzeTestFailure({
    error: 'Login failed',
    testName: 'User Authentication',
    currentPage: '/login'
});
// AI suggests causes and solutions
```

### 4. **Smart Element Finding**
```javascript
const locator = await ecommercePage.findElementWithAI('shopping cart icon');
// AI suggests the best CSS selectors
```

## 🔧 Configuration

Create `.env` file with your AI agent credentials:

```bash
# AI Agent Configuration
AI_AGENT_API_URL=your_ai_agent_url
AI_AGENT_API_KEY=your_api_key
AI_AGENT_USER_ID=your_user_id

# Test Configuration
NODE_ENV=test
HEADLESS=false
TIMEOUT=30000
```

## 📊 Available Test Users

SauceDemo provides different user types for testing:

| Username | Password | Behavior |
|----------|----------|----------|
| `standard_user` | `secret_sauce` | Normal user behavior |
| `locked_out_user` | `secret_sauce` | Access denied |
| `problem_user` | `secret_sauce` | Has UI issues (broken images) |
| `performance_glitch_user` | `secret_sauce` | Slow performance |
| `error_user` | `secret_sauce` | Encounters errors |
| `visual_user` | `secret_sauce` | Visual testing user |

## 🧪 Test Examples

### Basic E-commerce Test
```javascript
test('Complete purchase workflow', async ({ page }) => {
    const ecommercePage = new EcommercePage(page);
    
    await ecommercePage.goto();
    await ecommercePage.login('standard_user', 'secret_sauce');
    await ecommercePage.addProductToCart('sauce-labs-backpack');
    await ecommercePage.goToCart();
    await ecommercePage.proceedToCheckout();
    await ecommercePage.fillCheckoutInformation('John', 'Doe', '12345');
    await ecommercePage.completeOrder();
    
    const confirmation = await ecommercePage.getOrderConfirmation();
    expect(confirmation).toContain('Thank you');
});
```

### AI-Enhanced Test
```javascript
test('AI-generated test scenarios', async ({ page }) => {
    const ecommercePage = new EcommercePage(page);
    
    // AI generates test scenarios
    const scenarios = await ecommercePage.generateTestScenarios('user login');
    
    // AI generates test data
    const testData = await ecommercePage.generateTestData('user credentials');
    
    // Execute tests with AI-generated data
    for (const scenario of scenarios) {
        await test.step(scenario.name, async () => {
            // Execute AI-generated test steps
        });
    }
});
```

## 🎯 Learning Objectives

This project helps you learn:

1. **Page Object Model** - Clean, maintainable test code
2. **AI Integration** - Using AI to enhance test automation
3. **Data-Driven Testing** - AI-generated test data
4. **Error Handling** - AI-powered failure analysis
5. **Test Strategy** - Comprehensive scenario coverage
6. **Real-world Testing** - E-commerce workflow automation

## 🔍 Available Products

SauceDemo includes these products for testing:

- **Sauce Labs Backpack** - $29.99
- **Sauce Labs Bike Light** - $9.99
- **Sauce Labs Bolt T-Shirt** - $15.99
- **Sauce Labs Fleece Jacket** - $49.99
- **Sauce Labs Onesie** - $7.99
- **Test.allTheThings() T-Shirt** - $15.99

## 📈 Advanced Features

### Performance Testing
```javascript
// Test with performance_glitch_user
const startTime = Date.now();
await ecommercePage.login('performance_glitch_user', 'secret_sauce');
const loginTime = Date.now() - startTime;

// AI analyzes performance issues
const analysis = await ecommercePage.askAI(
    `Login took ${loginTime}ms. What performance issues should I test?`
);
```

### Error Scenario Testing
```javascript
// Test error handling with problem_user
await ecommercePage.login('problem_user', 'secret_sauce');

// AI suggests additional error scenarios
const errorTests = await ecommercePage.generateTestScenarios('error handling');
```

## 🚀 Run Commands

```bash
# Run all tests
npm test

# Run basic tests only
npm run test:basic

# Run AI-enhanced tests
npm run test:ai

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui

# View test report
npm run test:report
```

## 🤝 Contributing

1. **Add new test scenarios** in the test files
2. **Enhance AI prompts** in the AIAgent class
3. **Add new page methods** for additional functionality
4. **Improve error handling** and logging
5. **Add performance tests** for different user types

## 📝 Next Steps

1. **Explore AI capabilities** - Experiment with different AI prompts
2. **Add API testing** - Test SauceDemo's backend APIs
3. **Visual testing** - Add screenshot comparisons
4. **Mobile testing** - Test responsive behavior
5. **Accessibility testing** - Add a11y checks

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev/)
- [SauceDemo Site](https://www.saucedemo.com/)
- [Test Automation Patterns](https://playwright.dev/docs/pom)
- [AI in Testing](https://testguild.com/ai-testing/)

Happy Testing! 🎉