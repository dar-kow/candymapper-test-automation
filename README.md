# CandyMapper Tests

[English](#english-version) | [Polski](#polska-wersja)

<a id="english-version"></a>

## English Version

Automated tests for the CandyMapper portal using Playwright.

For detailed test case documentation, see:

- [Homepage Tests](./TEST-CASES-HOME-PAGE.md)
- [Two-Factor Authentication Tests](./TEST-CASE-2FA.md)
- [Navigation Tests](./TEST-CASES-NAVIGATION.md)
- [Halloween Party Tests](./TEST-CASE-HALLOWEEN-PARTY.md)

### Project Overview

This project contains end-to-end tests for the CandyMapper website. The tests are built using Playwright and TypeScript, focusing on reusable components, clean code structure, and reliable test execution across multiple browsers.

### Requirements

- Node.js (>=18.0.0)
- npm

### Dependencies

- Playwright: Modern browser automation library
- TypeScript: Static typing for JavaScript
- ESLint: Code quality and style enforcement
- Prettier: Code formatting
- Faker: Test data generation

### Installation

```bash
# Clone the repository
git clone https://github.com/dar-kow/candymapper-test-automation

# Navigate to the project directory
cd candymapper-test-automation

# Install dependencies
npm install
```

### Project Structure

The project follows a hybrid approach combining Vertical Slice Architecture and Page Object Model (POM) patterns:

```
candymapper-tests/
├── playwright.config.ts        # Playwright configuration
├── utils/                      # Utility functions and constants
│   ├── index.ts                # Export consolidation for easier imports
│   ├── helpers.ts              # Shared helper methods
│   └── urls.ts                 # URL constants
├── tests/                      # Test modules organized by feature
    ├── homepage/               # Homepage-specific files
    │   ├── actions.ts          # Page actions (e.g., fillContactForm)
    │   ├── components.ts       # Page component selectors
    │   ├── data.ts             # Test data and expected results
    │   └── test.ts             # Test definitions
    │
    ├── navigation/             # Navigation-specific files
    │   ├── actions.ts          # Page actions (e.g., clickNavLinkByText)
    │   ├── components.ts       # Navigation component selectors
    │   ├── data.ts             # Navigation labels and expected results
    │   └── test.ts             # Test definitions
    │
    ├── two-factor-auth/        # Two-Factor Authentication files
    │   ├── actions.ts          # Page actions (e.g., completeTwoFactorAuth)
    │   ├── components.ts       # Page component selectors
    │   ├── data.ts             # Test data and expected results
    │   └── test.ts             # Test definitions
    │
    └── halloween-party/        # Halloween Party files
        ├── actions.ts          # Page actions (e.g., selectTheme)
        ├── components.ts       # Page component selectors
        ├── data.ts             # Test data and expected results
        └── test.ts             # Test definitions
```

### Implementation Approach

The tests follow a hybrid architecture combining Vertical Slice and Page Object Model patterns:

1. **Vertical Slice Architecture**: Code is organized around business features (vertically) rather than technical layers (horizontally)

   - Code is grouped by functionality (e.g., two-factor-auth, homepage)
   - Each functionality has its own component, action, data, and test files

2. **Page Object Model (POM)**: Within each functionality, there is a clear separation of:
   - **Components (components.ts)**: Contains only UI element locators
   - **Actions (actions.ts)**: Contains page interactions without assertions
   - **Data (data.ts)**: Contains test data and expected results
   - **Tests (test.ts)**: Contains test cases with assertions

Dependencies between files:

- **Components**: No dependencies
- **Data**: No dependencies
- **Actions**: Depends on Components and Data
- **Tests**: Depends on Components, Data and Actions

This architecture provides:

- Clear separation of concerns
- Single responsibility per file
- Dependencies flowing in one direction
- Code reusability
- Easier maintenance

### Test Execution Approach

#### Running Tests

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

#### Browser Compatibility

The tests run on multiple browsers to ensure cross-browser compatibility:

- Chromium
- Firefox
- Chrome
- Safari

### Best Practices Implemented

#### 1. No Arbitrary Wait Times

Instead of using `waitForTimeout()`, the tests utilize the `ElementHelpers.waitForState()` method, which waits for specific element states (visible, hidden, attached, detached).

More info: [Avoiding waitForTimeout](https://portfolio.sdet.pl/articles/avoiding-wait-for-timeout)

#### 2. Robust Input Handling

For input fields that may behave differently across browsers, a comprehensive approach is used:

```typescript
await input.click();
await input.clear();
await input.pressSequentially(value, { delay: 10 });
await input.blur();
```

This ensures consistent behavior where `fill()` might not be reliable across all browsers.

#### 3. Clean Code Structure

- Separation of selectors (components.ts)
- Test data and expected results (data.ts)
- Page actions without assertions (actions.ts)
- Test logic with assertions (test.ts)

#### 4. Reusable Components

Utility methods are centralized in the helpers class for reusability and easier maintenance.

#### 5. Type Safety

TypeScript interfaces are used to ensure type safety throughout the project, eliminating the use of `any` types.

#### 6. Early Return Pattern

Implementation of the Early Return Pattern to improve code readability and reduce nesting. This pattern involves checking for error or edge conditions first and returning early, rather than nesting the main logic inside conditional blocks.

More info: [Early Return Pattern](https://medium.com/swlh/return-early-pattern-3d18a41bba8)

#### 7. Iframe Handling

The Two-Factor Authentication tests showcase advanced iframe handling techniques, using both Playwright's `frameLocator()` and direct frame access via `contentFrame()` for robust element interactions within nested content.

---

<a id="polska-wersja"></a>

## Polska Wersja

Zautomatyzowane testy dla portalu CandyMapper z wykorzystaniem Playwright.

Szczegółowa dokumentacja przypadków testowych:

- [Testy strony głównej](./TEST-CASES-HOME-PAGE.md)
- [Testy uwierzytelniania dwuskładnikowego](./TEST-CASE-2FA.md)
- [Testy nawigacji](./TEST-CASES-NAVIGATION.md)
- [Testy Halloween Party](./TEST-CASE-HALLOWEEN-PARTY.md)

### Przegląd projektu

Projekt zawiera testy end-to-end dla strony internetowej CandyMapper. Testy zostały zbudowane przy użyciu Playwright i TypeScript, koncentrując się na wielokrotnym wykorzystaniu komponentów, czystej strukturze kodu i niezawodnym wykonywaniu testów w różnych przeglądarkach.

### Wymagania

- Node.js (>=18.0.0)
- npm

### Zależności

- Playwright: Nowoczesna biblioteka do automatyzacji przeglądarek
- TypeScript: Statyczne typowanie dla JavaScript
- ESLint: Narzędzie do kontroli jakości i stylu kodu
- Prettier: Formatowanie kodu
- Faker: Generowanie danych testowych

### Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/dar-kow/candymapper-test-automation

# Przejście do katalogu projektu
cd candymapper-test-automation

# Instalacja zależności
npm install
```

### Struktura projektu

Projekt wykorzystuje hybrydowe podejście łączące architekturę Vertical Slice i wzorzec Page Object Model (POM):

```
candymapper-tests/
├── playwright.config.ts        # Konfiguracja Playwright
├── utils/                      # Funkcje narzędziowe i stałe
│   ├── index.ts                # Konsolidacja eksportów dla łatwiejszych importów
│   ├── helpers.ts              # Współdzielone metody pomocnicze
│   └── urls.ts                 # Stałe URL
├── tests/                      # Moduły testowe zorganizowane według funkcjonalności
    ├── homepage/               # Pliki specyficzne dla strony głównej
    │   ├── actions.ts          # Akcje na stronie (np. fillContactForm)
    │   ├── components.ts       # Selektory komponentów strony
    │   ├── data.ts             # Dane testowe i oczekiwane wyniki
    │   └── test.ts             # Definicje testów
    │
    ├── navigation/             # Pliki specyficzne dla nawigacji
    │   ├── actions.ts          # Akcje na stronie (np. clickNavLinkByText)
    │   ├── components.ts       # Selektory komponentów nawigacji
    │   ├── data.ts             # Etykiety nawigacji i oczekiwane wyniki
    │   └── test.ts             # Definicje testów
    │
    ├── two-factor-auth/        # Pliki uwierzytelniania dwuskładnikowego
    │   ├── actions.ts          # Akcje na stronie (np. completeTwoFactorAuth)
    │   ├── components.ts       # Selektory komponentów strony
    │   ├── data.ts             # Dane testowe i oczekiwane wyniki
    │   └── test.ts             # Definicje testów
    │
    └── halloween-party/        # Pliki Halloween Party
        ├── actions.ts          # Akcje na stronie (np. selectTheme)
        ├── components.ts       # Selektory komponentów strony
        ├── data.ts             # Dane testowe i oczekiwane wyniki
        └── test.ts             # Definicje testów
```

### Podejście implementacyjne

Testy opierają się na hybrydowej architekturze łączącej wzorce Vertical Slice i Page Object Model:

1. **Architektura Vertical Slice**: Kod organizowany jest wokół funkcjonalności biznesowych (pionowo), a nie warstw technicznych (poziomo)

   - Kod jest pogrupowany wg funkcjonalności (np. two-factor-auth, homepage)
   - Każda funkcjonalność ma własne pliki komponentów, akcji, danych i testów

2. **Page Object Model (POM)**: Wewnątrz każdej funkcjonalności, istnieje wyraźny podział na:
   - **Components (components.ts)**: Zawiera tylko lokatory elementów UI
   - **Actions (actions.ts)**: Zawiera interakcje ze stroną bez asercji
   - **Data (data.ts)**: Zawiera dane testowe i oczekiwane rezultaty
   - **Tests (test.ts)**: Zawiera przypadki testowe z asercjami

Zależności między plikami:

- **Components**: Brak zależności
- **Data**: Brak zależności
- **Actions**: Zależy od Components i Data
- **Tests**: Zależy od Components, Data i Actions

Ta architektura zapewnia:

- Wyraźny podział odpowiedzialności
- Jedną odpowiedzialność per plik
- Zależności płynące w jednym kierunku
- Możliwość ponownego wykorzystania kodu
- Łatwiejsze utrzymanie

### Podejście do wykonywania testów

#### Uruchamianie testów

```bash
# Uruchom wszystkie testy
npm test

# Uruchom testy z widoczną przeglądarką
npm run test:hd

# Uruchom testy w trybie UI
npm run test:ui

# Wyświetl raport z testów
npm run show-report
```

#### Kompatybilność z przeglądarkami

Testy działają na wielu przeglądarkach, aby zapewnić kompatybilność:

- Chromium
- Firefox
- Chrome
- Safari

### Zaimplementowane najlepsze praktyki

#### 1. Brak arbitralnych czasów oczekiwania

Zamiast używać `waitForTimeout()`, testy wykorzystują metodę `ElementHelpers.waitForState()`, która czeka na konkretne stany elementów (widoczny, ukryty, dołączony, odłączony).

Więcej informacji: [Avoiding waitForTimeout](https://portfolio.sdet.pl/articles/avoiding-wait-for-timeout)

#### 2. Solidna obsługa pól wprowadzania

Dla pól wprowadzania, które mogą zachowywać się różnie w różnych przeglądarkach, używane jest kompleksowe podejście:

```typescript
await input.click();
await input.clear();
await input.pressSequentially(value, { delay: 10 });
await input.blur();
```

Zapewnia to spójne zachowanie, gdy `fill()` może nie być niezawodne we wszystkich przeglądarkach.

#### 3. Czysta struktura kodu

- Separacja selektorów (components.ts)
- Dane testowe i oczekiwane wyniki (data.ts)
- Akcje na stronie bez asercji (actions.ts)
- Logika testowa z asercjami (test.ts)

#### 4. Komponenty wielokrotnego użytku

Metody narzędziowe są scentralizowane w klasie pomocników dla lepszego wykorzystania i łatwiejszego utrzymania.

#### 5. Bezpieczeństwo typów

Interfejsy TypeScript są używane do zapewnienia bezpieczeństwa typów w całym projekcie, eliminując użycie typów `any`.

#### 6. Wzorzec wczesnego powrotu (Early Return Pattern)

Implementacja wzorca wczesnego powrotu, aby poprawić czytelność kodu i zmniejszyć zagnieżdżenie. Ten wzorzec polega na sprawdzaniu warunków błędu lub warunków brzegowych najpierw i wczesnym powrocie, zamiast zagnieżdżania głównej logiki wewnątrz bloków warunkowych.

Więcej informacji: [Early Return Pattern](https://medium.com/swlh/return-early-pattern-3d18a41bba8)

#### 7. Obsługa iframe

Testy uwierzytelniania dwuskładnikowego pokazują zaawansowane techniki obsługi iframe, używając zarówno `frameLocator()` Playwright, jak i bezpośredniego dostępu do ramki przez `contentFrame()` dla solidnych interakcji z elementami wewnątrz zagnieżdżonej zawartości.
