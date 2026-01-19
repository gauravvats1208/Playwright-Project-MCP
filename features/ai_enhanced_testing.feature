Feature: AI-Enhanced SauceDemo Testing
  As a QA engineer using AI
  I want to leverage AI for intelligent test generation and analysis
  So that I can create more comprehensive and adaptive tests

  Background:
    Given I am on the SauceDemo login page

  Scenario: AI-generated login test scenarios
    When I generate AI test scenarios for "user login"
    And I login with username "standard_user" and password "secret_sauce"
    Then I should see the product inventory page
    And I should see the inventory container
    And I should see "Swag Labs" logo

  Scenario: AI-powered product testing with dynamic data
    When I login with username "standard_user" and password "secret_sauce"
    And I generate AI test data for "product selection"
    Then I should see more than 0 products available
    When I add product "sauce-labs-backpack" to cart
    Then the shopping cart badge should be visible
    And the cart badge should show "1"

  Scenario: Complete e-commerce workflow with AI assistance
    When I generate AI test data for "checkout information"
    And I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    And I add product "sauce-labs-bike-light" to cart
    And I navigate to shopping cart
    Then I should see 2 items in cart
    When I proceed to checkout
    And I fill checkout form with AI-generated data
    Then I should be on checkout overview page
    When I complete the order
    Then I should see order confirmation "Thank you for your order!"

  Scenario: AI-driven error scenarios testing
    When I generate AI test scenarios for "login errors"
    And I login with username "locked_out_user" and password "secret_sauce"
    Then I should see error message containing "locked out"
    When I ask AI about "locked out user testing strategies"
    Then I should receive AI guidance for error testing

  Scenario: AI-assisted element finding
    When I login with username "standard_user" and password "secret_sauce"
    And I use AI to find element "shopping cart icon in the header"
    And I use AI to find element "hamburger menu button"
    Then the shopping cart link should be visible
    And the burger menu button should be visible

  Scenario: AI-generated performance testing scenarios
    When I generate AI test scenarios for "performance testing"
    And I measure login time for username "performance_glitch_user" and password "secret_sauce"
    Then I should see the inventory container
    And I should analyze performance with AI if login time exceeds 5000ms

  Scenario: AI-powered sorting and filtering tests
    When I login with username "standard_user" and password "secret_sauce"
    And I generate AI test scenarios for "product sorting"
    And I sort products by "lohi"
    Then products should be sorted in ascending price order
    When I sort products by "hilo"
    Then products should be sorted in descending price order
    And I should ask AI for additional sorting test ideas

  Scenario: AI-executed test scenario
    When I request AI to execute scenario "Add multiple products to cart, remove one, then complete checkout"
    Then AI should provide execution results
    And I should verify the scenario manually by logging in
    And I should add "sauce-labs-backpack" to cart
    And the shopping cart badge should be visible

  Scenario: Problem user scenario with AI analysis
    When I generate AI test scenarios for "edge cases and problem scenarios"
    And I login with username "problem_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    Then I should analyze any issues with AI
    And I should log problem user image sources

  Scenario Outline: Multiple user types with AI-generated scenarios
    When I generate AI test scenarios for "<scenario_type>"
    And I login with username "<username>" and password "secret_sauce"
    Then I should handle "<expected_behavior>"

    Examples:
      | username                | scenario_type        | expected_behavior     |
      | standard_user          | normal shopping flow | successful login      |
      | performance_glitch_user| performance testing  | slow but functional   |
      | problem_user           | error handling       | UI issues detected    |