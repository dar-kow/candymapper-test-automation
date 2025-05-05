export class NavigationComponents {
  // Popup selectors
  popupCloseButton = "#popup-widget307423-close-icon";
  popup = "#popup-widget307423";

  // Main navigation selectors
  mainNav = 'ul[data-ux="NavFooter"]';
  visibleNavItems = 'ul[id="nav-307305"] li[style*="visibility: visible"]';
  navLinks = 'a[data-ux="NavLink"]';

  // More dropdown selectors
  moreButton = 'a[data-ux="NavLinkDropdown"][data-aid="NAV_MORE"]';
  moreDropdown = 'ul[id="more-307306"]';
  moreDropdownItems = 'ul[id="more-307306"] li[style*="visibility: visible"]';
  moreDropdownLinks = 'a[data-ux="NavMoreMenuLink"]';

  // Specific page elements selectors
  loginEmailField = 'input[data-aid="MEMBERSHIP_SSO_LOGIN_EMAIL"]';
  loginPasswordField = 'input[data-aid="MEMBERSHIP_SSO_LOGIN_PASSWORD"]';
  loginSubmitButton = 'input[data-aid="MEMBERSHIP_SSO_SUBMIT"]';

  // id variable that's why I use div attribute + nesting
  iframe = 'div[data-ux="Element"] iframe';
  loader = "div.loader";

  authorBioSection = "#author-bio";

  findMyCandyTitle = '[data-aid="HTML_SECTION_TITLE_RENDERED"]';

  automationSandboxTitle = '[data-aid="CONTENT_SECTION_TITLE_RENDERED"]';

  momTitle = '[data-aid="CONTENT_SECTION_TITLE_RENDERED"]';

  sandboxToolsButtons = [
    '[data-aid="CONTENT_CTA_BTN1_RENDERED"]',
    '[data-aid="CONTENT_CTA_BTN2_RENDERED"]',
    '[data-aid="CONTENT_CTA_BTN3_RENDERED"]',
    '[data-aid="CONTENT_CTA_BTN4_RENDERED"]',
  ];

  vampirasBlogTitle = '[data-aid="RSS_SECTION_TITLE_RENDERED"]';

  email = "#email";
}
