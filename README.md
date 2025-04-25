# CandyMapper Tests

Automated tests for the CandyMapper portal using Playwright.

## Project Overview

This project contains end-to-end tests for the CandyMapper website. The tests are built using Playwright and TypeScript, focusing on reusable components, clean code structure, and reliable test execution across multiple browsers.

## Requirements

- Node.js (>=18.0.0)
- npm

## Dependencies

- Playwright: Modern browser automation library
- TypeScript: Static typing for JavaScript
- ESLint: Code quality and style enforcement
- Prettier: Code formatting
- Faker: Test data generation

## Installation

```bash
# Clone the repository
git clone https://github.com/dar-kow/candymapper-test-automation

# Navigate to the project directory
cd candymapper-test-automation

# Install dependencies
npm install
```

## Test Execution Approach

### Running Tests

```bash
# Run all tests
npm test

# Run tests with headed browser
npm run test:hd

# Run tests with UI mode
npm run test:ui

# View test report
npm run show-report
```

### Browser Compatibility

The tests run on multiple browsers to ensure cross-browser compatibility:

- Chromium
- Firefox
- Chrome
- Safari
