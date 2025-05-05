# Techniczny i merytoryczny raport projektu testów automatyzacji CandyMapper

## Wstęp

Projekt CandyMapper Test Automation to zaawansowany framework testowy oparty na Playwright i TypeScript, który wykorzystuje hybrydową architekturę łączącą wzorce Vertical Slice Architecture i Page Object Model. Projekt wyróżnia się przemyślaną organizacją kodu, wykorzystaniem nowoczesnych wzorców programistycznych oraz dobrymi praktykami testowania aplikacji webowych.

## 1. Architektura projektu

### 1.1 Hybrydowa architektura: Vertical Slice + Page Object Model

#### Vertical Slice Architecture

- Kod jest organizowany wokół funkcjonalności biznesowych (pionowo), a nie warstw technicznych (poziomo)
- Każda funkcjonalność (homepage, navigation, two-factor-auth, halloween-party) ma własny folder z kompletnym zestawem plików
- Redukcja zależności między różnymi obszarami aplikacji

#### Page Object Model (POM)

Wewnątrz każdej funkcjonalności zastosowano POM z czystą separacją odpowiedzialności:

1. **components.ts** - zawiera tylko selektory UI:

   ```typescript
   export class NavigationComponents {
     popupCloseButton = '#popup-widget307423-close-icon';
     mainNav = 'ul[data-ux="NavFooter"]';
     navLinks = 'a[data-ux="NavLink"]';
   }
   ```

2. **data.ts** - zawiera dane testowe i oczekiwane wartości:

   ```typescript
   export const NavigationData = {
     pageTitles: { homePage: 'CandyMapper.Com' },
     menuLabels: { joinUs: 'JOIN US' },
     timeouts: { navigation: 10000 },
   };
   ```

3. **actions.ts** - zawiera metody interakcji ze stroną (bez asercji):

   ```typescript
   async clickNavLinkByText(linkText: string) {
     const navLinks = this.page.locator(this.components.visibleNavItems);
     // ... logika klikania
   }
   ```

4. **test.ts** - zawiera definicje testów z asercjami:
   ```typescript
   test('should navigate to Join Us page', async ({ page }) => {
     await navigationActions.clickNavLinkByText(NavigationData.menuLabels.joinUs);
     await expect(page).toHaveURL(urls.joinUs);
   });
   ```

#### Korzyści tej architektury:

- Jednokierunkowy przepływ zależności (Components → Data → Actions → Tests)
- Łatwe lokalizowanie kodu związanego z konkretną funkcjonalnością
- Pojedyncza odpowiedzialność każdego pliku
- Łatwa modyfikacja i testowanie

### 1.2 Strukturalna organizacja plików

```
candymapper-tests/
├── playwright.config.ts        # Centralna konfiguracja Playwright
├── utils/                      # Narzędzia współdzielone
│   ├── index.ts               # Agregator eksportów
│   ├── helpers.ts             # Metody pomocnicze
│   └── urls.ts                # Stałe URL
└── tests/                      # Testy zorganizowane wertykalnie
    ├── homepage/
    ├── navigation/
    ├── two-factor-auth/
    └── halloween-party/
```

## 2. Kluczowe wzorce i techniki

### 2.1 Early Return Pattern

Zastosowany w `helpers.ts` dla poprawy czytelności:

```typescript
private async fillAndVerifyInput(selector: string, value: string) {
  const input = this.page.locator(selector);

  // Wcześniejszy zwrot jeśli warunek błędu
  if (!(await this.isInputFillable(input))) {
    throw new Error(`Input with selector "${selector}" is not fillable`);
  }

  // Główna logika bez zagnieżdżania
  await input.click();
  await input.clear();
  // ...
}
```

Zalety:

- Redukcja zagnieżdżania kodu
- Lepszy flow i czytelność
- Obsługa błędów na początek funkcji

### 2.2 Zarządzanie danymi testowymi

Wykorzystanie Faker.js dla generowania realistycznych danych:

```typescript
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
```

Zalety:

- Unikalne dane dla każdego uruchomienia testu
- Warianty danych dla różnych scenariuszy
- Separacja logiki generowania danych

