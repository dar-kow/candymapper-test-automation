# Test Cases Documentation for CandyMapper Halloween Party

For project setup and overview, see [README.md](./README.md).

## Test Case Design Philosophy

The Halloween Party tests for CandyMapper are designed with the following principles in mind:

1. **Flow Testing**: Tests cover the complete user flow for both hosting and attending a party
2. **Form Validation**: Tests verify that form inputs are properly validated
3. **UI Verification**: Tests confirm that UI elements are displayed correctly
4. **Error Handling**: Tests check for appropriate error messages

## Test Structure Overview

The Halloween Party tests are organized into two main test suites:

```typescript
import { test, expect } from '@playwright/test';
import { HalloweenPartyActions } from './actions';
import { HalloweenPartyPageData, HalloweenPartyTestData } from './data';
import { urls } from '../utils';

test.describe('CandyMapper Halloween Party Tests', () => {
  let partyActions: HalloweenPartyActions;

  test.beforeEach(async ({ page }) => {
    partyActions = new HalloweenPartyActions(page);
    await partyActions.navigateToHalloweenPartyPage();
    await partyActions.closePopupIfPresent();
  });

  // Main tests...

  test.describe('Hosting a Party Flow', () => {
    test.beforeEach(async () => {
      await partyActions.clickHostPartyButton();
    });

    // Host party flow tests...

    test.describe('Party Registration Form', () => {
      test.beforeEach(async () => {
        await partyActions.selectZombiesTheme();
      });

      // Registration form tests...
    });
  });

  test.describe('Attending a Party Flow', () => {
    test.beforeEach(async () => {
      await partyActions.clickAttendPartyButton();
    });

    // Attend party flow tests...

    test.describe('Party Registration Form After Selecting Zombieton', () => {
      test.beforeEach(async () => {
        await partyActions.selectZombietonLocation();
      });

      // Registration form tests after selecting Zombieton...
    });

    test.describe('Party Registration Form After Selecting Ghostville', () => {
      test.beforeEach(async () => {
        await partyActions.selectGhostvilleLocation();
      });

      // Registration form tests after selecting Ghostville...
    });
  });
});
```

Each test suite has its own setup in the `beforeEach` hook, ensuring that tests start from a consistent state.

## Test Cases

### Main Halloween Party Page

#### 1. Headings Verification

**Objective**: Verify that the main and secondary headings on the Halloween party page are displayed correctly.

**Implementation**:

```typescript
test('should display correct headings on the main Halloween party page', async () => {
  // Arrange - in beforeEach

  // Act
  const mainHeadingText = await partyActions.getMainHeadingText();
  const secondaryHeadingText = await partyActions.getSecondaryHeadingText();

  // Assert
  expect(mainHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.main);
  expect(secondaryHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.subHeading);
});
```

**Considerations**:

- Verifies both the main and secondary headings
- Uses data file constants for expected values
- Trims text to handle any whitespace inconsistencies

### Hosting a Party Flow

#### 1. Host Party Navigation

**Objective**: Verify that clicking the Host Party button navigates to the theme selection page.

**Implementation**:

```typescript
test('should navigate to theme selection page when clicking Host Party', async ({ page }) => {
  // Arrange in beforeEach

  // Assert
  await expect(page).toHaveURL(/host-a-party-1/);
  const headingText = await partyActions.getMainHeadingText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.themeHeading);
});
```

**Considerations**:

- Verifies URL using a regular expression for flexibility
- Checks heading text to confirm correct page content
- Host Party button is clicked in the `beforeEach` hook

#### 2. Zombies Theme Selection

**Objective**: Verify that selecting the Zombies theme navigates to the party location page.

**Implementation**:

```typescript
test('should navigate to party location page when selecting Zombies theme', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  await partyActions.selectZombiesTheme();

  // Assert
  await expect(page).toHaveURL(/party-location/);
  const headingText = await partyActions.getHtmlSectionText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
});
```

**Considerations**:

- Verifies URL matches the expected pattern
- Checks heading text to confirm correct page content
- Tests a specific theme selection

#### 3. Ghosts Theme Selection

**Objective**: Verify that selecting the Ghosts theme navigates to the party location page.

**Implementation**:

```typescript
test('should navigate to party location page when selecting Ghosts theme', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  await partyActions.selectGhostsTheme();

  // Assert
  await expect(page).toHaveURL(/party-location/);
  const headingText = await partyActions.getHtmlSectionText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
});
```

**Considerations**:

- Tests an alternative theme selection
- Uses the same verification pattern as the Zombies theme test
- Confirms consistent behavior across different selections

