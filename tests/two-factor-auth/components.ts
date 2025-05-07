export class TwoFactorAuthComponents {
  // that was tricky I didn't even notice that iframe
  iframe = 'div[data-ux="Element"] iframe';

  popupContainter = "#popup-widget88933";
  popupCloseButton = "#popup-widget88933-close-icon";

  heading = "h1";

  emailSection = ".email-section";
  emailInput = "#email";
  sendCodeButton = ".email-section button";

  verificationSection = "#verificationSection";
  codeInput = "#code";
  verifyCodeButton = ".verification-section button";

  messageContainer = "#message";
  successMessage = ".message.success";
  errorMessage = ".message.error";
}