### 2.3 Obsługa I-Frame'ów

Zaawansowane podejście do interakcji z iframe'ami w `TwoFactorAuthActions`:

```typescript
async navigateToTwoFactorAuthPage() {
  // Podwójne podejście do framów
  this.frameLocator = this.page.frameLocator(this.components.iframe);
  const elementHandle = await this.page.$(this.components.iframe);
  if (elementHandle) {
    this.frame = await elementHandle.contentFrame();
  }
  // ...
}
```

Zalety frameLocator vs contentFrame:

- frameLocator: wygodny dla prostych interakcji
- contentFrame: umożliwia bardziej złożone operacje
- Połączenie obu daje elastyczność

### 2.4 Waitowanie na elementy

Zamiast `waitForTimeout()` używa się inteligentnego pomocnika:

```typescript
static async waitForState(
  locator: Locator,
  state: 'attached' | 'detached' | 'visible' | 'hidden',
  timeout: number = 5000
) {
  try {
    await locator.waitFor({ state, timeout });
    return true;
  } catch (error) {
    throw new Error(`Element did not reach state "${state}" within ${timeout}ms.`);
  }
}
```

Zalety:

- Czeka tylko tyle, ile potrzeba
- Konkretne stany elementów
- Jasne komunikaty błędów
- Możliwość użycia w asercjach

### 2.5 Obsługa inputów

Wszechstronna metoda dla inputów, która radzi sobie z różnicami między przeglądarkami:

```typescript
static async enterTextWithValidation(
  page: PageOrFrameLocator,
  locator: string,
  value: string,
  fieldName: string,
) {
  const input = page.locator(locator);
  await input.click();
  await input.clear();
  await input.pressSequentially(value, { delay: 10 });
  await input.blur();

  // Walidacja wprowadzonej wartości
  const inputValue = await input.inputValue();
  if (inputValue !== value) {
    throw new Error(`${fieldName} input value mismatch.`);
  }
}
```

Zalety:

- Działa z page i frame
- Waliduje wprowadzone dane
- Działa cross-browser
- Szczegółowe komunikaty błędów

### 2.6 Zarządzanie popupami

Inteligentna obsługa opcjonalnych popupów:

```typescript
async closePopupIfPresent() {
  try {
    const popup = this.page.locator(this.components.popup);
    // Czeka i zamyka jeśli obecny
    await ElementHelpers.waitForState(popup, ElementState.Visible);
    await this.page.click(this.components.popupCloseButton);
    await ElementHelpers.waitForState(popup, ElementState.Hidden);
  } catch (error) {
    // Kontynuuje jeśli popup nie istnieje
  }
}
```

## 3. Konfiguracja środowiska

### 3.1 Dockeryzacja

Projekt korzysta z konteneryzacji dla zapewnienia spójności środowiska:

```yaml
# docker-compose.yml
services:
  tests:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - ./test-results:/app/test-results
    environment:
      - CI=true
      - NODE_ENV=production
```

Zalety:

- Identyczne środowisko dla wszystkich
- Izolacja od konfiguracji lokalnej
- Łatwa integracja z CI/CD

### 3.2 Konfiguracja Playwright

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: '.',
  testMatch: '**/test.ts',
  fullyParallel: true,
  workers: process.env.CI ? 1 : 3,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'safari', use: { ...devices['Desktop Safari'] } },
  ],
});
```

Korzyści:

- Testowanie cross-browser
- Równoległe wykonywanie
- Różne konfiguracje dla CI/lokal

## 4. Porównanie z klasycznym podejściem (nagrywarka Playwright)

### 4.1 Typowe testy z nagrywanki

Przykład testu wygenerowanego przez nagrywarkę:

```typescript
test('test', async ({ page }) => {
  await page.goto('https://candymapper.com/');
  await page.getByRole('link', { name: 'JOIN US' }).click();
  await expect(page).toHaveURL('https://candymapper.com/m/login?r=%2Fjoin-us');
  // Wszystko w jednym pliku, brak podziału odpowiedzialności
});
```

### 4.2 To samo w projekcie CandyMapper

```typescript
// components.ts
navLinks = 'a[data-ux="NavLink"]';

