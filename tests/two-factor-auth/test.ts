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

  test("should display correct URL after navigating to 2FA page", async ({ page }) => {
    // Arrange - in beforeEach

    // Assert
    await expect(page).toHaveURL(TwoFactorAuthPageData.url, {
      timeout: TwoFactorAuthPageData.timeouts.navigation,
    });
  });

  test("should have correct page title", async ({ page }) => {
    // Arrange - in beforeEach

    // Assert
    await expect(page).toHaveTitle(TwoFactorAuthPageData.expectedTitle);
  });

  test("should have iframe with 2FA form", async ({ page }) => {
    // Arrange - in beforeEach

    // Act
    const iframe = page.locator(twoFactorAuthComponents.iframe);

    // Assert
    await expect(iframe).toBeVisible();
  });

  test("should display correct heading", async ({ page }) => {
    // Arrange - in beforeEach

    // Act
    const heading = page.locator(twoFactorAuthComponents.heading);
    const headingText = await heading.textContent();

    // Assert
    expect(headingText).toBe(TwoFactorAuthPageData.expectedHeading);
  });

  test("should show verification section after sending code", async () => {
    // Arrange
    const testData = TwoFactorAuthTestData.getData();

    // Act
    await twoFactorAuthActions.enterEmail(testData.email);
    await twoFactorAuthActions.clickSendCode();

    // Assert
    const isVerificationSectionVisible = await twoFactorAuthActions.isVerificationSectionVisible();
    expect(isVerificationSectionVisible).toBeTruthy();
  });

  test("should show success message when correct verification code is entered", async () => {
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

  test("should show error message when incorrect verification code is entered", async () => {
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

  test("should extract and verify the generated code correctly", async () => {
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

  test("should show error message for invalid email format", async ({ page }) => {
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
