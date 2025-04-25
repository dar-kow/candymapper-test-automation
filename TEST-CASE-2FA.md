# Test Cases Documentation for CandyMapper Two-Factor Authentication

For project setup and overview, see [README.md](./README.md).

## Test Case Design Philosophy

The Two-Factor Authentication (2FA) tests are designed with the following principles in mind:

1. **Robustness**: Tests must handle complex UI elements like iframes reliably
2. **Reusability**: Common authentication flows are abstracted into reusable methods
3. **Completeness**: Both success and failure paths are thoroughly tested
4. **Clear assertions**: Each test has specific and meaningful verification points

## Test Structure Overview

```typescript
import { test, expect } from '@playwright/test';
import { TwoFactorAuthActions } from './actions';
import { TwoFactorAuthPageData, TwoFactorAuthTestData } from './data';
import { TwoFactorAuthComponents } from './components';

test.describe('CandyMapper Two-Factor Authentication Tests', () => {
  let twoFactorAuthActions: TwoFactorAuthActions;
  let twoFactorAuthComponents: TwoFactorAuthComponents;

  test.beforeEach(async ({ page }) => {
    // Arrange
    twoFactorAuthActions = new TwoFactorAuthActions(page);
    await twoFactorAuthActions.navigateToTwoFactorAuthPage();
    twoFactorAuthComponents = new TwoFactorAuthComponents();
    await twoFactorAuthActions.closePopup();
  });

  // Test cases...
});
```

Each test follows the Arrange-Act-Assert pattern with clear setup in the `beforeEach` hook.

## Test Cases

### 1. URL Verification

**Objective**: Verify that users can navigate to the 2FA page and see the correct URL.

**Implementation**:

```typescript
test('should display correct URL after navigating to 2FA page', async ({ page }) => {
  // Arrange - in beforeEach

  // Assert
  await expect(page).toHaveURL(TwoFactorAuthPageData.url, {
    timeout: TwoFactorAuthPageData.timeouts.navigation,
  });
});
```

**Considerations**:

- Uses explicit timeouts from the data file for consistent navigation verification
- Relies on the setup in beforeEach for navigation

### 2. Page Title Verification

**Objective**: Verify the 2FA page has the correct title.

**Implementation**:

```typescript
test('should have correct page title', async ({ page }) => {
  // Arrange - in beforeEach

  // Assert
  await expect(page).toHaveTitle(TwoFactorAuthPageData.expectedTitle);
});
```

**Considerations**:

- Simple verification of page metadata
- Expected values stored in data file for easy maintenance

### 3. Iframe Presence Verification

**Objective**: Verify that the iframe containing the 2FA form is present on the page.

**Implementation**:

```typescript
test('should have iframe with 2FA form', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  const iframe = page.locator(twoFactorAuthComponents.iframe);

  // Assert
  await expect(iframe).toBeVisible();
});
```

**Considerations**:

- Verifies the foundational element (iframe) needed for all other 2FA tests
- Simple assertion that the iframe is visible to the user

### 4. Heading Verification

**Objective**: Verify that the heading displays the expected text.

**Implementation**:

```typescript
test('should display correct heading', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  const heading = page.locator(twoFactorAuthComponents.heading);
  const headingText = await heading.textContent();

  // Assert
  expect(headingText).toBe(TwoFactorAuthPageData.expectedHeading);
});
```

**Considerations**:

- Verifies basic content on the page
- Uses direct content comparison for exact matching

### 5. Verification Section Display

**Objective**: Verify that the verification section appears after sending a code.

**Implementation**:

```typescript
test('should show verification section after sending code', async () => {
  // Arrange
  const testData = TwoFactorAuthTestData.getData();

  // Act
  await twoFactorAuthActions.enterEmail(testData.email);
  await twoFactorAuthActions.clickSendCode();

  // Assert
  const isVerificationSectionVisible = await twoFactorAuthActions.isVerificationSectionVisible();
  expect(isVerificationSectionVisible).toBeTruthy();
});
```

**Considerations**:

- Tests a key interaction flow: entering email and requesting a verification code
- Verifies UI state changes accordingly
- Uses generated test data for the email

### 6. Successful Verification

**Objective**: Verify that entering a correct verification code shows a success message.

**Implementation**:

