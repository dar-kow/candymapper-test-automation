import { faker } from '@faker-js/faker';
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string | null;
  phone?: string;
  message: string;
}

export class TestData {
  static contactForm() {
    const baseData: ContactFormData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      phone: `+48${faker.string.numeric(9)}`,
      message: faker.lorem.sentence(),
    };

    return {
      withEmail: { ...baseData },
      withoutEmail: { ...baseData, email: null },
    };
  }
}

export const HomePageData = {
  url: 'https://candymapper.com/',
  expectedTitle: 'CandyMapper.Com',

  expectedSuccessText: 'Thank you for your inquiry! We will get back to you within 48 Years.',
  expectedEmailErrorText: 'Please enter a valid email address.',

  timeouts: {
    navigation: 10000,
    popup: 5000,
    form: 5000,
  },
};
