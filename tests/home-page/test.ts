import { test, expect } from "@playwright/test";
import { HomePageData, TestData } from "./data";
import { HomePageActions } from "./actions";
import { urls } from "../utils";

test.describe("CandyMapper Homepage Tests", () => {
  let homePageActions: HomePageActions;

  test.beforeEach(async ({ page }) => {
    homePageActions = new HomePageActions(page);
    await homePageActions.navigateToHomePage();
  });

  test("should display correct URL after navigating to home page", async ({ page }) => {
    // Arrange
    const expectedUrl = urls.homePage;

    // Assert
    await expect(page).toHaveURL(expectedUrl, { timeout: HomePageData.timeouts.navigation });
  });

  test("should have correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(HomePageData.expectedTitle);
    // or with proper AAA pattern:
    // const title = await page.title();
    // expect(title).toBe(HomePageData.expectedTitle);
  });

  test("should display correct main heading", async () => {
    // Arrange
    await homePageActions.closePopup();

    // Act
    const headingText = await homePageActions.getMainHeadingText();

    // Assert
    expect(headingText?.trim()).toContain(HomePageData.expectedHeadingText);
  });

  test("should close popup after clicking close button", async () => {
    // Arrange
    const isPopupVisibleInitially = await homePageActions.isPopupVisible();

    // Act
    await homePageActions.closePopup();
    const isPopupVisibleAfterClose = await homePageActions.isPopupVisible();

    // Assert
    expect(isPopupVisibleInitially).toBeTruthy();
    expect(isPopupVisibleAfterClose).toBeFalsy();
  });

  test("should allow filling and submitting contact form", async () => {
    // Arrange
    await homePageActions.closePopup();
    const contactData = TestData.contactForm().withEmail;

    // Act
    await homePageActions.fillContactForm(contactData);
    await homePageActions.submitContactForm();

    // Assert
    const isSuccessVisible = await homePageActions.isSuccessMessageVisible();
    const successText = await homePageActions.getSuccessMessageText();
    expect(isSuccessVisible).toBeTruthy();
    expect(successText).toContain(HomePageData.expectedSuccessText);
  });

  test("should display validation error when email is not provided", async () => {
    // Arrange
    await homePageActions.closePopup();
    const contactData = TestData.contactForm().withoutEmail;

    // Act
    await homePageActions.fillContactForm(contactData);
    await homePageActions.submitContactForm();

    // Assert
    const isErrorVisible = await homePageActions.isEmailErrorVisible();
    const errorText = await homePageActions.getEmailErrorText();
    expect(isErrorVisible).toBeTruthy();
    expect(errorText).toContain(HomePageData.expectedEmailErrorText);
  });
});