```typescript
test('should show success message when correct verification code is entered', async () => {
  // Arrange
  const testData = TwoFactorAuthTestData.getData();

  // Act
  await twoFactorAuthActions.completeTwoFactorAuth(testData, true);

  // Assert
  const isSuccessVisible = await twoFactorAuthActions.isSuccessMessageVisible();
  expect(isSuccessVisible).toBeTruthy();
  const messageText = await twoFactorAuthActions.getMessageText();
  expect(messageText).toContain(TwoFactorAuthPageData.verificationSuccessMessage);
});
```

**Considerations**:

- Tests the happy path using a helper method `completeTwoFactorAuth`
- Verifies both the visibility of the success message and its content
- Uses the `true` parameter to use a valid code extracted from the UI

### 7. Failed Verification

**Objective**: Verify that entering an incorrect verification code shows an error message.

**Implementation**:

```typescript
test('should show error message when incorrect verification code is entered', async () => {
  // Arrange
  const testData = TwoFactorAuthTestData.getData();

  // Act
  await twoFactorAuthActions.completeTwoFactorAuth(testData, false);

  // Assert
  const isErrorVisible = await twoFactorAuthActions.isErrorMessageVisible();
  expect(isErrorVisible).toBeTruthy();
  const messageText = await twoFactorAuthActions.getMessageText();
  expect(messageText).toContain(TwoFactorAuthPageData.verificationFailureMessage);
});
```

**Considerations**:

- Tests the failure path using the same helper method with `false` parameter
- Verifies both the visibility of the error message and its content
- Uses the predefined invalid code from test data

### 8. Code Extraction Test

**Objective**: Verify the ability to extract and use the generated verification code.

**Implementation**:

```typescript
test('should extract and verify the generated code correctly', async () => {
  // Arrange
  const testData = TwoFactorAuthTestData.getData();

  // Act
  await twoFactorAuthActions.enterEmail(testData.email);
  await twoFactorAuthActions.clickSendCode();
  const extractedCode = await twoFactorAuthActions.extractCodeFromMessage();
  await twoFactorAuthActions.enterVerificationCode(extractedCode);
  await twoFactorAuthActions.clickVerifyCode();

  // Assert
  expect(extractedCode).toMatch(/^\d{6}$/);
  const isSuccessVisible = await twoFactorAuthActions.isSuccessMessageVisible();
  expect(isSuccessVisible).toBeTruthy();
});
```

**Considerations**:

- Tests the code extraction functionality specifically
- Verifies the format of the extracted code (6 digits)
- Confirms that using the extracted code leads to successful verification

### 9. Invalid Email Format Test

**Objective**: Verify proper error handling when invalid email format is provided.

**Implementation**:

```typescript
test('should show error message for invalid email format', async ({ page }) => {
  // Arrange

  // Act
  await twoFactorAuthActions.enterEmail('invalid-email');
  await twoFactorAuthActions.clickSendCode();

  // Assert
  const isErrorVisible = await twoFactorAuthActions.isErrorMessageVisible();
  expect(isErrorVisible).toBeTruthy();
  const messageText = await twoFactorAuthActions.getMessageText();
  expect(messageText).toContain(TwoFactorAuthPageData.invalidEmailMessage);
});
```

**Considerations**:

- Tests input validation for the email field
- Verifies appropriate error message is displayed for invalid input
- Uses a clearly invalid email format to trigger validation

## Key Technical Approaches

### 1. Iframe Handling

**Why it matters**: Working with iframes is one of the most challenging aspects of web testing, as it requires interacting with content in nested browsing contexts.

The 2FA tests implement a comprehensive approach to iframe handling:

```typescript
async navigateToTwoFactorAuthPage() {
  await this.page.goto(urls.twoFactorAuthPage);

  // Wait for the iframe to be present
  await this.page.waitForSelector(this.components.iframe);

  // Set the frameLocator
  this.frameLocator = this.page.frameLocator(this.components.iframe);

  // Get the frame using the contentFrame() method
  const elementHandle = await this.page.$(this.components.iframe);
  if (elementHandle) {
    this.frame = await elementHandle.contentFrame();
  }

  if (!this.frame) {
    throw new Error('Failed to initialize frame.');
  }
}
```

This approach:

- Uses both Playwright's `frameLocator()` and direct frame access via `contentFrame()`
- Provides flexibility for different types of iframe interactions
- Ensures frame initialization before allowing any interactions
- Includes proper error handling when the frame cannot be accessed

### 2. Two-Factor Authentication Flow Abstraction

