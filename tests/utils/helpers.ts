import { Locator } from '@playwright/test';

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
}
