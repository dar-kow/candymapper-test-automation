# Test Cases Documentation for CandyMapper Navigation

For project setup and overview, see [README.md](./README.md).

## Test Case Design Philosophy

The navigation tests for CandyMapper are designed with the following principles in mind:

1. **Comprehensive Coverage**: Tests cover both main navigation and dropdown menu navigation
2. **Link Verification**: Each navigation link is tested for correct URL and content
3. **Tab Management**: Tests properly handle opening links in new tabs
4. **Element Verification**: Tests verify the presence of expected elements on destination pages

## Test Structure Overview

The navigation tests are organized into two main test suites:

```typescript
import { test, expect } from '@playwright/test';
import { NavigationActions } from './actions';
import { NavigationData } from './data';
import { urls } from '../utils';

test.describe('CandyMapper Main Navigation Tests', () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
  });

  // Main navigation tests...
});

test.describe('CandyMapper More Menu Navigation Tests', () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
    await navigationActions.clickMoreDropdown();
  });

  // More menu navigation tests...
});
```

Each test suite has its own setup in the `beforeEach` hook, ensuring that tests start from a consistent state.

## Test Cases

### Main Navigation Tests

#### 1. Join Us Page Navigation

**Objective**: Verify that users can navigate to the Join Us page and see the correct URL and title.

**Implementation**:

```typescript
test('should navigate to Join Us page', async ({ page }) => {
  // Arrange in beforeEach

  // Act
  await navigationActions.clickNavLinkByText(NavigationData.menuLabels.joinUs);

  // Assert
  await expect(page).toHaveURL(urls.joinUs, {
    timeout: NavigationData.timeouts.navigation,
  });

  await expect(page).toHaveTitle(NavigationData.pageTitles.joinUs, {
    timeout: NavigationData.timeouts.navigation,
  });
});
```

**Considerations**:

- Uses dynamic text selection to find navigation links
- Verifies both URL and page title to ensure correct navigation
- Uses explicit timeouts from the data file for consistent verification

#### 2. British Computer Society Link

**Objective**: Verify that clicking the BCS link opens a new tab with the correct content.

**Implementation**:

```typescript
test('should open British Computer Society in new tab', async ({ context }) => {
  // Click on BCS link and wait for new page
  const newPage = await navigationActions.clickNavLinkAndWaitForNewPage(
    NavigationData.menuLabels.bcs,
    context,
  );

  // Verify the URL of the new page
  await expect(newPage).toHaveURL(urls.bcs, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Close the new page
  await newPage.close();
});
```

**Considerations**:

- Tests external link opening in a new tab
- Uses Playwright's context to access the newly opened page
- Properly manages page lifecycle by closing the new page after testing

### More Menu Navigation Tests

#### 1. Halloween Party Page Navigation

**Objective**: Verify navigation to the Halloween Party page through the More dropdown menu.

**Implementation**:

```typescript
test('should navigate to Halloween Party page', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.halloweenParty);

  // Assert
  await expect(page).toHaveURL(urls.halloweenParty, {
    timeout: NavigationData.timeouts.navigation,
  });
  await expect(page).toHaveTitle(NavigationData.pageTitles.halloweenParty, {
    timeout: NavigationData.timeouts.navigation,
  });
});
```

**Considerations**:

- Tests dropdown menu interaction and subsequent navigation
- Verifies both URL and page title
- Dropdown is opened in the beforeEach hook to keep test focused

#### 2. Launch CandyMapper Page and Loader

**Objective**: Verify navigation to the Launch CandyMapper page and check for the presence of a loader element.

**Implementation**:

```typescript
test('should navigate to Launch CandyMapper page and verify loader', async ({ page }) => {
  // Arrange - in beforeEach

  // Act
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.launchCandyMapper);

  // Assert
  await expect(page).toHaveURL(urls.launchCandyMapper, {
    timeout: NavigationData.timeouts.navigation,
  });
  const isLoaderVisible = await navigationActions.isLoaderVisible();
  expect(isLoaderVisible).toBeTruthy();
  await expect(page).toHaveTitle(NavigationData.pageTitles.launchCandyMapper, {
    timeout: NavigationData.timeouts.navigation,
  });
});
```

