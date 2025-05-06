import { Frame, FrameLocator, Page } from "@playwright/test";
import { HalloweenPartyComponents } from "./components";
import { PartyData } from "./data";
import { ElementHelpers, ElementState, urls } from "../utils";
import { BasePageActions } from "../utils/BasePageActions";

export class HalloweenPartyActions extends BasePageActions {
  private components: HalloweenPartyComponents;
  private frame: Frame | null = null;
  private frameLocator: FrameLocator | null = null;

  constructor(page: Page) {
    super(page);
    this.components = new HalloweenPartyComponents();
  }

  // // Derived class MUST implement abstract methods
  protected getPopupSelector() {
    return this.components.popupContainer;
  }

  protected getCloseButtonSelector() {
    return this.components.popupCloseButton;
  }

  async navigateToHalloweenPartyPage() {
    await this.page.goto(urls.halloweenParty);
    await this.page.waitForSelector(this.components.mainHeading);
  }

  async initializeFrame() {
    // Wait for the iframe to be present
    await this.page.waitForSelector(this.components.iframe, { timeout: 10000 });

    // Set the frameLocator
    this.frameLocator = this.page.frameLocator(this.components.iframe);

    // Get the frame using the contentFrame() method
    const elementHandle = await this.page.$(this.components.iframe);
    if (elementHandle) {
      this.frame = await elementHandle.contentFrame();
    }

    if (!this.frame) {
      throw new Error("Failed to initialize frame.");
    }
  }

  async clickHostPartyButton() {
    await this.closePopupIfPresent();
    const button = this.page.locator(this.components.hostPartyButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForSelector(this.components.mainHeading);
  }

  async clickAttendPartyButton() {
    await this.closePopupIfPresent();
    const button = this.page.locator(this.components.attendPartyButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForSelector(this.components.mainHeading);
  }

  async selectZombiesTheme() {
    const button = this.page.locator(this.components.zombiesButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForURL(/party-location/);
  }

  async selectGhostsTheme() {
    const button = this.page.locator(this.components.ghostsButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForURL(/party-location/);
  }

  async selectZombietonLocation() {
    const button = this.page.locator(this.components.zombiesButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForURL(/party-location/);
  }

  async selectGhostvilleLocation() {
    const button = this.page.locator(this.components.ghostsButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForURL(/party-location/);
  }

  async clickGoBackButton() {
    const button = this.page.locator(this.components.goBackButton);
    await ElementHelpers.waitForState(button, ElementState.Visible);
    await button.click();
    await this.page.waitForURL(/error-404/);
  }

  async selectNumberOfGuests(guests: number) {
    if (!this.frame) {
      await this.initializeFrame();
    }

    const dropdown = this.frame!.locator(this.components.guestDropdown);
    await ElementHelpers.waitForState(dropdown, ElementState.Visible, 10000);
    await dropdown.selectOption(guests.toString());

    // Verify the selection
    const selectedValue = await dropdown.evaluate((select) => (select as HTMLSelectElement).value);
    if (selectedValue !== guests.toString()) {
      throw new Error(`Failed to select ${guests} guests. Selected value is ${selectedValue}`);
    }
  }

  async enterEmail(email: string) {
    await ElementHelpers.enterTextWithValidation(
      this.page,
      this.components.emailInput,
      email,
      "Email",
    );
  }

  async submitForm() {
    const submitButton = this.page.locator(this.components.submitButton);
    await ElementHelpers.waitForState(submitButton, ElementState.Visible);
    await submitButton.click();
  }

  async completePartyRegistration(partyData: PartyData) {
    await this.selectNumberOfGuests(partyData.guests);
    await this.enterEmail(partyData.email);
    await this.submitForm();
  }

  async isEmailErrorVisible() {
    const errorMessage = this.page.locator(this.components.emailError).last();
    return await ElementHelpers.waitForState(errorMessage, ElementState.Visible);
  }

  async getEmailErrorText() {
    const errorMessage = this.page.locator(this.components.emailError).last();
    return await errorMessage.textContent();
  }

  async isConfirmationMessageVisible() {
    const confirmationMessage = this.page.locator(this.components.confirmationMessage);
    return await ElementHelpers.waitForState(confirmationMessage, ElementState.Visible, 5000).catch(
      () => false,
    );
  }

  async getConfirmationMessageText() {
    const confirmationMessage = this.page.locator(this.components.confirmationMessage);
    return await confirmationMessage.textContent();
  }

  async getMainHeadingText() {
    const heading = this.page.locator(this.components.mainHeading);
    return await heading.textContent();
  }

  async getHtmlSectionText() {
    const heading = this.page.locator(this.components.htmlSection);
    return await heading.textContent();
  }

  async getSecondaryHeadingText() {
    const heading = this.page.locator(this.components.secondaryHeading);
    return await heading.textContent();
  }

  async isSelectedOptionValue(value: string) {
    if (!this.frame) {
      await this.initializeFrame();
    }

    const selectedOption = this.frame!.locator(`${this.components.guestOptions}[selected]`);
    const optionValue = await selectedOption.getAttribute("value");
    return optionValue === value;
  }
}
