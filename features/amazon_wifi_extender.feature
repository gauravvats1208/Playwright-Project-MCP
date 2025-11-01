Feature: Amazon Wifi Extender Search

  Scenario: Search for Wifi extender and open the first result
    Given I am on the Amazon India homepage
    When I search for "Wifi extender"
    And I click on the first product result
    Then I should be on the product details page

  Scenario: Login to Amazon and verify sign in
    Given I am on the Amazon India homepage
    When I click on the sign in button
    And I login with email "gaurav.vats62@yahoo.com" and password "gvats1989!"
    Then I should see that I am signed in
