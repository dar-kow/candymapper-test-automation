import { Locator, Page } from '@playwright/test';
import { ElementHelpers, urls } from '../utils';
import { HomePageComponents } from './components';

export class HomePageActions {
  private page: Page;
  private components: HomePageComponents;

  constructor(page: Page) {
    this.page = page;
    this.components = new HomePageComponents();
  }

  async navigateToHomePage() {
    await this.page.goto(urls.homePage);
  }

  async isPopupVisible() {
    const popup = this.page.locator(this.components.popupContainer);
    return await popup.isVisible();
  }

  async closePopup() {
    const closeButton = this.page.locator(this.components.popupCloseButton);
    await ElementHelpers.waitForState(closeButton, 'visible');
    await closeButton.click();
  }
}
