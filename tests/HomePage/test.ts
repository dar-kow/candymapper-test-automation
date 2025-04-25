import { test, expect } from '@playwright/test';
import { HomePageData, TestData } from './data';
import { HomePageActions } from './actions';

test.describe('CandyMapper Homepage Tests', () => {
  let homePageActions: HomePageActions;

  test.beforeEach(async ({ page }) => {
    homePageActions = new HomePageActions(page);
    await homePageActions.navigateToHomePage();
  });

  test('should display correct URL after navigating to home page', async ({ page }) => {
    await expect(page).toHaveURL(HomePageData.url, { timeout: HomePageData.timeouts.navigation });
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(HomePageData.expectedTitle);
    // or with proper AAA pattern:
    // const title = await page.title();
    // expect(title).toBe(HomePageData.expectedTitle);
  });

  test('should close popup after clicking close button', async () => {
    const isPopupVisibleInitially = await homePageActions.isPopupVisible();
    expect(isPopupVisibleInitially).toBeTruthy();

    await homePageActions.closePopup();

    const isPopupVisibleAfterClose = await homePageActions.isPopupVisible();
    expect(isPopupVisibleAfterClose).toBeFalsy();
  });

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
});
