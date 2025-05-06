import { test, expect } from "@playwright/test";
import { HalloweenPartyActions } from "./actions";
import { HalloweenPartyPageData, HalloweenPartyTestData, PartyActionTargets } from "./data";

test.describe("CandyMapper Halloween Party Tests", () => {
  let partyActions: HalloweenPartyActions;

  test.beforeEach(async ({ page }) => {
    partyActions = new HalloweenPartyActions(page);
    await partyActions.navigateToHalloweenPartyPage();
    await partyActions.closePopupIfPresent();
  });

  test("TC_003_001:Given_userOnHalloweenPartyPage_When_pageLoads_Then_displaysCorrectHeadings", async () => {
    // Arrange - in beforeEach

    // Act
    const mainHeadingText = await partyActions.getMainHeadingText();
    const secondaryHeadingText = await partyActions.getSecondaryHeadingText();

    // Assert
    expect(mainHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.main);
    expect(secondaryHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.subHeading);
  });

  test.describe("Hosting a Party Flow", () => {
    test.beforeEach(async () => {
      await partyActions.clickPartyActionTarget(PartyActionTargets.hostParty);
    });

    test("TC_003_002:Given_userOnHalloweenPartyPage_When_clicksHostParty_Then_navigatesToThemeSelectionPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.hostParty.expectedUrl);
      const headingText = await partyActions.getMainHeadingText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.themeHeading);
    });

    test("TC_003_003:Given_userOnThemeSelectionPage_When_selectsZombiesTheme_Then_navigatesToPartyLocationPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickPartyActionTarget(PartyActionTargets.zombiesTheme);

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.zombiesTheme.expectedUrl);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test("TC_003_004:Given_userOnThemeSelectionPage_When_selectsGhostsTheme_Then_navigatesToPartyLocationPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickPartyActionTarget(PartyActionTargets.ghostsTheme);

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.ghostsTheme.expectedUrl);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test.describe("Party Registration Form", () => {
      test.beforeEach(async () => {
        await partyActions.clickPartyActionTarget(PartyActionTargets.zombiesTheme);
      });

      test("TC_003_005:Given_userOnPartyRegistrationForm_When_selectsNumberOfGuests_Then_optionIsSelected", async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test("TC_003_006:Given_userOnPartyRegistrationForm_When_submitsWithoutEmail_Then_showsEmailError", async () => {
        // Arrange - in beforeEach

        // Act
        await partyActions.submitForm();

        // Assert
        const isErrorVisible = await partyActions.isEmailErrorVisible();
        expect(isErrorVisible).toBeTruthy();
        const errorText = await partyActions.getEmailErrorText();
        expect(errorText).toContain(HalloweenPartyPageData.messages.emailError);
      });

      test("TC_003_007:Given_userOnPartyRegistrationForm_When_entersInvalidEmail_Then_showsEmailError", async () => {
        // Arrange
        const partyData = {
          email: HalloweenPartyTestData.getInvalidEmail(),
          guests: 1,
        };

        // Act
        await partyActions.completePartyRegistration(partyData);

        // Assert
        const isErrorVisible = await partyActions.isEmailErrorVisible();
        expect(isErrorVisible).toBeTruthy();
        const errorText = await partyActions.getEmailErrorText();
        expect(errorText).toContain(HalloweenPartyPageData.messages.emailError);
      });

      test("TC_003_008:Given_userOnPartyRegistrationForm_When_entersValidEmail_Then_showsConfirmationMessage", async () => {
        // Arrange
        const partyData = HalloweenPartyTestData.getPartyData();

        // Act
        await partyActions.completePartyRegistration(partyData);

        // Assert
        const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
        expect(isConfirmationVisible).toBeTruthy();
        const confirmationText = await partyActions.getConfirmationMessageText();
        expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
      });
    });
  });

  test.describe("Attending a Party Flow", () => {
    test.beforeEach(async () => {
      await partyActions.clickPartyActionTarget(PartyActionTargets.attendParty);
    });

    test("TC_003_009:Given_userOnHalloweenPartyPage_When_clicksAttendParty_Then_navigatesToAttendPartyPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.attendParty.expectedUrl);
      const headingText = await partyActions.getMainHeadingText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.attendAParty);
    });

    test("TC_003_010:Given_userOnAttendPartyPage_When_selectsZombietonLocation_Then_navigatesToPartyLocationPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickPartyActionTarget(PartyActionTargets.zombietonLocation);

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.zombietonLocation.expectedUrl);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test("TC_003_011:Given_userOnAttendPartyPage_When_selectsGhostvilleLocation_Then_navigatesToPartyLocationPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickPartyActionTarget(PartyActionTargets.ghostvilleLocation);

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.ghostvilleLocation.expectedUrl);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test("TC_003_012:Given_userOnAttendPartyPage_When_clicksGoBackButton_Then_navigatesToMainPage", async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickPartyActionTarget(PartyActionTargets.goBack);

      // Assert
      await expect(page).toHaveURL(PartyActionTargets.goBack.expectedUrl);
    });

    test.describe("Party Registration Form After Selecting Zombieton", () => {
      test.beforeEach(async () => {
        await partyActions.clickPartyActionTarget(PartyActionTargets.zombietonLocation);
      });

      test("TC_003_013:Given_userOnPartyRegistrationForm_When_selectsNumberOfGuests_Then_optionIsSelected", async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test("TC_003_014:Given_userOnPartyRegistrationForm_When_entersValidEmail_Then_showsConfirmationMessage", async () => {
        // Arrange
        const partyData = HalloweenPartyTestData.getPartyData();

        // Act
        await partyActions.completePartyRegistration(partyData);

        // Assert
        const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
        expect(isConfirmationVisible).toBeTruthy();
        const confirmationText = await partyActions.getConfirmationMessageText();
        expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
      });
    });

    test.describe("Party Registration Form After Selecting Ghostville", () => {
      test.beforeEach(async () => {
        await partyActions.clickPartyActionTarget(PartyActionTargets.ghostvilleLocation);
      });

      test("TC_003_015:Given_userOnPartyRegistrationForm_When_selectsNumberOfGuests_Then_optionIsSelected", async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test("TC_003_016:Given_userOnPartyRegistrationForm_When_entersValidEmail_Then_showsConfirmationMessage", async () => {
        // Arrange
        const partyData = HalloweenPartyTestData.getPartyData();

        // Act
        await partyActions.completePartyRegistration(partyData);

        // Assert
        const isConfirmationVisible = await partyActions.isConfirmationMessageVisible();
        expect(isConfirmationVisible).toBeTruthy();
        const confirmationText = await partyActions.getConfirmationMessageText();
        expect(confirmationText).toContain(HalloweenPartyPageData.messages.confirmationSuccess);
      });
    });
  });
});
