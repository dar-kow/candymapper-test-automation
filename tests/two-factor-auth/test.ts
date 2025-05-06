import { test, expect } from "@playwright/test";
import { TwoFactorAuthActions } from "./actions";
import { TwoFactorAuthPageData, TwoFactorAuthTestData } from "./data";
import { TwoFactorAuthComponents } from "./components";

test.describe("CandyMapper Two-Factor Authentication Tests", () => {
  let twoFactorAuthActions: TwoFactorAuthActions;
  let twoFactorAuthComponents: TwoFactorAuthComponents;

  test.beforeEach(async ({ page }) => {
    // Arrange
    twoFactorAuthActions = new TwoFactorAuthActions(page);
    await twoFactorAuthActions.navigateToTwoFactorAuthPage();
    twoFactorAuthComponents = new TwoFactorAuthComponents();
    await twoFactorAuthActions.closePopup();
  });

  test("TC_004_001:Given_userOnTwoFactorAuthPage_When_navigatesTo2faPage_Then_displaysCorrectUrl", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Assert
    await expect(page).toHaveURL(TwoFactorAuthPageData.url, {
      timeout: TwoFactorAuthPageData.timeouts.navigation,
    });
  });

  test("TC_004_002:Given_userOnTwoFactorAuthPage_When_pageLoads_Then_hasCorrectPageTitle", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Assert
    await expect(page).toHaveTitle(TwoFactorAuthPageData.expectedTitle);
  });

  test("TC_004_003:Given_userOnTwoFactorAuthPage_When_pageLoads_Then_hasIframeWith2faForm", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Act
    const iframe = page.locator(twoFactorAuthComponents.iframe);

    // Assert
    await expect(iframe).toBeVisible();
  });

  test("TC_004_004:Given_userOnTwoFactorAuthPage_When_pageLoads_Then_displaysCorrectHeading", async ({
    page,
  }) => {
    // Arrange - in beforeEach

    // Act
    const heading = page.locator(twoFactorAuthComponents.heading);
    const headingText = await heading.textContent();

    // Assert
    expect(headingText).toBe(TwoFactorAuthPageData.expectedHeading);
  });

  test("TC_004_005:Given_userOnTwoFactorAuthPage_When_sendsCode_Then_verificationSectionIsVisible", async () => {
    // Arrange
    const testData = TwoFactorAuthTestData.getData();

    // Act
    await twoFactorAuthActions.enterEmail(testData.email);
    await twoFactorAuthActions.clickSendCode();

    // Assert
    const isVerificationSectionVisible = await twoFactorAuthActions.isVerificationSectionVisible();
    expect(isVerificationSectionVisible).toBeTruthy();
  });

  test("TC_004_006:Given_userOnTwoFactorAuthPage_When_entersCorrectVerificationCode_Then_showsSuccessMessage", async () => {
    // Arrange
    const testData = TwoFactorAuthTestData.getData();

    // Act
    await twoFactorAuthActions.completeTwoFactorAuth(testData, true);
    const isSuccessVisible = await twoFactorAuthActions.isSuccessMessageVisible();
    const messageText = await twoFactorAuthActions.getMessageText();

    // Assert
    expect(isSuccessVisible).toBeTruthy();
    expect(messageText).toContain(TwoFactorAuthPageData.verificationSuccessMessage);
  });

  test("TC_004_007:Given_userOnTwoFactorAuthPage_When_entersIncorrectVerificationCode_Then_showsErrorMessage", async () => {
    // Arrange
    const testData = TwoFactorAuthTestData.getData();

    // Act
    await twoFactorAuthActions.completeTwoFactorAuth(testData, false);
    const isErrorVisible = await twoFactorAuthActions.isErrorMessageVisible();
    const messageText = await twoFactorAuthActions.getMessageText();

    // Assert
    expect(isErrorVisible).toBeTruthy();
    expect(messageText).toContain(TwoFactorAuthPageData.verificationFailureMessage);
  });

  test("TC_004_008:Given_userOnTwoFactorAuthPage_When_extractsGeneratedCode_Then_verifiesCodeCorrectly", async () => {
    // Arrange
    const testData = TwoFactorAuthTestData.getData();

    // Act
    await twoFactorAuthActions.enterEmail(testData.email);
    await twoFactorAuthActions.clickSendCode();
    const extractedCode = await twoFactorAuthActions.extractCodeFromMessage();

    await twoFactorAuthActions.enterVerificationCode(extractedCode);
    await twoFactorAuthActions.clickVerifyCode();
    const isSuccessVisible = await twoFactorAuthActions.isSuccessMessageVisible();

    // Assert
    expect(extractedCode).toMatch(/^\d{6}$/);
    expect(isSuccessVisible).toBeTruthy();
  });

  test("TC_004_009:Given_userOnTwoFactorAuthPage_When_entersInvalidEmailFormat_Then_showsErrorMessage", async ({
    page,
  }) => {
    // Arrange

    // Act
    await twoFactorAuthActions.enterEmail("invalid-email");
    await twoFactorAuthActions.clickSendCode();
    const isErrorVisible = await twoFactorAuthActions.isErrorMessageVisible();
    const messageText = await twoFactorAuthActions.getMessageText();

    // Assert
    expect(isErrorVisible).toBeTruthy();
    expect(messageText).toContain(TwoFactorAuthPageData.invalidEmailMessage);
  });
});
