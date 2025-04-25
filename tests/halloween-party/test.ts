import { test, expect } from '@playwright/test';
import { HalloweenPartyActions } from './actions';
import { HalloweenPartyPageData, HalloweenPartyTestData } from './data';
import { urls } from '../utils';

test.describe('CandyMapper Halloween Party Tests', () => {
  let partyActions: HalloweenPartyActions;

  test.beforeEach(async ({ page }) => {
    partyActions = new HalloweenPartyActions(page);
    await partyActions.navigateToHalloweenPartyPage();
    await partyActions.closePopupIfPresent();
  });

  test('should display correct headings on the main Halloween party page', async () => {
    // Arrange - in beforeEach

    // Act
    const mainHeadingText = await partyActions.getMainHeadingText();
    const secondaryHeadingText = await partyActions.getSecondaryHeadingText();

    // Assert
    expect(mainHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.main);
    expect(secondaryHeadingText?.trim()).toBe(HalloweenPartyPageData.headings.subHeading);
  });

  test.describe('Hosting a Party Flow', () => {
    test.beforeEach(async () => {
      await partyActions.clickHostPartyButton();
    });

    test('should navigate to theme selection page when clicking Host Party', async ({ page }) => {
      // Arrange - in beforeEach

      // Assert
      await expect(page).toHaveURL(/host-a-party-1/);
      const headingText = await partyActions.getMainHeadingText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.themeHeading);
    });

    test('should navigate to party location page when selecting Zombies theme', async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.selectZombiesTheme();

      // Assert
      await expect(page).toHaveURL(/party-location/);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test('should navigate to party location page when selecting Ghosts theme', async ({ page }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.selectGhostsTheme();

      // Assert
      await expect(page).toHaveURL(/party-location/);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test.describe('Party Registration Form', () => {
      test.beforeEach(async () => {
        await partyActions.selectZombiesTheme();
      });

      // failing because of wrong implementation - option value is not set correctly in the select element
      test('should allow selecting different numbers of guests', async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test('should show error message when email is empty', async () => {
        // Arrange - in beforeEach

        // Act
        await partyActions.submitForm();

        // Assert
        const isErrorVisible = await partyActions.isEmailErrorVisible();
        expect(isErrorVisible).toBeTruthy();
        const errorText = await partyActions.getEmailErrorText();
        expect(errorText).toContain(HalloweenPartyPageData.messages.emailError);
      });

      test('should show error message when email is invalid', async () => {
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

      test('should show confirmation message when email is valid', async () => {
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

  test.describe('Attending a Party Flow', () => {
    test.beforeEach(async () => {
      await partyActions.clickAttendPartyButton();
    });

    test('should navigate to attend party page when clicking Attend Party', async ({ page }) => {
      // Arrange - in beforeEach

      // Assert
      await expect(page).toHaveURL(/attend-a-party/);
      const headingText = await partyActions.getMainHeadingText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.attendAParty);
    });

    test('should navigate to party location page when selecting Zombieton location', async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.selectZombietonLocation();

      // Assert
      await expect(page).toHaveURL(/party-location/);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    test('should navigate to party location page when selecting Ghostville location', async ({
      page,
    }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.selectGhostvilleLocation();

      // Assert
      await expect(page).toHaveURL(/party-location/);
      const headingText = await partyActions.getHtmlSectionText();
      expect(headingText?.trim()).toBe(HalloweenPartyPageData.headings.partyLocation);
    });

    //error bug - should navigate to home page instead of 404 page
    test('should navigate to main page when clicking Go Back button', async ({ page }) => {
      // Arrange - in beforeEach

      // Act
      await partyActions.clickGoBackButton();

      // Assert
      await expect(page).toHaveURL(urls.partyLocation);
    });

    test.describe('Party Registration Form After Selecting Zombieton', () => {
      test.beforeEach(async () => {
        await partyActions.selectZombietonLocation();
      });

      test('should allow selecting different numbers of guests', async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test('should show confirmation message when email is valid', async () => {
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

    test.describe('Party Registration Form After Selecting Ghostville', () => {
      test.beforeEach(async () => {
        await partyActions.selectGhostvilleLocation();
      });

      test('should allow selecting different numbers of guests', async () => {
        // Test with each possible value (0, 1, 2)
        for (let i = 0; i <= 2; i++) {
          // Act
          await partyActions.selectNumberOfGuests(i);

          // Assert
          const isSelected = await partyActions.isSelectedOptionValue(i.toString());
          expect(isSelected).toBeTruthy();
        }
      });

      test('should show confirmation message when email is valid', async () => {
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
