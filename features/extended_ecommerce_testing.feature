Feature: SauceDemo Extended E-commerce Testing
  As a customer
  I want comprehensive e-commerce functionality testing
  So that I can ensure all shopping features work correctly

  Background:
    Given I am on the SauceDemo login page

  Scenario: Login with valid credentials
    When I login with username "standard_user" and password "secret_sauce"
    Then I should see the product inventory page
    And I should see the inventory container
    And I should see "Swag Labs" logo

  Scenario: Login with invalid credentials
    When I login with username "invalid_user" and password "wrong_password"
    Then I should see error message containing "Username and password do not match"

  Scenario: Locked out user prevention
    When I login with username "locked_out_user" and password "secret_sauce"
    Then I should see error message containing "locked out"

  Scenario: Display all products after login
    When I login with username "standard_user" and password "secret_sauce"
    Then I should see exactly 6 products available
    And each product should have a name visible
    And each product should have a price visible

  Scenario: Add single product to cart
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    Then the shopping cart badge should show "1"
    And the remove button for "sauce-labs-backpack" should be visible

  Scenario: Complete full purchase workflow
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    And I add product "sauce-labs-bike-light" to cart
    And I navigate to shopping cart
    Then I should see 2 items in cart
    When I proceed to checkout
    Then I should be on checkout step one page
    When I fill checkout information with "John", "Doe", "12345"
    Then I should be on checkout overview page
    When I complete the order
    Then I should be on checkout complete page
    And I should see order confirmation "Thank you for your order!"

  Scenario: Sort products by price ascending
    When I login with username "standard_user" and password "secret_sauce"
    And I sort products by "lohi"
    Then products should be sorted in ascending price order

  Scenario: Sort products by price descending
    When I login with username "standard_user" and password "secret_sauce"
    And I sort products by "hilo"
    Then products should be sorted in descending price order

  Scenario: Problem user login and functionality
    When I login with username "problem_user" and password "secret_sauce"
    Then I should see the product inventory page
    When I check product images
    Then I should verify images exist even if broken
    When I add product "sauce-labs-backpack" to cart
    Then the shopping cart badge should be visible

  Scenario: Successful logout
    When I login with username "standard_user" and password "secret_sauce"
    And I logout from the application
    Then I should be redirected to login page
    And I should see the login button

  Scenario: Checkout form validation
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    And I navigate to shopping cart
    And I proceed to checkout
    When I try to continue without filling required fields
    Then I should see error message containing "First Name is required"

  Scenario: Performance testing with glitch user
    When I measure login time for username "performance_glitch_user" and password "secret_sauce"
    Then I should see the product inventory page
    And I should log the performance timing

  Scenario: Remove item from cart
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    Then the shopping cart badge should show "1"
    When I remove product "sauce-labs-backpack" from cart
    Then the shopping cart badge should not be visible

  Scenario: Continue shopping from cart
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    And I navigate to shopping cart
    When I click continue shopping
    Then I should see the product inventory page
    And I should see the inventory container

  Scenario: Verify cart item details
    When I login with username "standard_user" and password "secret_sauce"
    And I add product "sauce-labs-backpack" to cart
    And I navigate to shopping cart
    Then I should see product name "Sauce Labs Backpack"
    And I should see product price "$29.99"
    And I should see product quantity "1"