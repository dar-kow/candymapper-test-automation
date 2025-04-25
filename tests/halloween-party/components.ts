export class HalloweenPartyComponents {
  // Main Halloween Party page
  mainHeading = '[data-aid="SECTION_TITLE_RENDERED"]';
  secondaryHeading = '[data-aid="SECONDARY_TITLE_RENDERED"]';
  hostPartyButton = 'a[href="/host-a-party-1"]';
  attendPartyButton = 'a[href="/attend-a-party"]';

  // Host a Party page
  zombiesButton = 'a[href="/party-location"]:nth-of-type(1)';
  ghostsButton = 'a[href="/party-location"]:nth-of-type(2)';

  // Attend a Party page
  goBackButton = 'a[href="/error-404"]';

  // Party Location page
  guestDropdown = 'select#guests';
  guestOptions = 'select#guests option';
  emailInput = 'input[role="textbox"]';
  submitButton = 'button[data-aid="SUBSCRIBE_SUBMIT_BUTTON_REND"]';
  emailError = '[data-aid="SUBSCRIBE_EMAIL_ERR_REND"]';
  confirmationMessage = '[data-aid="CONFIRM_TEXT_REND"]';
  htmlSection = '[data-aid="HTML_SECTION_TITLE_RENDERED"]';

  // Popup components
  popupContainer = '#popup-widget190016';
  popupCloseButton = '#popup-widget190016-close-icon';

  // iframe components
  iframe = 'div[data-ux="Element"] iframe';
}
