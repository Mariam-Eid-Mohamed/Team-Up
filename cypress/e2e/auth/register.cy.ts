/// <reference types="cypress" />

/**
 * E2E Tests for Register Page
 * 
 * This test suite covers:
 * - Page rendering and UI elements
 * - Form validation (client-side)
 * - Successful registration flow with mocked API
 * - Failed registration flow with error handling
 * - Navigation between pages
 * - Role selection (Student/Instructor)
 * - Password confirmation matching
 * - Google sign-up button (UI only, since it uses prompt)
 */

describe("Register Page E2E Tests", () => {
  // Base URL for the application - adjust if your dev server runs on different port
  const baseUrl = "http://localhost:5173";

  beforeEach(() => {
    // Step 1: Visit the register page before each test
    // This ensures a clean state for each test
    cy.visit(`${baseUrl}/register`);
  });

  describe("Page Rendering and UI Elements", () => {
    it("should render all register page elements correctly", () => {
      // Step 2: Verify the page header text is visible
      cy.contains("Create your account").should("be.visible");
      cy.contains("Register").should("be.visible");

      // Step 3: Verify all form inputs are present with correct placeholders
      cy.get('input[placeholder="John"]').should("be.visible");
      cy.get('input[placeholder="Doe"]').should("be.visible");
      cy.get('input[placeholder="john@mail.com"]').should("be.visible");
      cy.get('input[placeholder="Enter password"]').should("be.visible");
      cy.get('input[placeholder="Confirm password"]').should("be.visible");

      // Step 4: Verify form labels are present
      cy.contains("label", "First Name").should("be.visible");
      cy.contains("label", "Last Name").should("be.visible");
      cy.contains("label", "Email").should("be.visible");
      cy.contains("label", "Password").should("be.visible");
      cy.contains("label", "Confirm Password").should("be.visible");
      cy.contains("label", "Role").should("be.visible");

      // Step 5: Verify role select dropdown is present
      cy.get('select').should("be.visible");
      cy.get('select option[value="Instructor"]').should("exist");
      cy.get('select option[value="Student"]').should("exist");

      // Step 6: Verify Register button is present
      cy.contains("button", "Register").should("be.visible");

      // Step 7: Verify Google sign-up button is present
      cy.contains("button", "Sign up with Google").should("be.visible");

      // Step 8: Verify navigation link to login page
      cy.contains("Already have an account?").should("be.visible");
      cy.contains("Sign in").should("be.visible");
    });
  });

  describe("Form Validation - Client Side", () => {
    it("should show validation error for empty first name", () => {
      // Step 1: Leave first name empty and fill other required fields
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 2: Attempt to submit the form
      cy.contains("button", "Register").click();

      // Step 3: Verify validation error appears
      cy.contains("First Name is required").should("be.visible");
    });

    it("should show validation error for empty last name", () => {
      // Step 1: Leave last name empty and fill other required fields
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 2: Attempt to submit the form
      cy.contains("button", "Register").click();

      // Step 3: Verify validation error appears
      cy.contains("Last Name is required").should("be.visible");
    });

    it("should show validation error for invalid email format", () => {
      // Step 1: Fill form with invalid email
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("invalid-email");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 2: Attempt to submit the form
      cy.contains("button", "Register").click();

      // Step 3: Verify validation error appears
      cy.contains("Invalid email").should("be.visible");
    });

    it("should show validation error for password less than 6 characters", () => {
      // Step 1: Fill form with short password
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("12345");
      cy.get('input[placeholder="Confirm password"]').type("12345");

      // Step 2: Attempt to submit the form
      cy.contains("button", "Register").click();

      // Step 3: Verify validation error appears
      cy.contains("Password must be at least 6 characters").should("be.visible");
    });

    it("should show validation error when passwords do not match", () => {
      // Step 1: Fill form with mismatched passwords
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password456");

      // Step 2: Attempt to submit the form
      cy.contains("button", "Register").click();

      // Step 3: Verify validation error appears
      // This tests the Zod refine() validation for password matching
      cy.contains("Passwords must match").should("be.visible");
    });

    it("should allow submission with all valid fields", () => {
      // Step 1: Mock the API call for successful registration
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
          message: "User registered successfully",
        },
      }).as("registerRequest");

      // Step 2: Fill in all form fields with valid data
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("newuser@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Register").click();

      // Step 4: Verify the API was called with correct payload
      cy.wait("@registerRequest").then((interception) => {
        // Verify request body matches what the Register component sends
        expect(interception.request.body).to.deep.equal({
          first_name: "John",
          last_name: "Doe",
          email: "newuser@mail.com",
          username: "newuser", // Derived from email (before @)
          password: "password123",
          role: "Student", // Default value
          rememberMe: false, // Always false in Register component
        });
      });
    });
  });

  describe("Successful Registration Flow", () => {
    it("should successfully register as Student and navigate to login", () => {
      // Step 1: Mock successful registration response
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
          message: "User registered successfully",
        },
      }).as("studentRegister");

      // Step 2: Fill in all form fields
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("student@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Ensure role is set to Student (default)
      cy.get('select').should("have.value", "Student");

      // Step 4: Submit the form
      cy.contains("button", "Register").click();

      // Step 5: Wait for API call to complete
      cy.wait("@studentRegister");

      // Step 6: Verify navigation to login page
      cy.url().should("include", "/login");
    });

    it("should successfully register as Instructor and navigate to login", () => {
      // Step 1: Mock successful registration response
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
          message: "User registered successfully",
        },
      }).as("instructorRegister");

      // Step 2: Fill in all form fields
      cy.get('input[placeholder="John"]').type("Jane");
      cy.get('input[placeholder="Doe"]').type("Smith");
      cy.get('input[placeholder="john@mail.com"]').type("instructor@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Select Instructor role
      cy.get('select').select("Instructor");

      // Step 4: Submit the form
      cy.contains("button", "Register").click();

      // Step 5: Wait for API call to complete
      cy.wait("@instructorRegister").then((interception) => {
        // Verify the role was sent correctly
        expect(interception.request.body.role).to.equal("Instructor");
      });

      // Step 6: Verify navigation to login page
      cy.url().should("include", "/login");
    });

    it("should derive username from email correctly", () => {
      // Step 1: Mock the registration API
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
        },
      }).as("registerWithUsername");

      // Step 2: Fill in form with email that will be split for username
      cy.get('input[placeholder="John"]').type("Test");
      cy.get('input[placeholder="Doe"]').type("User");
      cy.get('input[placeholder="john@mail.com"]').type("testuser@example.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Register").click();

      // Step 4: Verify username is derived correctly (email before @)
      cy.wait("@registerWithUsername").then((interception) => {
        expect(interception.request.body.username).to.equal("testuser");
        expect(interception.request.body.email).to.equal("testuser@example.com");
      });
    });
  });

  describe("Failed Registration Flow - Error Handling", () => {
    it("should display error message for duplicate email", () => {
      // Step 1: Mock failed registration response (409 Conflict - email already exists)
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 409,
        body: {
          status: "error",
          message: "Email already exists",
        },
      }).as("duplicateEmail");

      // Step 2: Fill in all form fields
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("existing@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Register").click();

      // Step 4: Wait for API call
      cy.wait("@duplicateEmail");

      // Step 5: Verify error message is displayed
      // The Register component sets error on the email field
      cy.contains("Email already exists").should("be.visible");
    });

    it("should display error message for duplicate username", () => {
      // Step 1: Mock failed registration response (409 Conflict - username already exists)
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 409,
        body: {
          status: "error",
          message: "Username already exists",
        },
      }).as("duplicateUsername");

      // Step 2: Fill in all form fields
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("newemail@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Register").click();

      // Step 4: Wait for API call
      cy.wait("@duplicateUsername");

      // Step 5: Verify error message is displayed
      cy.contains("Username already exists").should("be.visible");
    });

    it("should display generic error message for server errors", () => {
      // Step 1: Mock server error response (500)
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 500,
        body: {
          status: "error",
          message: "Internal server error",
        },
      }).as("serverError");

      // Step 2: Fill in all form fields
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Submit the form
      cy.contains("button", "Register").click();

      // Step 4: Wait for API call
      cy.wait("@serverError");

      // Step 5: Verify error message is displayed
      // The Register component shows error.response?.data?.message or "Registration failed"
      cy.contains(/Internal server error|Registration failed/).should("be.visible");
    });
  });

  describe("Role Selection", () => {
    it("should default to Student role", () => {
      // Step 1: Verify the select dropdown defaults to Student
      cy.get('select').should("have.value", "Student");
    });

    it("should allow changing role to Instructor", () => {
      // Step 1: Select Instructor from dropdown
      cy.get('select').select("Instructor");

      // Step 2: Verify the value changed
      cy.get('select').should("have.value", "Instructor");
    });

    it("should send selected role in registration request", () => {
      // Step 1: Mock the registration API
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
        },
      }).as("registerWithRole");

      // Step 2: Fill in form
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");

      // Step 3: Select Instructor role
      cy.get('select').select("Instructor");

      // Step 4: Submit the form
      cy.contains("button", "Register").click();

      // Step 5: Verify the role was sent correctly
      cy.wait("@registerWithRole").then((interception) => {
        expect(interception.request.body.role).to.equal("Instructor");
      });
    });
  });

  describe("Navigation", () => {
    it("should navigate to login page when clicking Sign in link", () => {
      // Step 1: Click on the "Sign in" link
      cy.contains("Sign in").click();

      // Step 2: Verify URL changed to login page
      cy.url().should("include", "/login");

      // Step 3: Verify login page elements are visible
      cy.contains("Login to your account").should("be.visible");
    });
  });

  describe("Google Sign-Up Button", () => {
    it("should render Google sign-up button with correct text", () => {
      // Step 1: Verify Google sign-up button is present
      cy.contains("button", "Sign up with Google").should("be.visible");

      // Step 2: Verify Google icon is present
      cy.get('img[alt="Google"]').should("be.visible");
    });

    it("should handle Google sign-up button click with selected role", () => {
      // Step 1: Mock the Google auth API call
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

      // Step 2: Select a role (e.g., Instructor)
      cy.get('select').select("Instructor");

      // Step 3: Stub window.prompt to return a mock token
      cy.window().then((win) => {
        cy.stub(win, "prompt").returns("mock-google-id-token");
      });

      // Step 4: Click Google sign-up button
      cy.contains("button", "Sign up with Google").click();

      // Step 5: Verify the API was called with token and role
      cy.wait("@googleAuth", { timeout: 10000 }).then((interception) => {
        expect(interception.request.body).to.have.property("token");
        expect(interception.request.body.token).to.equal("mock-google-id-token");
        expect(interception.request.body.role).to.equal("Instructor");
      });
    });
  });

  describe("Form Interaction", () => {
    it("should allow typing in all input fields", () => {
      // Step 1: Type in first name
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="John"]').should("have.value", "John");

      // Step 2: Type in last name
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="Doe"]').should("have.value", "Doe");

      // Step 3: Type in email
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");
      cy.get('input[placeholder="john@mail.com"]').should("have.value", "test@mail.com");

      // Step 4: Type in password
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Enter password"]').should("have.value", "password123");

      // Step 5: Type in confirm password
      cy.get('input[placeholder="Confirm password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').should("have.value", "password123");
    });

    it("should clear form inputs when typing new values", () => {
      // Step 1: Type initial values
      cy.get('input[placeholder="John"]').type("Old");
      cy.get('input[placeholder="Doe"]').type("Name");

      // Step 2: Clear and type new values
      cy.get('input[placeholder="John"]').clear().type("New");
      cy.get('input[placeholder="Doe"]').clear().type("Name");

      // Step 3: Verify new values are in the inputs
      cy.get('input[placeholder="John"]').should("have.value", "New");
      cy.get('input[placeholder="Doe"]').should("have.value", "Name");
    });
  });
});

