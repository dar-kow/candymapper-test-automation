import { faker } from "@faker-js/faker";
import { PartyActionTarget } from "./actions";
import { urls } from "../utils";
import { HalloweenPartyComponents } from "./components";

export interface PartyData {
  email: string;
  guests: number;
}

export class HalloweenPartyTestData {
  static getPartyData(includeEmail: boolean = true): PartyData {
    return {
      email: includeEmail ? faker.internet.email() : "",
      guests: faker.number.int({ min: 0, max: 2 }),
    };
  }

  static getInvalidEmail(): string {
    return "invalid-email";
  }
}

export const HalloweenPartyPageData = {
  expectedTitle: "Halloween Party",

  headings: {
    main: "Halloween Party",
    attendAParty: "Where Is The Party",
    subHeading: "A Few Questions And We Will Have A Party",
    themeHeading: "Party Theme",
    themeSubHeading: "What Is The Party Theme?",
    locationHeading: "Party Location",
    error404Heading: "404: Page Not Found",
    partyLocation: "Are you bringing any guests?",
  },

  messages: {
    emailError: "Please enter a valid email address.",
    confirmationSuccess: "If you supplied a real email we just send a validation to it.",
  },

  timeouts: {
    navigation: 10000,
    animation: 2000,
    form: 5000,
  },
};

export const PartyActionTargets = {
  hostParty: {
    buttonSelector: new HalloweenPartyComponents().hostPartyButton,
    expectedUrl: urls.hostParty,
    closePopup: true,
  } as PartyActionTarget,
  attendParty: {
    buttonSelector: new HalloweenPartyComponents().attendPartyButton,
    expectedUrl: urls.attendParty,
    closePopup: true,
  } as PartyActionTarget,
  zombiesTheme: {
    buttonSelector: new HalloweenPartyComponents().zombiesButton,
    expectedUrl: urls.partyLocation,
  } as PartyActionTarget,
  ghostsTheme: {
    buttonSelector: new HalloweenPartyComponents().ghostsButton,
    expectedUrl: urls.partyLocation,
  } as PartyActionTarget,
  zombietonLocation: {
    buttonSelector: new HalloweenPartyComponents().zombiesButton,
    expectedUrl: urls.partyLocation,
  } as PartyActionTarget,
  ghostvilleLocation: {
    buttonSelector: new HalloweenPartyComponents().ghostsButton,
    expectedUrl: urls.partyLocation,
  } as PartyActionTarget,
  goBack: {
    buttonSelector: new HalloweenPartyComponents().goBackButton,
    expectedUrl: urls.error404,
  } as PartyActionTarget,
};
