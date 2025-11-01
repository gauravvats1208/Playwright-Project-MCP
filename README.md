# Playwright-Project-MCP

This project demonstrates end-to-end testing of Amazon India using [Playwright](https://playwright.dev/) with [Cucumber.js](https://github.com/cucumber/cucumber-js), leveraging the Page Object Model and MCP (Multi-Client Protocol) integration.

## Project Structure

```
.
├── features/                  # Cucumber feature files and step definitions
│   ├── amazon_wifi_extender.feature
│   ├── step_definitions/
│   │   └── amazon_steps.js
│   └── support/
│       └── world.js
├── pages/                     # Page objects and locators
│   ├── AmazonPage.js
│   └── amazon-locators.json
├── tests/                     # Playwright test specs
│   ├── example.spec.js
│   └── login.spec.js
├── test-results/              # Test output
├── .gitignore
├── cucumber.js
├── package.json
├── playwright.config.js
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Install dependencies:
   ```sh
   npm install
   ```

2. Install Playwright browsers:
   ```sh
   npx playwright install
   ```

## Running Tests

### Playwright Tests

Run all Playwright test specs in the `tests/` directory:
```sh
npx playwright test
```

### Cucumber (BDD) Tests

Run all Cucumber feature scenarios:
```sh
npx cucumber-js
```

## Project Highlights

- **Page Object Model:** All selectors and page actions are encapsulated in [`pages/AmazonPage.js`](pages/AmazonPage.js) using locators from [`pages/amazon-locators.json`](pages/amazon-locators.json).
- **Cucumber BDD:** Feature files in [`features/`](features/) describe scenarios in Gherkin syntax, with step definitions in [`features/step_definitions/`](features/step_definitions/amazon_steps.js).
- **Playwright Test Runner:** Traditional Playwright specs are in [`tests/`](tests/).
- **MCP Integration:** Ready for MCP server integration for AI agent-driven automation.

## Customization

- Update selectors in [`pages/amazon-locators.json`](pages/amazon-locators.json) as needed.
- Add new page objects in the `pages/` directory.
- Add new feature files or test specs as required.

## License

[ISC](LICENSE) (see [`package.json`](package.json))
