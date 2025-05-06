import { Page, BrowserContext, FrameLocator } from "@playwright/test";
import { NavigationComponents } from "./components";
import { ElementHelpers, ElementState, MenuType, urls } from "../utils";

export class NavigationActions {
  private page: Page;
  private components: NavigationComponents;
  private frameLocator: FrameLocator | undefined;

  constructor(page: Page) {
    this.page = page;
    this.components = new NavigationComponents();
  }

  async navigateToHomePage() {
    await this.page.goto(urls.homePage);
    const isUrlCorrect = await ElementHelpers.waitForUrlContains(this.page, urls.homePage);
    if (!isUrlCorrect) {
      throw new Error(`URL did not reach the expected state: ${urls.homePage}`);
    }
  }

  /**
   * Clicks a navigation or dropdown link by text.
   * @param linkText - Visible text of the link to click.
   * @param type - MenuType.Nav for main nav, MenuType.Dropdown for more menu dropdown.
   */
  async clickMenuLinkByText(linkText: string, type: MenuType) {
    let containerSelector: string;
    let linkSelector: string;

    switch (type) {
      case MenuType.Nav:
        containerSelector = this.components.visibleNavItems;
        linkSelector = this.components.navLinks;
        break;
      case MenuType.Dropdown:
        containerSelector = this.components.moreDropdownItems;
        linkSelector = this.components.moreDropdownLinks;
        break;
      default:
        throw new Error(`Unknown menu type: ${type}`);
    }

    const links = this.page.locator(containerSelector).locator(linkSelector);
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const text = await links.nth(i).textContent();
      if (text?.trim() === linkText) {
        await links.nth(i).click();
        return;
      }
    }

    throw new Error(`Link with text "${linkText}" not found in selector: ${containerSelector}`);
  }

  async clickNavLinkAndWaitForNewPage(linkText: string, context: BrowserContext) {
    const pagesBefore = context.pages().length;
    await this.clickMenuLinkByText(linkText, MenuType.Nav);
    await context.waitForEvent("page");
    return context.pages()[pagesBefore];
  }

  async clickMoreDropdown() {
    const moreButton = this.page.locator(this.components.moreButton);
    await ElementHelpers.waitForState(moreButton, ElementState.Visible);
    await moreButton.click();

    // Wait for dropdown to be visible
    const dropdown = this.page.locator(this.components.moreDropdown);
    await ElementHelpers.waitForState(dropdown, ElementState.Visible);
  }

  async clickMoreMenuLinkAndWaitForNewPage(linkText: string, context: BrowserContext) {
    const pagesBefore = context.pages().length;
    await this.clickMenuLinkByText(linkText, MenuType.Dropdown);
    await context.waitForEvent("page");
    return context.pages()[pagesBefore];
  }

  async isLoaderVisible() {
    // First check if you have a frameLocator already initialized
    if (!this.frameLocator) {
      // Initialize the frameLocator if not already done
      this.frameLocator = this.page.frameLocator(this.components.iframe);
    }

    // Now look for the loader inside the iframe
    const loader = this.frameLocator.locator(this.components.loader);
    return await ElementHelpers.waitForState(loader, ElementState.Visible);
  }

  async isAuthorBioVisible(targetPage: Page = this.page) {
    const bioSection = targetPage.locator(this.components.authorBioSection);

    const isBioVisible = await ElementHelpers.waitForState(bioSection, ElementState.Visible, 10000);

    return isBioVisible;
  }

  async getFindMyCandyTitle() {
    const titleElement = this.page.locator(this.components.findMyCandyTitle);
    await ElementHelpers.waitForState(titleElement, ElementState.Visible);
    return await titleElement.textContent();
  }

  async getAutomationSandboxTitle() {
    const titleElement = this.page.locator(this.components.automationSandboxTitle);
    return await titleElement.textContent();
  }

  async getMagicObjectModelTitle() {
    const titleElement = this.page.locator(this.components.momTitle);
    return await titleElement.textContent();
  }

  async areSandboxToolButtonsVisible() {
    let allVisible = true;
    for (const buttonSelector of this.components.sandboxToolsButtons) {
      const button = this.page.locator(buttonSelector);
      const isVisible = await button.isVisible();
      allVisible = allVisible && isVisible;
    }
    return allVisible;
  }

  async getVampirasBlogTitle() {
    const titleElement = this.page.locator(this.components.vampirasBlogTitle);
    return await titleElement.textContent();
  }

  async is2FAIframeVisible() {
    try {
      const iframe = this.page.locator(this.components.iframe);
      const isIframePresent = await ElementHelpers.waitForState(iframe, ElementState.Visible);

      if (!isIframePresent) return false;

      const frameLocator = this.page.frameLocator(this.components.iframe);

      // Check if the email input is visible inside the iframe
      const emailInput = frameLocator.locator(this.components.email);
      return await emailInput.isVisible().catch(() => false);
    } catch (error) {
      console.error("Error checking email field in iframe:", error);
      return false;
    }
  }

  async closePopupIfPresent() {
    try {
      const popup = this.page.locator(this.components.popup);
      // Wait for popup to load
      await ElementHelpers.waitForState(popup, ElementState.Visible);

      // Click the close button
      await this.page.click(this.components.popupCloseButton);

      // Wait for popup to disappear
      await ElementHelpers.waitForState(popup, ElementState.Hidden);
    } catch (error) {
      // If popup doesn't appear or times out, just continue
      // console.log('No popup found or already closed');
    }
  }
}