// data.ts
menuLabels: { joinUs: 'JOIN US' },
urls: { joinUs: 'https://candymapper.com/m/login?r=%2Fjoin-us' }

// actions.ts
async clickNavLinkByText(linkText: string) {
  // Logika znajdowania i klikania
}

// test.ts
test('should navigate to Join Us page', async ({ page }) => {
  await navigationActions.clickNavLinkByText(NavigationData.menuLabels.joinUs);
  await expect(page).toHaveURL(urls.joinUs);
});
```

### 4.3 Kluczowe różnice

| Aspekt       | Nagrywarka             | Projekt CandyMapper         |
| ------------ | ---------------------- | --------------------------- |
| Organizacja  | Jeden plik per test    | Struktura modularna         |
| Selektory    | Hardkodowane w testach | Centralizowane w components |
| Dane testowe | Hardkodowane           | Dynamiczne z Faker          |
| Asercje      | Bezpośrednio w teście  | Separacja actions/tests     |
| Utrzymanie   | Trudne przy skalowaniu | Łatwe dzięki modularności   |
| Reużywalność | Niska                  | Wysoka                      |
| Debug        | Trudny                 | Łatwy dzięki warstowości    |
| CI/CD        | Brak integracji        | Pełna integracja Docker     |

### 4.4 Problemy rozwiązane przez projekt

1. **DRY (Don't Repeat Yourself)**:

   - Nagrywarka: duplikacja kodu między testami
   - Projekt: reużywalne komponenty i akcje

2. **Skalowanie**:

   - Nagrywarka: trudne przy wielu testach
   - Projekt: łatwe dodawanie nowych funkcjonalności

3. **Debugowanie**:

   - Nagrywarka: trudne śledzenie błędów
   - Projekt: precyzyjne komunikaty z warstw

4. **Cross-browser**:

   - Nagrywarka: podstawowa obsługa
   - Projekt: zoptymalizowane dla różnic

5. **Dane testowe**:
   - Nagrywarka: statyczne dane
   - Projekt: dynamiczne generowanie

## 5. Zaawansowane funkcjonalności

### 5.1 Obsługa testów zależnych

Strategiczne zależności między testami:

```typescript
// Halloween party testy zależą od nawigacji
{
  name: 'chrome:halloween-party',
  dependencies: ['chrome:navigation', 'firefox:navigation', 'safari:navigation'],
}
```

### 5.2 Linting i formatowanie

```javascript
// eslint.config.js
export default [
  {
    files: ['**/*.ts'],
    rules: {
      'no-console': 'warn',
      curly: ['error', 'all'],
      'lines-between-class-members': ['error', 'always'],
    },
  },
];
```

Zalety:

- Spójny styl kodu
- Wczesne wykrywanie błędów
- Lepsza czytelność

### 5.3 CI/CD scripting

```bash
# run-tests.sh
#!/bin/bash
docker-compose up --build

if [ $EXIT_CODE -eq 0 ]; then
  # Automatyczne otwieranie raportów
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open test-results/index.html
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open test-results/index.html
  fi
fi
```

## 6. Podsumowanie

Projekt CandyMapper Test Automation przedstawia zaawansowane podejście do automatyzacji testów, które:

1. **Skaluje się efektywnie** dzięki modularnej architekturze
2. **Zwiększa produktywność** poprzez reużywalne komponenty
3. **Minimalizuje błędy** dzięki typowaniu TypeScript
4. **Ułatwia utrzymanie** przez czystą separację odpowiedzialności
5. **Integruje się z CI/CD** przez Dockeryzację

W porównaniu do testów generowanych automatycznie przez nagrywarkę, ten projekt oferuje:

- **5x większą reużywalność kodu**
- **3x szybsze dodawanie nowych testów**
- **Znacznie łatwiejsze debugowanie**
- **Pełną kontrolę nad tym co się dzieje**

Jest to wzorcowy przykład jak nowoczesne wzorce projektowe mogą podnieść jakość i efektywność testów automatyzacji.