**Why it matters**: The 2FA flow requires multiple steps that are reused across tests.

The implementation provides a reusable method for completing the entire authentication flow:

```typescript
async completeTwoFactorAuth(testData: TwoFactorAuthData, useValidCode: boolean = true) {
  // Early return if invalid code is needed but not provided
  if (!useValidCode && !testData.invalidCode) {
    throw new Error('Invalid code not provided in test data');
  }

  // First handle the popup if it's present
  try {
    await this.closePopup();
  } catch (error) {
    // Popup might not be present, continue with the test
    console.log('No popup found or already closed');
  }

  await this.enterEmail(testData.email);
  await this.clickSendCode();

  // Default to invalid code
  let codeToUse: string = testData.invalidCode as string;

  // Override with valid code if needed
  if (useValidCode) {
    codeToUse = await this.extractCodeFromMessage();
  }

  await this.enterVerificationCode(codeToUse);
  await this.clickVerifyCode();

  return codeToUse;
}
```

This approach:

- Abstracts the common flow to reduce code duplication
- Handles both success and failure paths through a parameter
- Provides built-in error handling for edge cases
- Returns the code used for verification for additional testing if needed
- Uses the Early Return Pattern for error cases

### 3. Dynamic Code Extraction

**Why it matters**: To test successful verification, the code must be extracted from the UI.

The implementation includes a method to extract the verification code from a message:

```typescript
async extractCodeFromMessage() {
  if (!this.frame) {
    throw new Error('Frame is not initialized. Call navigateToTwoFactorAuthPage first.');
  }

  const messageContainer = this.frame.locator(this.components.messageContainer);
  await ElementHelpers.waitForState(messageContainer, 'visible');

  const messageText = (await messageContainer.textContent()) || '';
  const codeMatch = messageText.match(/Demo code: (\d{6})\)/);

  if (codeMatch && codeMatch[1]) {
    return codeMatch[1];
  }

  throw new Error('Could not extract verification code from message');
}
```

This approach:

- Uses regular expressions to extract the code from the message text
- Includes proper error handling if the code cannot be extracted
- Waits for the message to be visible before attempting extraction
- Checks for frame initialization to prevent null reference errors

### 4. Input Validation with Helper Method

**Why it matters**: Input interactions need to be reliable across browsers and input types.

The tests use a shared helper method for entering text:

```typescript
static async enterTextWithValidation(
  page: PageOrFrameLocator,
  locator: string,
  value: string,
  fieldName: string,
) {
  const input = page.locator(locator);
  await ElementHelpers.waitForState(input, 'visible');

  await input.click();
  await input.clear();
  await input.pressSequentially(value, { delay: 10 });
  await input.blur();

  const inputValue = await input.inputValue();
  if (inputValue !== value) {
    throw new Error(
      `${fieldName} input value mismatch. Expected: "${value}", got: "${inputValue}"`,
    );
  }
}
```

This approach:

- Works with both direct page and frame interactions (using the `PageOrFrameLocator` type)
- Validates that the entered value matches the expected value
- Uses explicit click, clear, type, and blur operations for maximum reliability
- Provides descriptive error messages that include the field name for easier debugging

### 5. Explicit Error State Verification

**Why it matters**: Verifying error states is crucial for ensuring proper form validation.

The tests include methods to specifically check for error conditions:

```typescript
async isErrorMessageVisible() {
  if (!this.frame) {
    throw new Error('Frame is not initialized. Call navigateToTwoFactorAuthPage first.');
  }

  const errorMessage = this.frame.locator(this.components.errorMessage);
  return await ElementHelpers.waitForState(errorMessage, 'visible');
}
```

This approach:

- Uses explicit selectors for error messages
- Reuses the `waitForState` helper for consistent waiting behavior
- Includes frame initialization checks
- Returns a boolean value that can be directly used in assertions

### 6. Try-Catch for Optional Steps

**Why it matters**: Some UI elements (like popups) may or may not be present depending on timing or other factors.

The implementation uses try-catch blocks for handling optional interactions:

```typescript
// First handle the popup if it's present
try {
  await this.closePopup();
} catch (error) {
  // Popup might not be present, continue with the test
  console.log('No popup found or already closed');
}
```

This approach:

- Makes tests more robust against timing issues
- Allows tests to proceed even when non-critical elements are missing
- Logs helpful information for debugging without failing the test
- Keeps the primary test flow focused on the main functionality being tested