### Party Registration Form

#### 1. Guest Selection

**Objective**: Verify that users can select different numbers of guests.

**Implementation**:

```typescript
test('should allow selecting different numbers of guests', async () => {
  // Test with each possible value (0, 1, 2)
  for (let i = 0; i <= 2; i++) {
    // Act
    await partyActions.selectNumberOfGuests(i);

    // Assert
    const isSelected = await partyActions.isSelectedOptionValue(i.toString());
    expect(isSelected).toBeTruthy();
  }
});
```

**Considerations**:

- Tests all possible guest count values
- Verifies selection by checking the option's selected state
- **Known Issue**: This test currently fails because the select element's HTML value doesn't change even when different options are selected

#### 2. Empty Email Validation

**Objective**: Verify that submitting the form with an empty email field shows an error message.

**Implementation**:

```typescript
test('should show error message when email is empty', async () => {
  // Arrange - in beforeEach

  // Act
  await partyActions.submitForm();

  // Assert
  const isErrorVisible = await partyActions.isEmailErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorText = await partyActions.getEmailErrorText();
  expect(errorText).toContain(HalloweenPartyPageData.messages.emailError);
});
```

**Considerations**:

- Tests form validation for empty inputs
- Verifies both the visibility of the error message and its content
- Does not enter any data before submitting the form

#### 3. Invalid Email Validation

**Objective**: Verify that submitting the form with an invalid email format shows an error message.

**Implementation**:

```typescript
test('should show error message when email is invalid', async () => {
  // Arrange
  const partyData = {
    email: HalloweenPartyTestData.getInvalidEmail(),
    guests: 1,
  };

  // Act
  await partyActions.completePartyRegistration(partyData);

  // Assert
  const isErrorVisible = await partyActions.isEmailErrorVisible();
  expect(isErrorVisible).toBeTruthy();
  const errorText = await partyActions.getEmailErrorText();
  expect(errorText).toContain(HalloweenPartyPageData.messages.emailError);
});
```

**Considerations**:

- Tests form validation for invalid format inputs
- Uses test data helper to generate an invalid email
- Uses the complete registration helper method for consistency

#### 4. Valid Email Submission

**Objective**: Verify that submitting the form with a valid email shows a confirmation message.

**Implementation**:

```typescript
test('should show confirmation message when email is valid', async () => {
  // Arrange
  const partyData = HalloweenPartyTestData.getPartyData();

  // Act
  await partyActions.completePartyRegistration(partyData);

  // Assert
  const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
  expect(isConfirmationVisible).toBeTruthy();
  const confirmationText = await partyActions.getConfirmationMessageText();
  expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
});
```

**Considerations**:

- Tests the happy path with valid data
- Verifies both the visibility of the confirmation message and its content
- Uses faker to generate a valid email for testing

### Attending a Party Flow

#### 1. Attend Party Navigation

**Objective**: Verify that clicking the Attend Party button navigates to the correct page.

**Implementation**:

```typescript
test('should navigate to attend party page when clicking Attend Party', async ({ page }) => {
  // Arrange - in beforeEach

  // Assert
  await expect(page).toHaveURL(/attend-a-party/);
  const headingText = await partyActions.getMainHeadingText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.attendAParty);
});
```

**Considerations**:

- Verifies URL pattern and heading text
- Uses the `beforeEach` hook to set up the test
- Follows the same pattern as the Host Party navigation test

#### 2. Zombieton Location Selection

**Objective**: Verify that selecting the Zombieton location navigates to the party registration page.

**Implementation**:

```typescript
test('should navigate to party location page when selecting Zombieton location', async ({
  page,
}) => {
  // Arrange - in beforeEach

  // Act
  await partyActions.selectZombietonLocation();

  // Assert
  await expect(page).toHaveURL(/party-location/);
  const headingText = await partyActions.getHtmlSectionText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
});
```

**Considerations**:

- Tests a specific location selection
- Verifies URL and heading text to confirm correct navigation
- Follows the same pattern as the theme selection tests

#### 3. Ghostville Location Selection

**Objective**: Verify that selecting the Ghostville location navigates to the party registration page.

**Implementation**:

```typescript
test('should navigate to party location page when selecting Ghostville location', async ({
  page,
}) => {
  // Arrange - in beforeEach

  // Act
  await partyActions.selectGhostvilleLocation();

  // Assert
  await expect(page).toHaveURL(/party-location/);
  const headingText = await partyActions.getHtmlSectionText();
  expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
});
```

**Considerations**:

- Tests an alternative location selection
- Uses the same verification pattern as the Zombieton location test
- Confirms consistent behavior across different selections

#### 4. Go Back Button

**Objective**: Verify that clicking the "I'm Scared, Let's Go Back!" button navigates to the main page.

**Implementation**:

```typescript
test('should navigate to main page when clicking Go Back button', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  await partyActions.clickGoBackButton();

  // Assert
  await expect(page).toHaveURL(urls.partyLocation);
});
```

**Considerations**:

- Tests the "Go Back" functionality
- **Known Issue**: This test currently fails because clicking the "I'm Scared, Let's Go Back!" button redirects to a fake 404 page instead of the main page

### Party Registration After Selecting Location

#### 1. Zombieton Registration Form

**Objective**: Verify that the registration form works correctly after selecting the Zombieton location.

**Implementation**:

```typescript
test('should show confirmation message when email is valid', async () => {
  // Arrange
  const partyData = HalloweenPartyTestData.getPartyData();

  // Act
  await partyActions.completePartyRegistration(partyData);

  // Assert
  const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
  expect(isConfirmationVisible).toBeTruthy();
  const confirmationText = await partyActions.getConfirmationMessageText();
  expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
});
```

**Considerations**:

- Tests registration after selecting a specific location
- Follows the same pattern as the registration tests in the hosting flow
- Verifies consistent behavior across different user journeys

#### 2. Ghostville Registration Form

**Objective**: Verify that the registration form works correctly after selecting the Ghostville location.

**Implementation**:

```typescript
test('should show confirmation message when email is valid', async () => {
  // Arrange
  const partyData = HalloweenPartyTestData.getPartyData();

  // Act
  await partyActions.completePartyRegistration(partyData);

  // Assert
  const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
  expect(isConfirmationVisible).toBeTruthy();
  const confirmationText = await partyActions.getConfirmationMessageText();
  expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
});
```

**Considerations**:

- Tests registration after selecting a different location
- Verifies consistent behavior across different user journeys
- Uses the same test pattern for consistency and maintainability

## Known Issues

### 1. Guest Selection Value Issue

**Description**: In the "Party Registration Form › should allow selecting different numbers of guests" test, the select element's HTML value doesn't change even when different options are selected.

**Technical details**: While the dropdown visually shows the selected option, the underlying HTML value remains "0", regardless of which option is selected:

```html
<select
  id="guests"
  name="guests"
  style="font-size: 24px; width: 100px; text-align: center; text-align-last: center;"
>
  <option value="0" selected="">0</option>
  <option value="1">1</option>
  <option value="2">2</option>
</select>
```

**Potential fixes**:

1. Modify the test to verify selection visually rather than by HTML value
2. Report the bug to the development team for fixing the select element behavior
3. Add additional JavaScript execution to force value change in the test

### 2. Go Back Button Navigation Issue

**Description**: In the "should navigate to main page when clicking Go Back button" test, clicking the "I'm Scared, Let's Go Back!" button redirects to a fake 404 page instead of the main page.

**Technical details**: The button is linked to "/error-404" instead of the home page:

```html
<a href="/error-404">I'm Scared, Let's Go Back!</a>
```

**Potential fixes**:

1. Update the test expectation to match the current behavior (redirecting to 404)
2. Report the bug to the development team for fixing the button navigation
3. Create a workaround that handles the 404 page and continues testing

## Key Technical Approaches

### 1. Iframe Handling

**Why it matters**: Working with iframes requires special handling to interact with content in nested browsing contexts.

The Halloween Party tests implement iframe handling for the guest dropdown:

```typescript
async initializeFrame() {
  // Wait for the iframe to be present
  await this.page.waitForSelector(this.components.iframe, { timeout: 10000 });

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

async selectNumberOfGuests(guests: number) {
  if (!this.frame) {
    await this.initializeFrame();
  }

  const dropdown = this.frame!.locator(this.components.guestDropdown);
  await ElementHelpers.waitForState(dropdown, 'visible', 10000);
  await dropdown.selectOption(guests.toString());

  // Verify the selection
  const selectedValue = await dropdown.evaluate((select) => (select as HTMLSelectElement).value);
  if (selectedValue !== guests.toString()) {
    throw new Error(`Failed to select ${guests} guests. Selected value is ${selectedValue}`);
  }
}
```

This approach:

- Initializes the frame only when needed
- Uses both frameLocator and direct frame access
- Includes proper error handling
- Verifies selections through JavaScript evaluation

### 2. Popup Handling

**Why it matters**: Popups can interfere with test execution and need to be handled consistently.

