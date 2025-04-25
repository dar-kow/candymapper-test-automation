import { Locator, Page } from '@playwright/test';
import { urls } from '../utils';

export class HomePageActions {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToHomePage() {
    await this.page.goto(urls.homePage);
  }
}
