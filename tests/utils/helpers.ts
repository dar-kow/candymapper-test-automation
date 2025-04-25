import { Frame, FrameLocator, Locator, Page } from '@playwright/test';

type PageOrFrameLocator = Page | Frame;

export class ElementHelpers {
  // used from other projects, very useful assuming not to use waitForTimeout and my other rigorous assumptions about tests:
  // more here https://portfolio.sdet.pl/articles/avoiding-wait-for-timeout

  /**
   * Waits for element to reach specified state
   */
  static async waitForState(
    locator: Locator,
    state: 'attached' | 'detached' | 'visible' | 'hidden',
    timeout: number = 5000,
  ) {
    try {
      await locator.waitFor({ state, timeout });
      return true;
    } catch (error) {
      throw new Error(
        `Element with selector "${locator}" did not reach state "${state}" within ${timeout}ms.`,
      );
    }
  }

  /**
   * Helper function to enter text into an input field with validation
   * @param page Playwright page object
   * @param locator Locator string for the input element
   * @param value Text value to enter
   * @param fieldName Name of the field for error messages
   */
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
}
