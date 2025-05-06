import { test, expect } from "@playwright/test";
import { NavigationActions } from "./actions";
import { NavigationData } from "./data";
import { MenuType, urls } from "../utils";

test.describe("CandyMapper Main Navigation Tests", () => {
  let navigationActions: NavigationActions;

  test.beforeEach(async ({ page }) => {
    navigationActions = new NavigationActions(page);
    await navigationActions.navigateToHomePage();
    await navigationActions.closePopupIfPresent();
  });

  test("TC_001:Given_userOnHomepage_When_clicksJoinUsNavlink_Then_navigatesToJoinUsPage", async ({
    page,
  }) => {
    // Arrange in beforeEach

    // Act
    await navigationActions.clickMenuLinkByText(NavigationData.menuLabels.joinUs, MenuType.Nav);

    // Assert
    await expect(page).toHaveURL(urls.joinUs, {
      timeout: NavigationData.timeouts.navigation,
    });

    await expect(page).toHaveTitle(NavigationData.pageTitles.joinUs, {
      timeout: NavigationData.timeouts.navigation,
    });
  });

  test("TC_002:Given_userOnHomepage_When_clicksBcsNavlink_Then_opensBcsInNewTab", async ({
    context,
  }) => {
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

  test("TC_003:Given_userOnHomepage_When_clicksHalloweenPartyNavlink_Then_navigatesToHalloweenPartyPage", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.halloweenParty,
      MenuType.Dropdown,
    );

    // Assert
    await expect(page).toHaveURL(urls.halloweenParty, {
      timeout: NavigationData.timeouts.navigation,
    });
    await expect(page).toHaveTitle(NavigationData.pageTitles.halloweenParty, {
      timeout: NavigationData.timeouts.navigation,
    });
  });

  test("TC_004:Given_userOnHomepage_When_clicksLaunchCandyMapperNavlink_Then_navigatesToLaunchCandyMapperPageAndVerifiesLoader", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.launchCandyMapper,
      MenuType.Dropdown,
    );

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
  test.skip("TC_005:Given_userOnHomepage_When_clicksKeysightNavlink_Then_opensKeysightPageInNewTab", async ({
    context,
  }) => {
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

  test("TC_006:Given_userOnHomepage_When_clicksPacktPublishingNavlink_Then_opensPacktPublishingPageInNewTab", async ({
    context,
  }) => {
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

  test("TC_007:Given_userOnHomepage_When_clicksFindMyCandyNavlink_Then_navigatesToFindMyCandyPage", async ({
    page,
  }) => {
    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.findMyCandy,
      MenuType.Dropdown,
    );
    const sectionTitle = await navigationActions.getFindMyCandyTitle();

    // Assert
    await expect(page).toHaveURL(urls.findMyCandy, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.findMyCandy);
  });

  test("TC_008:Given_userOnHomepage_When_clicksAutomationSandboxNavlink_Then_navigatesToAutomationSandboxPage", async ({
    page,
  }) => {
    // Click on Automation Sandbox link in More dropdown
    await navigationActions.clickMenuLinkByText(
      NavigationData.expectedContent.sandboxTools,
      MenuType.Dropdown,
    );

    // Verify URL
    await expect(page).toHaveURL(urls.automationSandbox, {
      timeout: NavigationData.timeouts.navigation,
    });

    // Verify specific content
    const sectionTitle = await navigationActions.getAutomationSandboxTitle();
    expect(sectionTitle).toContain(NavigationData.expectedContent.automationSandbox);
  });

  test("TC_009:Given_userOnHomepage_When_clicksGraveyardLinksNavlink_Then_opensGraveyardLinksPageInNewTab", async ({
    context,
  }) => {
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

  test("TC_010:Given_userOnHomepage_When_clicksMagicObjectModelNavlink_Then_navigatesToMagicObjectModelPage", async ({
    page,
  }) => {
    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.magicObjectModel,
      MenuType.Dropdown,
    );
    const sectionTitle = await navigationActions.getMagicObjectModelTitle();

    // Assert
    await expect(page).toHaveURL(urls.magicObjectModel, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.magicObjectModel);
  });

  test("TC_011:Given_userOnHomepage_When_clicksSandboxToolsNavlink_Then_navigatesToSandboxToolsPage", async ({
    page,
  }) => {
    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.sandboxTools,
      MenuType.Dropdown,
    );
    const buttonsVisible = await navigationActions.areSandboxToolButtonsVisible();

    // Assert
    await expect(page).toHaveURL(urls.sandboxTools, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(buttonsVisible).toBeTruthy();
  });

  test("TC_012:Given_userOnHomepage_When_clicksVampirasBlogNavlink_Then_navigatesToVampirasBlogPage", async ({
    page,
  }) => {
    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.vampirasBlog,
      MenuType.Dropdown,
    );
    const sectionTitle = await navigationActions.getVampirasBlogTitle();

    // Assert
    await expect(page).toHaveURL(urls.vampirasBlog, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(sectionTitle).toContain(NavigationData.expectedContent.vampirasBlog);
  });

  test("TC_013:Given_userOnHomepage_When_clicksTwoFaValidationNavlink_Then_navigatesToTwoFaValidationPage", async ({
    page,
  }) => {
    // Act
    await navigationActions.clickMenuLinkByText(
      NavigationData.menuLabels.twoFAValidation,
      MenuType.Dropdown,
    );
    const isIframeVisible = await navigationActions.is2FAIframeVisible();

    // Assert
    await expect(page).toHaveURL(urls.twoFactorAuthPage, {
      timeout: NavigationData.timeouts.navigation,
    });
    expect(isIframeVisible).toBeTruthy();
  });
});
