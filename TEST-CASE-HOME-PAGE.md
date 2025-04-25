# Test Cases Documentation for CandyMapper Homepage

For project setup and overview, see [README.md](./README.md).

## Test Case Design Philosophy

The test cases for CandyMapper are designed with the following principles in mind:

1. **Reliability**: Tests should produce consistent results without flakiness
2. **Maintainability**: Clear separation of concerns for easier updates
3. **Performance**: Optimized for speed without compromising reliability
4. **Cross-browser compatibility**: Tests should work across all major browsers

## Test Structure Overview

```typescript
import { test, expect } from '@playwright/test';
import { HomePageData, TestData } from './data';
import { HomePageActions } from './actions';

test.describe('CandyMapper Homepage Tests', () => {
  let homePageActions: HomePageActions;

  test.beforeEach(async ({ page }) => {
    homePageActions = new HomePageActions(page);
    await homePageActions.navigateToHomePage();
  });

  // Test cases...
});
```

Each test follows a clear pattern:

- Setup is handled in the `beforeEach` hook
- Tests focus on a single functionality or behavior
- Assertions are clear and descriptive

## Test Cases

### 1. Homepage Navigation

**Objective**: Verify that users can navigate to the homepage and see the correct URL.

**Implementation**:

```typescript
test('should display correct URL after navigating to home page', async ({ page }) => {
  await expect(page).toHaveURL(HomePageData.url, { timeout: HomePageData.timeouts.navigation });
});
```

**Considerations**:

- Uses explicit timeouts from the data file for clarity
- Verifies the actual URL rather than a UI element to ensure proper navigation

### 2. Page Title Verification

**Objective**: Verify that the page title is correct.

**Implementation**:

```typescript
test('should have correct page title', async ({ page }) => {
  await expect(page).toHaveTitle(HomePageData.expectedTitle);
  // or with proper AAA pattern:
  // const title = await page.title();
  // expect(title).toBe(HomePageData.expectedTitle);
});
```

**Considerations**:

- Simple verification of page metadata
- Implements the Arrange-Act-Assert (AAA) pattern as an alternative approach
- Expected values stored in data file for easy maintenance

### 3. Content Verification

**Objective**: Verify that the main heading contains the expected text.

**Implementation**:

```typescript
test('should display correct main heading', async () => {
  await homePageActions.closePopup();

  const headingText = await homePageActions.getMainHeadingText();

  expect(headingText?.trim()).toContain(HomePageData.expectedHeadingText);
});
```

**Considerations**:

- Closes popup first to ensure heading visibility
- Trims text to handle any whitespace inconsistencies
- Uses contain matcher for flexibility with dynamic content

### 4. Popup Handling

**Objective**: Verify that users can close the popup displayed on the homepage.

**Implementation**:

```typescript
test('should close popup after clicking close button', async () => {
  const isPopupVisibleInitially = await homePageActions.isPopupVisible();
  expect(isPopupVisibleInitially).toBeTruthy();

  await homePageActions.closePopup();

  const isPopupVisibleAfterClose = await homePageActions.isPopupVisible();
  expect(isPopupVisibleAfterClose).toBeFalsy();
});
```

**Considerations**:

- First verifies that the popup is visible before attempting to close it
- After closing, verifies that the popup is no longer visible
- Uses helper methods that implement custom wait logic instead of arbitrary timeouts

### 5. Contact Form Submission - Success Path

**Objective**: Verify that users can successfully fill out and submit the contact form.

**Implementation**:

```typescript
test('should allow filling and submitting contact form', async () => {
  await homePageActions.closePopup();
  const contactData = TestData.contactForm().withEmail;

  await homePageActions.fillContactForm(contactData);
  await homePageActions.submitContactForm();

  const isSuccessVisible = await homePageActions.isSuccessMessageVisible();
  const successText = await homePageActions.getSuccessMessageText();
  expect(isSuccessVisible).toBeTruthy();
  expect(successText).toContain(HomePageData.expectedSuccessText);
});
```

**Considerations**:

- Uses generated test data from Faker to ensure unique data for each test run
- Collects all necessary data before making assertions
- Verifies both the visibility of the success message and its content
- Closes the popup first to ensure form accessibility

### 6. Contact Form Validation - Error Path

**Objective**: Verify that the form validation displays an error when email is not provided.

**Implementation**:

