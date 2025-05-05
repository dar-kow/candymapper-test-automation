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
});

test.describe('CandyMapper More Menu Navigation Tests', () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
    await navigationActions.clickMoreDropdown();
  });

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
  // skipped due to real CloudFlare site human checking - I don't want to spam someone's site
  test.skip('should open Keysight page in new tab', async ({ context }) => {
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
});
