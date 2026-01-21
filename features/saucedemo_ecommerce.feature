Feature: SauceDemo E-commerce Testing
  As a customer
  I want to browse and purchase products on SauceDemo
  So that I can complete my shopping successfully

  Background:
    Given I am on the SauceDemo login page

  Scenario: Successful login with standard user
    When I login with username "standard_user"
    Then I should see the product inventory page
    And I should see "Products" header

  Scenario: Failed login with locked user
    When I login with username "locked_out_user"
    Then I should see an error message "Epic sadface: Sorry, this user has been locked out."

  Scenario: Add single product to cart
    When I login with username "standard_user"
    When I add "Sauce Labs Backpack" to cart
    Then the cart badge should show "1"
    And the product button should show "Remove"

  Scenario: Add multiple products to cart
    When I login with username "standard_user"
    When I add the following products to cart:
      | Sauce Labs Backpack |
      | Sauce Labs Bike Light |
      | Sauce Labs Bolt T-Shirt |
    Then the cart badge should show "3"

  Scenario: Complete checkout process
    When I login with username "standard_user"
    And I add "Sauce Labs Backpack" to cart
    When I proceed to checkout
    And I fill checkout information:
      | firstName | John |
      | lastName  | Doe  |
      | postalCode| 12345|
    And I continue to payment
    And I finish the order
    Then I should see "Thank you for your order!" message
    And I should see "Your order has been dispatched" confirmation

  Scenario: Remove product from cart
    When I login with username "standard_user"
    And I add "Sauce Labs Backpack" to cart
    When I remove "Sauce Labs Backpack" from cart
    Then the cart badge should not be visible
    And the product button should show "Add to cart"

  Scenario: Sort products by price
    When I login with username "standard_user"
    When I sort products by "Price (low to high)"
    Then products should be sorted by price ascending

  Scenario: Problem user experience
    When I login with username "problem_user"
    When I view the product inventory
    Then I should see broken product images
    When I add "Sauce Labs Backpack" to cart
    And I proceed to checkout
    Then I should experience UI issues

  Scenario: Performance testing with glitch user
    When I login with username "performance_glitch_user"
    When I navigate through the application
    Then response times should be slower than normal
    But functionality should still work correctly

  Scenario: Visual user testing
    When I login with username "visual_user"
    When I view the product inventory
    Then I should capture visual snapshots for comparison
    And layout should be visually correct

  Scenario Outline: Multiple user types login validation
    When I login with username "<username>"
    Then I should see "<expected_result>"

    Examples:
      | username                | expected_result           |
      | standard_user          | product inventory         |
      | locked_out_user        | locked out error          |
      | problem_user           | product inventory         |
      | performance_glitch_user| product inventory         |
      | error_user             | product inventory         |
      | visual_user            | product inventory         |