/// <reference types="cypress" />

/**
 * E2E Tests for Navigation Between Auth Pages
 * 
 * This test suite covers:
 * - Navigation flow between Login and Register pages
 * - Direct URL access to auth pages
 * - Root path redirect behavior
 * - Navigation after successful authentication
 */

describe("Auth Navigation E2E Tests", () => {
  // Base URL for the application
  const baseUrl = "http://localhost:5173";

  describe("Navigation Between Login and Register", () => {
    it("should navigate from login to register page", () => {
      // Step 1: Start at login page
      cy.visit(`${baseUrl}/login`);

      // Step 2: Verify we're on login page
      cy.contains("Login to your account").should("be.visible");

      // Step 3: Click "Sign up" link
      cy.contains("Sign up").click();

      // Step 4: Verify we navigated to register page
      cy.url().should("include", "/register");
      cy.contains("Create your account").should("be.visible");
    });

    it("should navigate from register to login page", () => {
      // Step 1: Start at register page
      cy.visit(`${baseUrl}/register`);

      // Step 2: Verify we're on register page
      cy.contains("Create your account").should("be.visible");

      // Step 3: Click "Sign in" link
      cy.contains("Sign in").click();

      // Step 4: Verify we navigated to login page
      cy.url().should("include", "/login");
      cy.contains("Login to your account").should("be.visible");
    });

    it("should maintain form state when navigating back and forth", () => {
      // Step 1: Start at login page and type email
      cy.visit(`${baseUrl}/login`);
      cy.get('input[placeholder="john@mail.com"]').type("test@mail.com");

      // Step 2: Navigate to register
      cy.contains("Sign up").click();

      // Step 3: Navigate back to login
      cy.contains("Sign in").click();

      // Step 4: Verify form is cleared (new page load)
      cy.get('input[placeholder="john@mail.com"]').should("have.value", "");
    });
  });

  describe("Direct URL Access", () => {
    it("should load login page when accessing /login directly", () => {
      // Step 1: Visit login page directly via URL
      cy.visit(`${baseUrl}/login`);

      // Step 2: Verify login page loaded correctly
      cy.contains("Login to your account").should("be.visible");
      cy.url().should("include", "/login");
    });

    it("should load register page when accessing /register directly", () => {
      // Step 1: Visit register page directly via URL
      cy.visit(`${baseUrl}/register`);

      // Step 2: Verify register page loaded correctly
      cy.contains("Create your account").should("be.visible");
      cy.url().should("include", "/register");
    });

    it("should load login page when accessing root path", () => {
      // Step 1: Visit root path
      cy.visit(`${baseUrl}/`);

      // Step 2: Verify login page is displayed (based on App.tsx routing)
      cy.contains("Login to your account").should("be.visible");
      cy.url().should("include", "/login");
    });
  });

  describe("Navigation After Authentication", () => {
    it("should navigate to student home after successful login as Student", () => {
      // Step 1: Mock successful login for Student
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
            },
          },
        },
      }).as("studentLogin");

      // Step 2: Visit login page
      cy.visit(`${baseUrl}/login`);

      // Step 3: Fill and submit login form
      cy.get('input[placeholder="john@mail.com"]').type("student@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call
      cy.wait("@studentLogin");

      // Step 5: Verify navigation to student home
      cy.url().should("include", "/student/home");
    });

    it("should navigate to instructor home after successful login as Instructor", () => {
      // Step 1: Mock successful login for Instructor
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
            },
          },
        },
      }).as("instructorLogin");

      // Step 2: Visit login page
      cy.visit(`${baseUrl}/login`);

      // Step 3: Fill and submit login form
      cy.get('input[placeholder="john@mail.com"]').type("instructor@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call
      cy.wait("@instructorLogin");

      // Step 5: Verify navigation to instructor home
      cy.url().should("include", "/instructor/home");
    });

    it("should navigate to login page after successful registration", () => {
      // Step 1: Mock successful registration
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 201,
        body: {
          status: "success",
          message: "User registered successfully",
        },
      }).as("register");

      // Step 2: Visit register page
      cy.visit(`${baseUrl}/register`);

      // Step 3: Fill and submit registration form
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("newuser@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");
      cy.contains("button", "Register").click();

      // Step 4: Wait for API call
      cy.wait("@register");

      // Step 5: Verify navigation to login page
      cy.url().should("include", "/login");
      cy.contains("Login to your account").should("be.visible");
    });
  });

  describe("Error Handling and Navigation", () => {
    it("should stay on login page after failed login", () => {
      // Step 1: Mock failed login
      cy.intercept("POST", "**/api/auth/login", {
        statusCode: 401,
        body: {
          status: "error",
          message: "Invalid email or password",
        },
      }).as("failedLogin");

      // Step 2: Visit login page
      cy.visit(`${baseUrl}/login`);

      // Step 3: Fill and submit login form with invalid credentials
      cy.get('input[placeholder="john@mail.com"]').type("wrong@mail.com");
      cy.get('input[placeholder="Enter password"]').type("wrongpassword");
      cy.contains("button", "Login").click();

      // Step 4: Wait for API call
      cy.wait("@failedLogin");

      // Step 5: Verify we're still on login page
      cy.url().should("include", "/login");
      cy.contains("Login to your account").should("be.visible");

      // Step 6: Verify error message is displayed
      cy.contains("Invalid email or password").should("be.visible");
    });

    it("should stay on register page after failed registration", () => {
      // Step 1: Mock failed registration
      cy.intercept("POST", "**/api/auth/register", {
        statusCode: 409,
        body: {
          status: "error",
          message: "Email already exists",
        },
      }).as("failedRegister");

      // Step 2: Visit register page
      cy.visit(`${baseUrl}/register`);

      // Step 3: Fill and submit registration form
      cy.get('input[placeholder="John"]').type("John");
      cy.get('input[placeholder="Doe"]').type("Doe");
      cy.get('input[placeholder="john@mail.com"]').type("existing@mail.com");
      cy.get('input[placeholder="Enter password"]').type("password123");
      cy.get('input[placeholder="Confirm password"]').type("password123");
      cy.contains("button", "Register").click();

      // Step 4: Wait for API call
      cy.wait("@failedRegister");

      // Step 5: Verify we're still on register page
      cy.url().should("include", "/register");
      cy.contains("Create your account").should("be.visible");

      // Step 6: Verify error message is displayed
      cy.contains("Email already exists").should("be.visible");
    });
  });
});