**Considerations**:

- Tests both navigation and specific content verification
- Checks for the presence of a dynamic element (loader)
- Multiple assertions are used to verify different aspects of the page

#### 3. Keysight Blog in New Tab

**Objective**: Verify that clicking the Keysight link opens a new tab with the blog page and verify author bio.

**Implementation**:

```typescript
test('should open Keysight page in new tab', async ({ context }) => {
  // Click on Keysight link and wait for new page
  const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
    NavigationData.menuLabels.keysight,
    context,
  );

  // Verify URL of the new page
  expect(newPage).toHaveURL(urls.keysight, { timeout: NavigationData.timeouts.navigation });

  // Verify author name and title are visible
  const isAuthorBioVisible = await navigationActions.isAuthorBioVisible(newPage);
  expect(isAuthorBioVisible).toBeTruthy();

  // Verify page title
  await expect(newPage).toHaveTitle(NavigationData.pageTitles.keysight, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Close the new page
  await newPage.close();
});
```

**Considerations**:

- Tests external link opening in a new tab from dropdown menu
- Verifies specific content (author bio) on the destination page
- Uses page object methods that can work across different page instances

#### 4. PACKT Publishing in New Tab

**Objective**: Verify that the PACKT PUBLISHING link opens properly in a new tab.

**Implementation**:

```typescript
test('should open PACKT PUBLISHING page in new tab', async ({ context }) => {
  // Click on PACKT PUBLISHING link and wait for new page
  const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
    'PACKT PUBLISHING',
    context,
  );

  // Verify URL of the new page
  expect(newPage).toHaveURL(urls.packtPublishing, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify page title
  await expect(newPage).toHaveTitle(NavigationData.pageTitles.packagePublishing, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Close the new page
  await newPage.close();
});
```

**Considerations**:

- Similar to the Keysight test but focused on a different external link
- Uses consistent patterns for link verification

#### 5. Find My Candy Page

**Objective**: Verify navigation to the Find My Candy page and check for specific content.

**Implementation**:

```typescript
test('should navigate to FIND MY CANDY page', async ({ page }) => {
  // Click on FIND MY CANDY link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.findMyCandy);

  // Verify URL
  await expect(page).toHaveURL(urls.findMyCandy, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify specific content
  const sectionTitle = await navigationActions.getFindMyCandyTitle();
  expect(sectionTitle).toContain(NavigationData.expectedContent.findMyCandy);
});
```

**Considerations**:

- Verifies both navigation and specific content
- Uses page object methods to extract content for verification

#### 6. Automation Sandbox Page

**Objective**: Verify navigation to the Automation Sandbox page and check for specific content.

**Implementation**:

```typescript
test('should navigate to An Automation Sandbox page', async ({ page }) => {
  // Click on Automation Sandbox link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.expectedContent.sandboxTools);

  // Verify URL
  await expect(page).toHaveURL(urls.automationSandbox, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify specific content
  const sectionTitle = await navigationActions.getAutomationSandboxTitle();
  expect(sectionTitle).toContain(NavigationData.expectedContent.automationSandbox);
});
```

**Considerations**:

- Similar pattern to Find My Candy test but for a different page
- Content verification uses page-specific methods

#### 7. Graveyard Links Golfing Page

**Objective**: Verify that the Graveyard Links Golfing link opens in a new tab.

**Implementation**:

```typescript
test('should open Graveyard Links Golfing page in new tab', async ({ context }) => {
  // Click on Graveyard Links link and wait for new page
  const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
    'Graveyard Links Golfing',
    context,
  );

  // Verify URL
  await expect(newPage).toHaveURL(urls.graveyardLinks, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Close the new page
  await newPage.close();
});
```

**Considerations**:

- Only verifies URL as this is an external site
- Follows the pattern for new tab testing

#### 8. Magic Object Model Page

**Objective**: Verify navigation to the Magic Object Model page and check for specific content.

**Implementation**:

