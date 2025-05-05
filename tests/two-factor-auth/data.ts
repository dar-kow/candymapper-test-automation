import { faker } from "@faker-js/faker";

export interface TwoFactorAuthData {
  email: string;
  validCode?: string;
  invalidCode?: string;
}

export class TwoFactorAuthTestData {
  static getData(): TwoFactorAuthData {
    return {
      email: faker.internet.email(),
      invalidCode: "123456",
    };
  }
}

export const TwoFactorAuthPageData = {
  url: "https://candymapper.com/2fa-validation-code",
  expectedTitle: "2FA Validation code",
  expectedHeading: "2FA Code Simulation",

  invalidEmailMessage: "Please enter a valid email address",
  codeSentMessage: "Code sent!",
  verificationSuccessMessage: "Verification successful!",
  verificationFailureMessage: "Invalid code. Please try again.",

  timeouts: {
    navigation: 10000,
    animation: 2000,
    verification: 5000,
  },
};