The implementation includes a method to handle popups that may appear:

```typescript
async closePopupIfPresent() {
  try {
    const popup = this.page.locator(this.components.popupContainer);
    const isVisible = await popup.isVisible();

    if (isVisible) {
      const closeButton = this.page.locator(this.components.popupCloseButton);
      await ElementHelpers.waitForState(closeButton, 'visible');
      await closeButton.click();
      await ElementHelpers.waitForState(popup, 'hidden');
    }
  } catch (error) {
    // If popup doesn't appear or times out, just continue
    console.log('No popup found or already closed');
  }
}
```

This approach:

- First checks if the popup is actually visible before attempting to close it
- Uses a try-catch block to handle cases where the popup may not appear
- Waits for the popup to be hidden after closing it
- Logs helpful information for debugging

### 3. Form Completion Abstraction

**Why it matters**: Form filling is a repetitive task that benefits from abstraction.

The tests include a helper method for completing the entire registration process:

```typescript
async completePartyRegistration(partyData: PartyData) {
  await this.selectNumberOfGuests(partyData.guests);
  await this.enterEmail(partyData.email);
  await this.submitForm();
}
```

This approach:

- Abstracts common form-filling steps into a single method
- Improves test readability and maintainability
- Ensures consistent form interaction across tests

### 4. Nested Test Structure

**Why it matters**: Proper test structuring reduces setup duplication and improves organization.

The Halloween Party tests use a nested test structure:

```typescript
test.describe('CandyMapper Halloween Party Tests', () => {
  // Main test setup and tests

  test.describe('Hosting a Party Flow', () => {
    // Host party setup and tests

    test.describe('Party Registration Form', () => {
      // Registration form setup and tests
    });
  });

  test.describe('Attending a Party Flow', () => {
    // Attend party setup and tests
  });
});
```

This approach:

- Organizes tests logically by user flow
- Reduces setup duplication with nested beforeEach hooks
- Provides clear separation between different user journeys
- Makes test reports more organized and easier to read

## Refactoring Opportunities

### Generic Types for Action Classes

A major refactoring opportunity exists for unifying the action classes across different test suites. Currently, there are significant similarities in how the various action classes handle iframes, inputs, and buttons.

A proposed solution would be to create a base action class using TypeScript generics:

```typescript
export abstract class BasePageActions<T extends PageComponents> {
  protected page: Page;
  protected components: T;
  protected frame: Frame | null = null;
  protected frameLocator: FrameLocator | null = null;

  constructor(page: Page, componentsClass: new () => T) {
    this.page = page;
    this.components = new componentsClass();
  }

  async initializeFrame(selector: string) {
    await this.page.waitForSelector(selector);
    this.frameLocator = this.page.frameLocator(selector);
    const elementHandle = await this.page.$(selector);
    if (elementHandle) {
      this.frame = await elementHandle.contentFrame();
    }
    if (!this.frame) {
      throw new Error('Failed to initialize frame.');
    }
  }

  async closePopupIfPresent(popupSelector: string, closeButtonSelector: string) {
    try {
      const popup = this.page.locator(popupSelector);
      const isVisible = await popup.isVisible();
      if (isVisible) {
        const closeButton = this.page.locator(closeButtonSelector);
        await ElementHelpers.waitForState(closeButton, 'visible');
        await closeButton.click();
        await ElementHelpers.waitForState(popup, 'hidden');
      }
    } catch (error) {
      // If popup doesn't appear or times out, just continue
    }
  }

  async enterText(selector: string, value: string, fieldName: string) {
    await ElementHelpers.enterTextWithValidation(this.page, selector, value, fieldName);
  }

  async clickButton(selector: string) {
    const button = this.page.locator(selector);
    await ElementHelpers.waitForState(button, 'visible');
    await button.click();
  }
}
```

This refactoring would:

1. Reduce code duplication across action classes (HalloweenPartyActions, TwoFactorAuthActions, etc.)
2. Provide a consistent interface for common actions
3. Improve maintainability by centralizing core functionality
4. Allow for specialized implementations when needed through inheritance

The specialized page actions would then extend this base class:

```typescript
export class HalloweenPartyActions extends BasePageActions<HalloweenPartyComponents> {
  constructor(page: Page) {
    super(page, HalloweenPartyComponents);
  }

  // Add specialized methods only needed for Halloween Party tests
  async selectZombiesTheme() {
    await this.clickButton(this.components.zombiesButton);
  }
}
```

This approach would significantly reduce the amount of duplicated code while maintaining type safety and separation of concerns.
