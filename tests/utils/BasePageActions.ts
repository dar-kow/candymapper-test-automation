import { Page } from "@playwright/test";
import { ElementHelpers, ElementState } from "../utils";

export abstract class BasePageActions {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  protected abstract getPopupSelector(): string;
  protected abstract getCloseButtonSelector(): string;

  async isPopupVisible() {
    try {
      const popupSelector = this.getPopupSelector();
      const popup = this.page.locator(popupSelector);
      return await popup.isVisible();
    } catch (error) {
      return false;
    }
  }

  async closePopup() {
    const popupSelector = this.getPopupSelector();
    const closeButtonSelector = this.getCloseButtonSelector();

    const popupLocator = this.page.locator(popupSelector);
    const closeButtonLocator = this.page.locator(closeButtonSelector);

    await ElementHelpers.waitForState(closeButtonLocator, ElementState.Visible);
    await closeButtonLocator.click();
    await ElementHelpers.waitForState(popupLocator, ElementState.Hidden);
  }

  async closePopupIfPresent() {
    try {
      const isVisible = await this.isPopupVisible();

      if (isVisible) {
        await this.closePopup();
      }
    } catch (error) {
      // If popup doesn't appear or times out, just continue
      console.log("No popup found or already closed");
    }
  }
}
