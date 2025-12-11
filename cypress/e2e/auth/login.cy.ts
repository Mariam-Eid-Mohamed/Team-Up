/// <reference types="cypress" />

/**
 * E2E Tests for Login Page
 * 
 * This test suite covers:
 * - Page rendering and UI elements
 * - Form validation (client-side)
 * - Successful login flow with mocked API
 * - Failed login flow with error handling
 * - Navigation between pages
 * - Remember me checkbox functionality
 * - Google sign-in button (UI only, since it uses prompt)
 */

describe("Login Page E2E Tests", () => {
  // Base URL for the application - adjust if your dev server runs on different port
  const baseUrl = "http://localhost:5173";

  beforeEach(() => {
    // Step 1: Visit the login page before each test
    // This ensures a clean state for each test
    cy.visit(`${baseUrl}/login`);
  });

  describe("Page Rendering and UI Elements", () => {
    it("should render all login page elements correctly", () => {
      // Step 2: Verify the page header text is visible
      // This confirms the page loaded successfully
      cy.contains("Welcome back!").should("be.visible");
      cy.contains("Login to your account").should("be.visible");

      // Step 3: Verify form inputs are present with correct placeholders
      // These placeholders match the Login component implementation
      cy.get('input[placeholder="john@mail.com"]').should("be.visible");
      cy.get('input[placeholder="Enter password"]').should("be.visible");

      // Step 4: Verify form labels are present
      cy.contains("label", "E-mail").should("be.visible");
      cy.contains("label", "Password").should("be.visible");

      // Step 5: Verify Remember me checkbox is present
      cy.contains("Remember me").should("be.visible");
      cy.get('input[type="checkbox"]').should("be.visible");

      // Step 6: Verify Forgot password link is present
      cy.contains("Forgot password?").should("be.visible");

      // Step 7: Verify Login button is present
      cy.contains("button", "Login").should("be.visible");

      // Step 8: Verify Google sign-in button is present
      cy.contains("button", "Sign in with Google").should("be.visible");

      // Step 9: Verify navigation link to register page
      cy.contains("Don't have an account?").should("be.visible");
      cy.contains("Sign up").should("be.visible");
    });
  });

  describe("Form Validation - Client Side", () => {
    it("should show validation error for invalid email format", () => {
      // Step 1: Type an invalid email (missing @ symbol)
      // This tests the Zod email validation schema
      cy.get('input[placeholder="john@mail.com"]').type("invalid-email");

      // Step 2: Type a valid password to trigger validation
      cy.get('input[placeholder="Enter password"]').type("123456");

      // Step 3: Attempt to submit the form
      cy.contains("button", "Login").click();

      // Step 4: Verify validation error message appears
      // The error should be displayed by react-hook-form + Zod
      cy.contains("Invalid email").should("be.visible");
    });

    it("should show validation error for password less than 6 characters", () => {
      // Step 1: Type a valid email
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");

      // Step 2: Type a password shorter than 6 characters
      // This tests the Zod min length validation
      cy.get('input[placeholder="Enter password"]').type("12345");

      // Step 3: Attempt to submit the form
      cy.contains("button", "Login").click();

      // Step 4: Verify validation error message appears
      cy.contains("Password must be at least 6 characters").should("be.visible");
    });

    it("should allow submission with valid email and password", () => {
      // Step 1: Mock the API call for successful login
      // Since backend is not hosted, we intercept the API request
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
              first_name: "Test",
              last_name: "User",
            },
          },
        },
      }).as("loginRequest");

      // Step 2: Fill in valid credentials
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Login").click();

      // Step 4: Verify the API was called with correct payload
      cy.wait("@loginRequest").then((interception) => {
        // Verify request body matches what the Login component sends
        expect(interception.request.body).to.deep.equal({
          email: "test@mail.com",
          password: "password123",
          rememberMe: false, // Default value
        });
      });
    });
  });

  describe("Successful Login Flow", () => {
    it("should successfully login as Student and navigate to student home", () => {
      // Step 1: Mock successful login response for Student role
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        body: {
          status: "success",
          token: "mock-jwt-token",
          data: {
            user: {
              id: 1,
              email: "student@mail.com",
              role: "Student",
              first_name: "Student",
              last_name: "User",
            },
          },
        },
      }).as("studentLogin");

      // Step 2: Fill in login credentials
      cy.get('input[placeholder="john@mail.com"]').type("student@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call to complete
      cy.wait("@studentLogin");

      // Step 5: Verify navigation to student home page
      // Note: If /student/home route doesn't exist yet, this will show 404
      // but the navigation attempt is still tested
      cy.url().should("include", "/student/home");
    });

    it("should successfully login as Instructor and navigate to instructor home", () => {
      // Step 1: Mock successful login response for Instructor role
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 200,
        body: {
          status: "success",
          token: "mock-jwt-token",
          data: {
            user: {
              id: 2,
              email: "instructor@mail.com",
              role: "Instructor",
              first_name: "Instructor",
              last_name: "User",
            },
          },
        },
      }).as("instructorLogin");

      // Step 2: Fill in login credentials
      cy.get('input[placeholder="john@mail.com"]').type("instructor@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call to complete
      cy.wait("@instructorLogin");

      // Step 5: Verify navigation to instructor home page
      cy.url().should("include", "/instructor/home");
    });

    it("should include rememberMe flag when checkbox is checked", () => {
      // Step 1: Mock the login API
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
      }).as("loginWithRememberMe");

      // Step 2: Fill in credentials
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");

      // Step 3: Check the Remember me checkbox
      cy.get('input[type="checkbox"]').check();

      // Step 4: Submit the form
      cy.contains("button", "Login").click();

      // Step 5: Verify the API was called with rememberMe: true
      cy.wait("@loginWithRememberMe").then((interception) => {
        expect(interception.request.body.rememberMe).to.equal(true);
      });
    });
  });

  describe("Failed Login Flow - Error Handling", () => {
    it("should display error message for invalid credentials", () => {
      // Step 1: Mock failed login response (401 Unauthorized)
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 401,
        body: {
          status: "error",
          message: "Invalid email or password",
        },
      }).as("failedLogin");

      // Step 2: Fill in credentials (even if invalid)
      cy.get('input[placeholder="john@mail.com"]').type("wrong@mail.com");
      cy.get('input[placeholder="Enter password"]').type("wrongpassword");

      // Step 3: Submit the form
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call
      cy.wait("@failedLogin");

      // Step 5: Verify error message is displayed
      // The Login component sets error on the email field
      cy.contains("Invalid email or password").should("be.visible");
    });

    it("should display generic error message for server errors", () => {
      // Step 1: Mock server error response (500)
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 500,
        body: {
          status: "error",
          message: "Internal server error",
        },
      }).as("serverError");

      // Step 2: Fill in credentials
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call
      cy.wait("@serverError");

      // Step 5: Verify error message is displayed
      // The Login component shows error.response?.data?.message or "Login failed"
      cy.contains(/Internal server error|Login failed/).should("be.visible");
    });
  });

  describe("Navigation", () => {
    it("should navigate to register page when clicking Sign up link", () => {
      // Step 1: Click on the "Sign up" link
      cy.contains("Sign up").click();

      // Step 2: Verify URL changed to register page
      cy.url().should("include", "/register");

      // Step 3: Verify register page elements are visible
      cy.contains("Create your account").should("be.visible");
      cy.contains("Register").should("be.visible");
    });

    it("should navigate to login page from root path", () => {
      // Step 1: Visit root path
      cy.visit(`${baseUrl}/`);

      // Step 2: Verify login page is displayed
      cy.contains("Login to your account").should("be.visible");
    });
  });

  describe("Google Sign-In Button", () => {
    it("should render Google sign-in button with correct text", () => {
      // Step 1: Verify Google sign-in button is present
      cy.contains("button", "Sign in with Google").should("be.visible");

      // Step 2: Verify Google icon is present
      cy.get('img[alt="Google"]').should("be.visible");
    });

    it("should handle Google sign-in button click (prompt will appear)", () => {
      // Step 1: Mock the Google auth API call
      // Note: The actual implementation uses window.prompt() which Cypress can't fully test
      // But we can verify the button is clickable and the API would be called
      cy.intercept("POST", "**/api/auth/google", {
        statusCode: 200,
        body: {
          status: "success",
          token: "mock-google-token",
          data: {
            user: {
              id: 1,
              email: "google@mail.com",
              role: "Student",
            },
          },
        },
      }).as("googleAuth");

      // Step 2: Stub window.prompt to return a mock token
      // This allows us to test the flow without manual intervention
      cy.window().then((win) => {
        cy.stub(win, "prompt").returns("mock-google-id-token");
      });

      // Step 3: Click Google sign-in button
      cy.contains("button", "Sign in with Google").click();

      // Step 4: Verify the prompt was called (if we want to test that)
      // Note: The actual API call won't happen if prompt returns null
      // But we've stubbed it to return a token, so the API should be called
      cy.wait("@googleAuth", { timeout: 10000 }).then((interception) => {
        expect(interception.request.body).to.have.property("token");
        expect(interception.request.body.token).to.equal("mock-google-id-token");
      });
    });
  });

  describe("Form Interaction", () => {
    it("should clear form inputs when typing new values", () => {
      // Step 1: Type initial values
      cy.get('input[placeholder="john@mail.com"]').type("old@mail.com");
      cy.get('input[placeholder="Enter password"]').type("oldpassword");

      // Step 2: Clear and type new values
      cy.get('input[placeholder="john@mail.com"]').clear().type("new@mail.com");
      cy.get('input[placeholder="Enter password"]').clear().type("newpassword");

      // Step 3: Verify new values are in the inputs
      cy.get('input[placeholder="john@mail.com"]').should("have.value", "new@mail.com");
      cy.get('input[placeholder="Enter password"]').should("have.value", "newpassword");
    });

    it("should toggle remember me checkbox", () => {
      // Step 1: Verify checkbox starts unchecked
      cy.get('input[type="checkbox"]').should("not.be.checked");

      // Step 2: Check the checkbox
      cy.get('input[type="checkbox"]').check();

      // Step 3: Verify checkbox is checked
      cy.get('input[type="checkbox"]').should("be.checked");

      // Step 4: Uncheck the checkbox
      cy.get('input[type="checkbox"]').uncheck();

      // Step 5: Verify checkbox is unchecked
      cy.get('input[type="checkbox"]').should("not.be.checked");
    });
  });
});

