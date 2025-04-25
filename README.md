# CandyMapper Tests

Automated tests for the CandyMapper portal using Playwright.

For detailed test case documentation, see [TEST-CASES.md](./TEST-CASES.md).

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

## Project Structure

The project follows a Page Object Model (POM) approach with additional separation of concerns:

```
candymapper-tests/
├── playwright.config.ts        # Playwright configuration
├── utils/                      # Utility functions and constants
│   ├── index.ts                # Export consolidation for easier imports
│   ├── helpers.ts              # Shared helper methods
│   └── urls.ts                 # URL constants
├── pages/                      # Page objects
│   └── homepage/               # Homepage-specific files
│       ├── actions.ts          # Page actions (e.g., fillContactForm)
│       ├── components.ts       # Page component selectors
│       ├── data.ts             # Test data and expected results
│       └── test.ts             # Test definitions
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

## Best Practices Implemented

### 1. No Arbitrary Wait Times

Instead of using `waitForTimeout()`, the tests utilize the `ElementHelpers.waitForState()` method, which waits for specific element states (visible, hidden, attached, detached).

More info: [Avoiding waitForTimeout](https://portfolio.sdet.pl/articles/avoiding-wait-for-timeout)

### 2. Robust Input Handling

For input fields that may behave differently across browsers, a comprehensive approach is used:

```typescript
await input.click();
await input.clear();
await input.pressSequentially(value, { delay: 10 });
await input.blur();
```

This ensures consistent behavior where `fill()` might not be reliable across all browsers.

### 3. Clean Code Structure

- Separation of selectors (components.ts)
- Test data and expected results (data.ts)
- Page actions without assertions (actions.ts)
- Test logic with assertions (test.ts)

### 4. Reusable Components

Utility methods are centralized in the helpers class for reusability and easier maintenance.

### 5. Type Safety

TypeScript interfaces are used to ensure type safety throughout the project, eliminating the use of `any` types.

### 6. Conditional Logic

Preference for clear conditional structures over extensive use of `else` blocks, favoring `switch/case` where appropriate.

### 7. Early Return Pattern

Implementation of the Early Return Pattern to improve code readability and reduce nesting. This pattern involves checking for error or edge conditions first and returning early, rather than nesting the main logic inside conditional blocks.

More info: [Early Return Pattern](https://medium.com/swlh/return-early-pattern-3d18a41bba8)