```typescript
test('should navigate to Magic Object Model page', async ({ page }) => {
  // Click on Magic Object Model link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.magicObjectModel);

  // Verify URL
  await expect(page).toHaveURL(urls.magicObjectModel, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify specific content
  const sectionTitle = await navigationActions.getMagicObjectModelTitle();
  expect(sectionTitle).toContain(NavigationData.expectedContent.magicObjectModel);
});
```

**Considerations**:

- Similar pattern to previous content verification tests
- Uses dedicated method for title extraction

#### 9. Sandbox Tools Page

**Objective**: Verify navigation to the Sandbox Tools page and check for the presence of tool buttons.

**Implementation**:

```typescript
test('should navigate to Sandbox Tools page', async ({ page }) => {
  // Click on Sandbox Tools link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.sandboxTools);

  // Verify URL
  await expect(page).toHaveURL(urls.sandboxTools, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify all buttons are visible
  const buttonsVisible = await navigationActions.areSandboxToolButtonsVisible();
  expect(buttonsVisible).toBeTruthy();
});
```

**Considerations**:

- Verifies functionality (button visibility) rather than just content
- Uses a helper method that checks multiple elements

#### 10. Vampira's Blog Page

**Objective**: Verify navigation to Vampira's Blog page and check for specific content.

**Implementation**:

```typescript
test("should navigate to Vampira's Blog page", async ({ page }) => {
  // Click on Vampira's Blog link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.vampirasBlog);

  // Verify URL
  await expect(page).toHaveURL(urls.vampirasBlog, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify specific content
  const sectionTitle = await navigationActions.getVampirasBlogTitle();
  expect(sectionTitle).toContain(NavigationData.expectedContent.vampirasBlog);
});
```

**Considerations**:

- Follows the established pattern for content verification
- Title verification is consistent with other tests

#### 11. 2FA Validation Code Page

**Objective**: Verify navigation to the 2FA Validation page and check for the presence of the iframe.

**Implementation**:

```typescript
test('should navigate to 2FA Validation code page', async ({ page }) => {
  // Click on 2FA Validation link in More dropdown
  await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.twoFAValidation);

  // Verify URL
  await expect(page).toHaveURL(urls.twoFactorAuthPage, {
    timeout: NavigationData.timeouts.navigation,
  });

  // Verify iframe is visible
  const isIframeVisible = await navigationActions.is2FAIframeVisible();
  expect(isIframeVisible).toBeTruthy();
});
```

**Considerations**:

- Tests integration with the 2FA feature
- Verifies the presence of the iframe which is a critical component
- Uses a specialized method for checking iframe visibility

## Key Technical Approaches

### 1. Dynamic Navigation Link Selection

**Why it matters**: Navigation links can change positions or content, and static selectors can be brittle.

The tests use dynamic text-based selection for finding navigation links:

```typescript
async clickNavLinkByText(linkText: string) {
  const navLinks = this.page
    .locator(this.components.visibleNavItems)
    .locator(this.components.navLinks);
  const count = await navLinks.count();

  for (let i = 0; i < count; i++) {
    const text = await navLinks.nth(i).textContent();
    if (text?.trim() === linkText) {
      await navLinks.nth(i).click();
      return;
    }
  }

  throw new Error(`Nav link with text "${linkText}" not found`);
}
```

This approach:

- Finds navigation links by their text content rather than position or index
- Works even if the order of navigation links changes
- Provides a clear error message if the link is not found
- Can be reused across different navigation tests

### 2. New Tab Handling

**Why it matters**: Many links open in new tabs, which requires special handling in tests.

The implementation includes methods specifically for handling links that open in new tabs:

```typescript
async clickNavLinkAndWaitForNewPage(linkText: string, context: BrowserContext) {
  // Get the current number of pages
  const pagesBefore = context.pages().length;

  // Click the link
  await this.clickNavLinkByText(linkText);

  // Wait for a new page to be created
  await context.waitForEvent('page');

  // Return the newly opened page
  return context.pages()[pagesBefore];
}
```

This approach:

- Keeps track of page count before and after clicking
- Uses Playwright's context to wait for and access the new page
- Returns the new page object for further testing
- Maintains clean test code without complex async handling