```typescript
test('should display validation error when email is not provided', async () => {
  await homePageActions.closePopup();
  const contactData = TestData.contactForm().withoutEmail;

  await homePageActions.fillContactForm(contactData);
  await homePageActions.submitContactForm();

  const isErrorVisible = await homePageActions.isEmailErrorVisible();
  const errorText = await homePageActions.getEmailErrorText();
  expect(isErrorVisible).toBeTruthy();
  expect(errorText).toContain(HomePageData.expectedEmailErrorText);
});
```

**Considerations**:

- Tests the negative case (form validation)
- Gathers all data before performing assertions
- Verifies both the visibility of the error message and its content
- Uses a specific test data variant for this test case

## Key Technical Approaches

### 1. Arrange-Act-Assert (AAA) Pattern

The tests follow the AAA pattern for clarity and consistency:

- **Arrange**: Set up the test environment (page navigation, data preparation)
- **Act**: Perform the actions being tested (clicking buttons, filling forms)
- **Assert**: Verify the expected outcomes

This pattern makes tests easier to read, understand, and maintain.

### 2. Element Waiting Strategy

**Why it matters**: Reliable waiting for elements significantly reduces test flakiness.

Instead of using `page.waitForTimeout()` which introduces arbitrary delays, we use a custom helper:

```typescript
static async waitForState(locator: Locator, state: "attached" | "detached" | "visible" | "hidden", timeout: number = 5000) {
  try {
    await locator.waitFor({ state, timeout });
    return true;
  } catch (error) {
    throw new Error(`Element with selector "${locator}" did not reach state "${state}" within ${timeout}ms.`);
  }
}
```

This approach:

- Waits only as long as needed (improves test speed)
- Waits for specific element states (improves reliability)
- Provides clear error messages (improves debugging)
- Returns boolean values that can be used for assertions

### 3. Input Handling Strategy

**Why it matters**: Different browsers can handle input fields differently.

Instead of simply using `fill()`, a more comprehensive approach is used:

```typescript
private async fillAndVerifyInput(selector: string, value: string) {
  const input = this.page.locator(selector);

  await input.scrollIntoViewIfNeeded();
  await ElementHelpers.waitForState(input, "visible");

  if (!(await this.isInputFillable(input))) {
    throw new Error(`Input with selector "${selector}" is not fillable (disabled or readonly)`);
  }

  await input.click();
  await input.clear();
  await input.pressSequentially(value, { delay: 10 });
  await input.blur();

  const inputValue = await input.inputValue();
  if (inputValue !== value) {
    throw new Error(`Input value mismatch for selector "${selector}". Expected: "${value}", got: "${inputValue}"`);
  }
}
```

This approach:

- Verifies the input is fillable before attempting to interact with it
- Uses a sequence of interactions that works across browsers
- Adds a small delay between keystrokes for reliability
- Validates that the input value was set correctly
- Triggers blur events to ensure form validation is triggered

### 4. Early Return Pattern

The code uses the Early Return Pattern to check for error conditions first and exit early:

```typescript
private async fillAndVerifyInput(selector: string, value: string) {
  const input = this.page.locator(selector);

  await input.scrollIntoViewIfNeeded();
  await ElementHelpers.waitForState(input, "visible");

  // Early return (via throw) if invalid condition is detected
  if (!(await this.isInputFillable(input))) {
    throw new Error(`Input with selector "${selector}" is not fillable (disabled or readonly)`);
  }

  // Rest of the method can proceed without being wrapped in an else block
  await input.click();
  await input.clear();
  // ...
}
```

This pattern:

- Reduces nesting and improves readability
- Makes the function's flow more predictable
- Handles edge cases up front
- Increases maintainability by avoiding deeply nested conditions

More info: [Early Return Pattern](https://medium.com/swlh/return-early-pattern-3d18a41bba8)

### 5. Test Data Management

Using a factory pattern with Faker to generate test data provides several benefits:

```typescript
export class TestData {
  static contactForm() {
    const baseData: ContactFormData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: `+48${faker.string.numeric(9)}`,
      message: faker.lorem.sentence(),
    };

    return {
      withEmail: { ...baseData },
      withoutEmail: { ...baseData, email: null },
    };
  }
}
```

This approach:

- Centralizes test data creation
- Ensures fresh data for each test run
- Provides variants for different test scenarios
- Enforces type safety through interfaces

### 6. File Organization

The clear separation of concerns makes tests easier to maintain and extend:

- **components.ts**: Contains only selectors, making it the single place to update if the UI changes
- **data.ts**: Contains test data and expected results, making it easy to update expected values
- **actions.ts**: Contains page interaction methods without assertions
- **test.ts**: Contains test definitions with assertions, using the actions and data
- **index.ts**: Centralizes exports to simplify imports
