# Cypress E2E Tests Documentation

## Overview

This directory contains end-to-end (E2E) tests for the Team-Up authentication system using Cypress. The tests cover all authentication pages and flows, including Login, Register, and navigation between pages.

## Test Structure

### Test Files

1. **`cypress/e2e/auth/login.cy.ts`**
   - Tests for the Login page
   - Covers form validation, successful/failed login flows, navigation, and Google sign-in

2. **`cypress/e2e/auth/register.cy.ts`**
   - Tests for the Register page
   - Covers form validation, successful/failed registration flows, role selection, and Google sign-up

3. **`cypress/e2e/auth/navigation.cy.ts`**
   - Tests for navigation between auth pages
   - Covers direct URL access, navigation flows, and post-authentication routing

## Running Tests

### Prerequisites

1. **Start the development server:**
   ```bash
   npm run dev
   ```
   The server should be running on `http://localhost:5173` (default Vite port)

2. **Ensure the application is accessible** at the base URL configured in `cypress.config.ts`

### Running Tests in Interactive Mode

Open Cypress Test Runner (recommended for development):
```bash
npm run cypress:open
```

This opens the Cypress GUI where you can:
- Select which tests to run
- Watch tests execute in real-time
- Debug tests interactively

### Running Tests in Headless Mode

Run all tests in headless mode (for CI/CD):
```bash
npm run cypress:run
```

Or use the alias:
```bash
npm run test:e2e
```

## Test Coverage

### Login Page Tests (`login.cy.ts`)

✅ **Page Rendering**
- All UI elements are visible
- Form inputs, labels, buttons, and links are present

✅ **Form Validation**
- Invalid email format validation
- Password minimum length validation
- Valid form submission

✅ **Successful Login Flow**
- Login as Student → navigates to `/student/home`
- Login as Instructor → navigates to `/instructor/home`
- Remember me checkbox functionality

✅ **Failed Login Flow**
- Error message display for invalid credentials
- Error message display for server errors

✅ **Navigation**
- Navigation to register page
- Root path redirect to login

✅ **Google Sign-In**
- Button rendering
- Button click handling (with mocked prompt)

### Register Page Tests (`register.cy.ts`)

✅ **Page Rendering**
- All UI elements are visible
- All form fields, labels, and buttons are present

✅ **Form Validation**
- Required field validation (first name, last name)
- Email format validation
- Password length validation
- Password confirmation matching validation
- Valid form submission

✅ **Successful Registration Flow**
- Register as Student → navigates to `/login`
- Register as Instructor → navigates to `/login`
- Username derivation from email

✅ **Failed Registration Flow**
- Error message for duplicate email
- Error message for duplicate username
- Error message for server errors

✅ **Role Selection**
- Default role (Student)
- Role change functionality
- Role sent correctly in API request

✅ **Google Sign-Up**
- Button rendering
- Button click handling with role selection

### Navigation Tests (`navigation.cy.ts`)

✅ **Page Navigation**
- Login ↔ Register navigation
- Direct URL access
- Root path behavior

✅ **Post-Authentication Navigation**
- Student login → `/student/home`
- Instructor login → `/instructor/home`
- Registration → `/login`

✅ **Error Handling**
- Stay on page after failed login
- Stay on page after failed registration
- Error messages displayed correctly

## API Mocking

Since the backend APIs are not yet hosted, all API calls are **mocked** using Cypress `cy.intercept()`:

### Mocked Endpoints

1. **POST `/api/auth/login`**
   - Success: 200 status with user data and role
   - Failure: 401/500 status with error message

2. **POST `/api/auth/register`**
   - Success: 201 status with success message
   - Failure: 409/500 status with error message

3. **POST `/api/auth/google`**
   - Success: 200 status with user data
   - Used for Google authentication flow

### Example Mock

```typescript
cy.intercept("POST", "**/api/auth/login", {
  statusCode: 200,
  body: {
    status: "success",
    token: "mock-jwt-token",
    data: {
      user: {
        id: 1,
        email: "test@mail.com",
        role: "Student",
      },
    },
  },
}).as("loginRequest");
```

## Important Notes

### Google Authentication

The current implementation uses `window.prompt()` for Google authentication (temporary solution). In tests:
- We stub `window.prompt()` to return a mock token
- This allows testing the API call flow without manual intervention
- When real Google OAuth is implemented, these tests will need updates

### Navigation Routes

Some routes referenced in the code may not exist yet:
- `/student/home` - Referenced but may show 404 if not implemented
- `/instructor/home` - Referenced but may show 404 if not implemented

The tests verify that navigation **attempts** are made, which is the important part for E2E testing.

### Test Data

All test data is:
- **Fake/Generated** - No real user accounts are used
- **Isolated** - Each test is independent
- **Mocked** - API responses are controlled

## Configuration

### Cypress Config (`cypress.config.ts`)

- **baseUrl**: `http://localhost:5173` (Vite default)
- **viewportWidth**: 1280px
- **viewportHeight**: 720px
- **defaultCommandTimeout**: 10 seconds
- **requestTimeout**: 10 seconds
- **responseTimeout**: 10 seconds

### Adjusting Base URL

If your dev server runs on a different port, update:
1. `cypress.config.ts` → `baseUrl`
2. Individual test files → `baseUrl` constant (if used)

## Best Practices

1. **Each test is independent** - No shared state between tests
2. **API calls are mocked** - Tests don't depend on real backend
3. **Clear test descriptions** - Each test explains what it's testing
4. **Step-by-step comments** - Code comments explain each step
5. **Realistic test data** - Uses data that matches real-world scenarios

## Troubleshooting

### Tests fail with "Cannot connect to server"

- Ensure the dev server is running: `npm run dev`
- Check the baseUrl in `cypress.config.ts` matches your server URL
- Verify the server is accessible in your browser

### Tests fail with "Element not found"

- Check that the page has loaded completely
- Verify selectors match the actual HTML structure
- Use Cypress's built-in selector tools in the Test Runner

### API mocks not working

- Verify the intercept pattern matches the actual API URL
- Check that the API is being called (use `cy.wait()`)
- Ensure the mock response format matches what the code expects

## Future Enhancements

When the backend is hosted, consider:
1. **Environment-based testing** - Switch between mocked and real APIs
2. **Test data cleanup** - Clean up test users after tests
3. **Real Google OAuth** - Update Google auth tests for real flow
4. **Performance testing** - Add tests for page load times
5. **Accessibility testing** - Add a11y checks

## Contributing

When adding new tests:
1. Follow the existing test structure and naming conventions
2. Add detailed comments explaining each step
3. Mock all API calls (backend not hosted yet)
4. Ensure tests are independent and can run in any order
5. Update this README if adding new test files or major features

