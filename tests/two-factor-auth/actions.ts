import { Page, Frame, FrameLocator } from "@playwright/test";
import { TwoFactorAuthComponents } from "./components";
import { TwoFactorAuthData } from "./data";
import { ElementHelpers, ElementState, urls } from "../utils";
import { BasePageActions } from "../utils/BasePageActions";

export class TwoFactorAuthActions extends BasePageActions {
  private components: TwoFactorAuthComponents;
  private frame: Frame | null = null;
  private frameLocator: FrameLocator | null = null;

  constructor(page: Page) {
    super(page);
    this.components = new TwoFactorAuthComponents();
  }

  // // Derived class MUST implement abstract methods
  protected getPopupSelector() {
    return this.components.popupContainter;
  }

  protected getCloseButtonSelector() {
    return this.components.popupCloseButton;
  }

  // This method handles one of the most challenging parts of the test - working with iframes.
  // Playwright offers two approaches to interact with iframes:
  // 1. frameLocator() - for simple element interactions within frames
  // 2. contentFrame() - for direct access to the Frame API
  // We need both here because:
  // frameLocator provides a convenient way to locate elements in iframes
  // direct Frame access allows for more complex interactions and better error handling
  // But I could always be wrong and perhaps there is a simpler solution for this case
  async navigateToTwoFactorAuthPage() {
    await this.page.goto(urls.twoFactorAuthPage);

    // Wait for the iframe to be present
    await this.page.waitForSelector(this.components.iframe);

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

  private getFrameOrThrow() {
    if (!this.frame) {
      throw new Error("Frame is not initialized. Call navigateToTwoFactorAuthPage first.");
    }
    return this.frame;
  }

  async enterEmail(email: string) {
    const frame = this.getFrameOrThrow();
    await ElementHelpers.enterTextWithValidation(frame, this.components.emailInput, email, "Email");
  }

  async clickSendCode() {
    const frame = this.getFrameOrThrow();
    const sendCodeButton = frame.locator(this.components.sendCodeButton);
    await ElementHelpers.waitForState(sendCodeButton, ElementState.Visible);
    await sendCodeButton.click();
  }

  async isVerificationSectionVisible() {
    const frame = this.getFrameOrThrow();
    const verificationSection = frame.locator(this.components.verificationSection);
    return await ElementHelpers.waitForState(verificationSection, ElementState.Visible);
  }

  async extractCodeFromMessage() {
    const frame = this.getFrameOrThrow();
    const messageContainer = frame.locator(this.components.messageContainer);
    await ElementHelpers.waitForState(messageContainer, ElementState.Visible);

    const messageText = (await messageContainer.textContent()) || "";
    const codeMatch = messageText.match(/Demo code: (\d{6})\)/);

    if (codeMatch && codeMatch[1]) {
      return codeMatch[1];
    }

    throw new Error("Could not extract verification code from message");
  }

  async enterVerificationCode(code: string) {
    const frame = this.getFrameOrThrow();
    await ElementHelpers.enterTextWithValidation(frame, this.components.codeInput, code, "Code");
  }

  async clickVerifyCode() {
    const frame = this.getFrameOrThrow();
    const verifyButton = frame.locator(this.components.verifyCodeButton);
    await ElementHelpers.waitForState(verifyButton, ElementState.Visible);
    await verifyButton.click();
  }

  async getMessageText() {
    const frame = this.getFrameOrThrow();
    const messageContainer = frame.locator(this.components.messageContainer);
    await ElementHelpers.waitForState(messageContainer, ElementState.Visible);
    return await messageContainer.textContent();
  }

  async isSuccessMessageVisible() {
    const frame = this.getFrameOrThrow();
    const successMessage = frame.locator(this.components.successMessage);
    return await ElementHelpers.waitForState(successMessage, ElementState.Visible);
  }

  async isErrorMessageVisible() {
    const frame = this.getFrameOrThrow();
    const errorMessage = frame.locator(this.components.errorMessage);
    return await ElementHelpers.waitForState(errorMessage, ElementState.Visible);
  }

  /**
   * Complete the two-factor authentication flow
   * @param testData The test data containing email and optional invalidCode
   * @param useValidCode Whether to use a valid code extracted from the UI (true) or the invalid code from testData (false)
   * @returns The code used for verification
   */
  async completeTwoFactorAuth(testData: TwoFactorAuthData, useValidCode: boolean = true) {
    // Early return if invalid code is needed but not provided
    if (!useValidCode && !testData.invalidCode) {
      throw new Error("Invalid code not provided in test data");
    }

    // First handle the popup if it's present
    try {
      await this.closePopup();
    } catch (error) {
      // Popup might not be present, continue with the test
      // console.log('No popup found or already closed');
    }

    await this.enterEmail(testData.email);
    await this.clickSendCode();

    // Default to invalid code
    let codeToUse: string = testData.invalidCode as string;

    // Override with valid code if needed
    if (useValidCode) {
      codeToUse = await this.extractCodeFromMessage();
    }

    await this.enterVerificationCode(codeToUse);
    await this.clickVerifyCode();

    return codeToUse;
  }
}
