import { test, expect } from "@playwright/test";
import { NavigationActions } from "./actions";
import { NavigationData } from "./data";
import { urls } from "../utils";

test.describe("CandyMapper Main Navigation Tests", () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
  });

  test("should navigate to Join Us page", async ({ page }) => {
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

  test("should open British Computer Society in new tab", async ({ context }) => {
    // Arrange
    const newPage = await navigationActions.clickNavLinkAndWaitForNewPage(
      NavigationData.menuLabels.bcs,
      context,
    );

    // Assert
    await expect(newPage).toHaveURL(urls.bcs, {
      timeout: NavigationData.timeouts.navigation,
    });

    // Cleaning
    await newPage.close();
  });
});

test.describe("CandyMapper More Menu Navigation Tests", () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
    await navigationActions.clickMoreDropdown();
  });

  test("should navigate to Halloween Party page", async ({ page }) => {
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

  test("should navigate to Launch CandyMapper page and verify loader", async ({ page }) => {
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
  test.skip("should open Keysight page in new tab", async ({ context }) => {
    // Act
    const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
      NavigationData.menuLabels.keysight,
      context,
    );
    const isAuthorBioVisible = await navigationActions.isAuthorBioVisible(newPage);

    // Assert
    expect(newPage).toHaveURL(urls.keysight, { timeout: NavigationData.timeouts.navigation });
    expect(isAuthorBioVisible).toBeTruthy();
    await expect(newPage).toHaveTitle(NavigationData.pageTitles.keysight, {
      timeout: NavigationData.timeouts.navigation,
    });

    // Cleaning
    await newPage.close();
  });

  test("should open PACKT PUBLISHING page in new tab", async ({ context }) => {
    // Act
    const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
      "PACKT PUBLISHING",
      context,
    );

    // Assert
    expect(newPage).toHaveURL(urls.packtPublishing, {
      timeout: NavigationData.timeouts.navigation,
    });

    await expect(newPage).toHaveTitle(NavigationData.pageTitles.packagePublishing, {
      timeout: NavigationData.timeouts.navigation,
    });

    // Cleaning
    await newPage.close();
  });

  test("should navigate to FIND MY CANDY page", async ({ page }) => {
    // Act
    await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.findMyCandy);
    const sectionTitle = await navigationActions.getFindMyCandyTitle();

    // Assert
    await expect(page).toHaveURL(urls.findMyCandy, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.findMyCandy);
  });

  test("should navigate to An Automation Sandbox page", async ({ page }) => {
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

  test("should open Graveyard Links Golfing page in new tab", async ({ context }) => {
    // Act
    const newPage = await navigationActions.clickMoreMenuLinkAndWaitForNewPage(
      NavigationData.menuLabels.graveyardLinks,
      context,
    );

    // Assert
    await expect(newPage).toHaveURL(urls.graveyardLinks, {
      timeout: NavigationData.timeouts.navigation,
    });

    // Cleaning
    await newPage.close();
  });

  test("should navigate to Magic Object Model page", async ({ page }) => {
    // Act
    await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.magicObjectModel);
    const sectionTitle = await navigationActions.getMagicObjectModelTitle();

    // Assert
    await expect(page).toHaveURL(urls.magicObjectModel, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.magicObjectModel);
  });

  test("should navigate to Sandbox Tools page", async ({ page }) => {
    // Act
    await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.sandboxTools);
    const buttonsVisible = await navigationActions.areSandboxToolButtonsVisible();

    // Assert
    await expect(page).toHaveURL(urls.sandboxTools, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(buttonsVisible).toBeTruthy();
  });

  test("should navigate to Vampira's Blog page", async ({ page }) => {
    // Act
    await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.vampirasBlog);
    const sectionTitle = await navigationActions.getVampirasBlogTitle();

    // Assert
    await expect(page).toHaveURL(urls.vampirasBlog, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.vampirasBlog);
  });

  test("should navigate to 2FA Validation code page", async ({ page }) => {
    // Act
    await navigationActions.clickMoreMenuLinkByText(NavigationData.menuLabels.twoFAValidation);
    const isIframeVisible = await navigationActions.is2FAIframeVisible();

    // Assert
    await expect(page).toHaveURL(urls.twoFactorAuthPage, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(isIframeVisible).toBeTruthy();
  });
});
