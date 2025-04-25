import { test, expect } from '@playwright/test';
import { HomePageData } from './data';
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

  test('should close popup after clicking close button', async () => {
    const isPopupVisibleInitially = await homePageActions.isPopupVisible();
    expect(isPopupVisibleInitially).toBeTruthy();

    await homePageActions.closePopup();

    const isPopupVisibleAfterClose = await homePageActions.isPopupVisible();
    expect(isPopupVisibleAfterClose).toBeFalsy();
  });
});
