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

  test("TC_002_001:Given_userOnHomepage_When_navigatesToHomePage_Then_displaysCorrectUrl", async ({
    page,
  }) => {
    // Arrange
    const expectedUrl = urls.homePage;

    // Assert
    await expect(page).toHaveURL(expectedUrl, { timeout: HomePageData.timeouts.navigation });
  });

  test("TC_002_002:Given_userOnHomepage_When_pageLoads_Then_hasCorrectPageTitle", async ({
    page,
  }) => {
    await expect(page).toHaveTitle(HomePageData.expectedTitle);
    // or with proper AAA pattern:
    // const title = await page.title();
    // expect(title).toBe(HomePageData.expectedTitle);
  });

  test("TC_002_003:Given_userOnHomepage_When_popupClosed_Then_displaysCorrectMainHeading", async () => {
    // Arrange
    await homePageActions.closePopup();

    // Act
    const headingText = await homePageActions.getMainHeadingText();

    // Assert
    expect(headingText?.trim()).toContain(HomePageData.expectedHeadingText);
  });

  test("TC_002_004:Given_userOnHomepage_When_closesPopup_Then_popupIsNotVisible", async () => {
    // Arrange
    const isPopupVisibleInitially = await homePageActions.isPopupVisible();

    // Act
    await homePageActions.closePopup();
    const isPopupVisibleAfterClose = await homePageActions.isPopupVisible();

    // Assert
    expect(isPopupVisibleInitially).toBeTruthy();
    expect(isPopupVisibleAfterClose).toBeFalsy();
  });

  test("TC_002_005:Given_userOnHomepage_When_fillsAndSubmitsContactForm_Then_successMessageIsVisible", async () => {
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

  test("TC_002_006:Given_userOnHomepage_When_submitsContactFormWithoutEmail_Then_validationErrorIsDisplayed", async () => {
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