### 3. Dropdown Menu Handling

**Why it matters**: Dropdown menus require a specific sequence of interactions to test correctly.

The tests handle dropdown menu testing through a dedicated approach:

```typescript
async clickMoreDropdown() {
  const moreButton = this.page.locator(this.components.moreButton);
  await ElementHelpers.waitForState(moreButton, ElementState.Visible);
  await moreButton.click();

  // Wait for dropdown to be visible
  const dropdown = this.page.locator(this.components.moreDropdown);
  await ElementHelpers.waitForState(dropdown, ElementState.Visible);
}

async clickMoreMenuLinkByText(linkText: string) {
  const moreLinks = this.page
    .locator(this.components.moreDropdownItems)
    .locator(this.components.moreDropdownLinks);
  const count = await moreLinks.count();

  for (let i = 0; i < count; i++) {
    const text = await moreLinks.nth(i).textContent();
    if (text?.trim() === linkText) {
      await moreLinks.nth(i).click();
      return;
    }
  }

  throw new Error(`More menu link with text "${linkText}" not found`);
}
```

This approach:

- Separates dropdown opening from link selection
- Verifies the dropdown is visible before attempting to interact with it
- Uses the same dynamic text selection pattern as the main navigation
- Provides clear error messages if links are not found

### 4. Content Verification

**Why it matters**: Simply verifying URLs is not enough; content verification ensures the correct page loaded properly.

The tests include methods for verifying specific content on each page:

```typescript
async getFindMyCandyTitle() {
  const titleElement = this.page.locator(this.components.findMyCandyTitle);
  await ElementHelpers.waitForState(titleElement, ElementState.Visible);
  return await titleElement.textContent();
}
```

This approach:

- Verifies page-specific content after navigation
- Waits for elements to be visible before extracting content
- Returns the actual content for flexible assertions

### 5. Iframe Visibility Checking

**Why it matters**: Iframes are challenging UI elements that require special handling.

The tests implement a specialized method for checking iframe visibility:

```typescript
async is2FAIframeVisible() {
  try {
    const iframe = this.page.locator(this.components.iframe);
    const isIframePresent = await ElementHelpers.waitForState(iframe, ElementState.Visible);

    if (!isIframePresent) return false;

    const frameLocator = this.page.frameLocator(this.components.iframe);

    // Check if the email input is visible inside the iframe
    const emailInput = frameLocator.locator(this.components.email);
    return await emailInput.isVisible().catch(() => false);
  } catch (error) {
    console.error('Error checking email field in iframe:', error);
    return false;
  }
}
```

This approach:

- First checks if the iframe element itself is present
- Then uses Playwright's frameLocator to look within the iframe
- Checks for specific elements inside the iframe
- Includes proper error handling to avoid test failures on edge cases

### 6. Popup Handling

**Why it matters**: Popups can interfere with navigation tests and need to be handled consistently.

The tests implement a method to handle popups that may appear:

```typescript
async closePopupIfPresent() {
  try {
    const popup = this.page.locator(this.components.popup);
    // Wait for popup to load
    await ElementHelpers.waitForState(popup, ElementState.Visible);

    // Click the close button
    await this.page.click(this.components.popupCloseButton);

    // Wait for popup to disappear
    await ElementHelpers.waitForState(popup, ElementState.Hidden);
  } catch (error) {
    // If popup doesn't appear or times out, just continue
  }
}
```

This approach:

- Uses a try-catch block to handle cases where the popup may not appear
- Waits for the popup to be visible before attempting to close it
- Waits for the popup to disappear after clicking the close button
- Silently continues if the popup is not present, avoiding unnecessary test failures

### 7. Element State Enumeration

**Why it matters**: Using enums improves code readability and reduces the chance of typos.

The tests use an enum for element states:

```typescript
export enum ElementState {
  Visible = 'visible',
  Hidden = 'hidden',
  Attached = 'attached',
  Detached = 'detached',
}
```

This approach:

- Provides type safety for element state parameters
- Makes code more readable and self-documenting
- Ensures consistent usage of state strings throughout the code
- Helps IDE autocomplete suggest valid options
