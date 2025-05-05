import { Locator, Page } from "@playwright/test";
import { ElementHelpers, urls } from "../utils";
import { HomePageComponents } from "./components";
import { ContactFormData } from "./data";

export class HomePageActions {
  private page: Page;
  private components: HomePageComponents;

  constructor(page: Page) {
    this.page = page;
    this.components = new HomePageComponents();
  }

  async navigateToHomePage() {
    await this.page.goto(urls.homePage);
    const isUrlCorrect = await ElementHelpers.waitForUrlContains(this.page, urls.homePage);
    if (!isUrlCorrect) {
      throw new Error(`URL did not reach the expected state: ${urls.homePage}`);
    }
  }

  async isPopupVisible() {
    const popup = this.page.locator(this.components.popupContainer);
    return await popup.isVisible();
  }

  async closePopup() {
    const closeButton = this.page.locator(this.components.popupCloseButton);
    await ElementHelpers.waitForState(closeButton, "visible");
    await closeButton.click();
  }

  private async isInputFillable(input: Locator) {
    const isDisabled = await input.getAttribute("disabled");
    const isReadonly = await input.getAttribute("readonly");
    return isDisabled === null && isReadonly === null;
  }

  // interestingly behaving inputs - fill does not provide full effectiveness, hence pressSequentially
  private async fillAndVerifyInput(selector: string, value: string) {
    const input = this.page.locator(selector);

    await input.scrollIntoViewIfNeeded();

    await ElementHelpers.waitForState(input, "visible");

    if (!(await this.isInputFillable(input))) {
      throw new Error(`Input with selector "${selector}" is not fillable (disabled or readonly)`);
    }
    // this is for safari to fit in the timeout
    const browserName = this.page.context().browser()?.browserType().name();
    const delay = browserName === "webkit" ? 0 : 10;

    await input.focus();
    await input.click();
    await input.clear();
    await input.pressSequentially(value, { delay: delay });
    await input.blur();

    // Here I’m using the Return-Early Pattern (a.k.a. Guard Clause)
    // so I don’t have to check that everything’s OK
    // we expect the best, but we’re prepared for the worst. :P
    const inputValue = await input.inputValue();
    if (inputValue !== value) {
      throw new Error(
        `Input value mismatch for selector "${selector}". Expected: "${value}", got: "${inputValue}"`,
      );
    }
  }

  // interesting action, the first entered email gives 100% effectiveness when clicking submit
  async fillContactForm(formData: ContactFormData) {
    if (formData.email !== null) {
      await this.fillAndVerifyInput(this.components.emailInput, formData.email);
    } else {
      await this.fillAndVerifyInput(this.components.emailInput, "");
    }
    await this.fillAndVerifyInput(this.components.firstNameInput, formData.firstName);
    await this.fillAndVerifyInput(this.components.lastNameInput, formData.lastName);

    if (formData.phone) {
      await this.fillAndVerifyInput(this.components.phoneInput, formData.phone);
    }

    await this.fillAndVerifyInput(this.components.messageTextarea, formData.message);
  }

  async submitContactForm() {
    const submitButton = this.page.locator(this.components.submitButton);
    await submitButton.scrollIntoViewIfNeeded();
    await ElementHelpers.waitForState(submitButton, "visible");
    await submitButton.hover();
    await submitButton.click();
  }

  async isSuccessMessageVisible() {
    const successMessage = this.page.locator(this.components.formSubmitSuccess);
    await ElementHelpers.waitForState(successMessage, "visible", 15000);
    return true;
  }

  async getSuccessMessageText() {
    const successMessage = this.page.locator(this.components.formSuccessMessage);
    return await successMessage.textContent();
  }

  async isEmailErrorVisible() {
    const errorMessage = this.page.locator(this.components.emailErrorMessage);
    return await errorMessage.isVisible();
  }

  async getEmailErrorText() {
    const errorMessage = this.page.locator(this.components.emailErrorMessage);
    return await errorMessage.textContent();
  }

  async getMainHeadingText() {
    const heading = this.page.locator(this.components.mainHeading);
    return await heading.textContent();
  }
}
