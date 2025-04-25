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
});
